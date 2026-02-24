import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: experience, error } = await supabase
    .from("experience")
    .select("*")
    .order("order_index", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(experience);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { title, description } = await request.json();
  const { data, error } = await supabase
    .from("experience")
    .insert({ title, description })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { id, title, description } = await request.json();
  const { data, error } = await supabase
    .from("experience")
    .update({ title, description })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { id } = await request.json();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Axperience deleted successfully" });
}
