import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: education, error } = await supabase
    .from("education")
    .select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(education);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { title, description } = await request.json();
  const { data, error } = await supabase
    .from("education")
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
    .from("education")
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
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "education deleted successfully" });
}
