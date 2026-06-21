import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_ASSETS_BUCKET || "portfolio-assets";
const MAX_IMAGE_SIZE_MB = 15;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") || "dashboard").replace(/[^a-zA-Z0-9-_]/g, "");
  const bucket = String(formData.get("bucket") || DEFAULT_BUCKET).replace(/[^a-zA-Z0-9-_]/g, "");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Image is too large (max ${MAX_IMAGE_SIZE_MB}MB)` },
      { status: 400 }
    );
  }

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

  return NextResponse.json({ bucket, path: filePath, url: publicData.publicUrl });
}
