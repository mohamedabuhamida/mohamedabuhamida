import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

function toArray(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const supabase = await createClient();
  const orderedQuery = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: false });

  if (!orderedQuery.error) {
    return NextResponse.json(orderedQuery.data);
  }

  const fallbackQuery = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (!fallbackQuery.error) {
    return NextResponse.json(fallbackQuery.data);
  }

  const plainQuery = await supabase.from("projects").select("*");

  if (plainQuery.error) {
    return NextResponse.json({ error: plainQuery.error.message }, { status: 500 });
  }

  return NextResponse.json(plainQuery.data);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();
  const generatedId = `${slugify(body.title || "project")}-${Date.now().toString(36)}`;

  const payload = {
    id: body.id || generatedId,
    section: toArray(body.section),
    title: body.title,
    tagline: body.tagline,
    description: body.description,
    details: body.details,
    features: toArray(body.features),
    technologies: toArray(body.technologies),
    image: body.image,
    hero_image: body.hero_image,
    background_type: body.background_type,
    link: body.link,
    accent_color: body.accent_color,
    is_featured: body.is_featured,
    love: body.love ?? 0,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();

  const payload = {
    section: toArray(body.section),
    title: body.title,
    tagline: body.tagline,
    description: body.description,
    details: body.details,
    features: toArray(body.features),
    technologies: toArray(body.technologies),
    image: body.image,
    hero_image: body.hero_image,
    background_type: body.background_type,
    link: body.link,
    accent_color: body.accent_color,
    is_featured: body.is_featured,
    love: body.love ?? 0,
  };

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { id } = await request.json();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Project deleted successfully" });
}
