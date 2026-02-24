import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(certificates);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { title, description } = await request.json();
  const { data, error } = await supabase
    .from("certificates")
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
    .from("certificates")
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
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Certificates deleted successfully" });
}
