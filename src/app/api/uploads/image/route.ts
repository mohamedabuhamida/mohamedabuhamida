import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_ASSETS_BUCKET || "portfolio-assets";

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") || "dashboard").replace(/[^a-zA-Z0-9-_]/g, "");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image is too large (max 5MB)" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);

  return NextResponse.json({ path: filePath, url: publicData.publicUrl });
}