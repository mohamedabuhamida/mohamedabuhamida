import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const supabase = await createClient();
  const { data: experience, error } = await supabase
    .from("experience")
    .select("*")
    .order("order_index", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(experience);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("experience")
    .insert({
      job_title: body.job_title,
      company: body.company,
      location: body.location || null,
      employment_type: body.employment_type || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      is_current: Boolean(body.is_current),
      description: body.description || null,
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
    .from("experience")
    .update({
      job_title: body.job_title,
      company: body.company,
      location: body.location || null,
      employment_type: body.employment_type || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      is_current: Boolean(body.is_current),
      description: body.description || null,
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
  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Experience deleted successfully" });
}