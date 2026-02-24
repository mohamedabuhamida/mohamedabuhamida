import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
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
    .update({
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

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const { error } = await supabase.from("hero").delete().eq("id", 1);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
