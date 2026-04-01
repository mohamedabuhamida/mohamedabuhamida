import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const { data, error } = await supabaseAdmin
    .from("cv_files")
    .select("id, file_name, file_path, is_active, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
