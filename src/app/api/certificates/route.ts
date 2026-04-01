import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

function optionalString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function requiredString(value: unknown, field: string) {
  const normalized = optionalString(value);
  if (!normalized) {
    throw new Error(`${field} is required`);
  }

  return normalized;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function buildCertificatePayload(body: Record<string, unknown>) {
  return {
    title: requiredString(body.title, "Title"),
    organization: requiredString(body.organization, "Organization"),
    issue_date: optionalString(body.issue_date),
    expiration_date: optionalString(body.expiration_date),
    credential_id: optionalString(body.credential_id),
    credential_url: optionalString(body.credential_url),
    description: optionalString(body.description),
    order_index: optionalNumber(body.order_index) ?? 0,
  };
}

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

  try {
    const body = await request.json();
    const payload = buildCertificatePayload(body);

    const { data, error } = await supabaseAdmin
      .from("certificates")
      .insert(payload)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const payload = buildCertificatePayload(body);

    const { data, error } = await supabaseAdmin
      .from("certificates")
      .update(payload)
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const { id } = await request.json();
  const { error } = await supabaseAdmin.from("certificates").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Certificates deleted successfully" });
}
