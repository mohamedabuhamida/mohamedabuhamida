import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const supabase = await createClient();
  const { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { name, percentage, order_index, category_id } = await request.json();

  const payload = {
    name,
    percentage,
    order_index: order_index ?? 0,
    category_id: category_id ?? null,
  };

  const { data, error } = await supabase.from("skills").insert(payload).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { id, name, percentage, order_index, category_id } = await request.json();

  const payload = {
    name,
    percentage,
    order_index: order_index ?? 0,
    category_id: category_id ?? null,
  };

  const { data, error } = await supabase
    .from("skills")
    .update(payload)
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
  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Skill deleted" });
}
