import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const supabase = await createClient();

  const { data: heroData, error } = await supabase
    .from("hero")
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(heroData);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();

  const {
    title,
    name,
    typing_texts,
    years_experience,
    projects_count,
    is_available,
  } = await request.json();

  const { data, error } = await supabase
    .from("hero")
    .insert({
      title,
      name,
      typing_texts,
      years_experience,
      projects_count,
      is_available,
    })
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

  const {
    id,
    title,
    name,
    typing_texts,
    years_experience,
    projects_count,
    is_available,
  } = await request.json();

  const { data, error } = await supabase
    .from("hero")
    .update({
      title,
      name,
      typing_texts,
      years_experience,
      projects_count,
      is_available,
    })
    .eq("id", id)
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
  const { error } = await supabase.from("hero").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Hero deleted successfully" });
}
