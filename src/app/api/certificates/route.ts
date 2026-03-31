import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const supabase = await createClient();
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .order("order_index", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(certificates);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      title: body.title,
      organization: body.organization,
      issue_date: body.issue_date || null,
      expiration_date: body.expiration_date || null,
      credential_id: body.credential_id || null,
      credential_url: body.credential_url || null,
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
    .from("certificates")
    .update({
      title: body.title,
      organization: body.organization,
      issue_date: body.issue_date || null,
      expiration_date: body.expiration_date || null,
      credential_id: body.credential_id || null,
      credential_url: body.credential_url || null,
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
  const { error } = await supabase.from("certificates").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Certificates deleted successfully" });
}
