import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const supabase = await createClient();
  const { data: education, error } = await supabase
    .from("education")
    .select("*")
    .order("order_index", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(education);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("education")
    .insert({
      degree: body.degree,
      field_of_study: body.field_of_study || null,
      institution: body.institution,
      location: body.location || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      grade: body.grade || null,
      description: body.description || null,
      order_index: body.order_index ?? 0,
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
    .from("education")
    .update({
      degree: body.degree,
      field_of_study: body.field_of_study || null,
      institution: body.institution,
      location: body.location || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      grade: body.grade || null,
      description: body.description || null,
      order_index: body.order_index ?? 0,
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
  const { error } = await supabase.from("education").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Education deleted successfully" });
}
