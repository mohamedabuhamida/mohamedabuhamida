import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const supabase = await createClient();
  const { data: achievements, error } = await supabase
    .from("achievements")
    .select("*")
    .order("order_index", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(achievements);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("achievements")
    .insert({
      title: body.title,
      organization: body.organization || null,
      date: body.date || null,
      description: body.description || null,
      certificate_url: body.certificate_url || null,
      order_index: body.order_index ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("achievements")
    .update({
      title: body.title,
      organization: body.organization || null,
      date: body.date || null,
      description: body.description || null,
      certificate_url: body.certificate_url || null,
      order_index: body.order_index ?? null,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { id } = await request.json();
  const { error } = await supabase.from("achievements").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Achievement deleted successfully" });
}