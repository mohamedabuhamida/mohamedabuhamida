import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { requireAuthenticatedUser } from "@/lib/auth/require-auth"

const BUCKET = "cv-files"

function json(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

/* ============================
   GET → Return Signed URL
============================ */
export async function GET() {
  const supabase = supabaseAdmin

  // 1️⃣ Get active CV
  const { data, error } = await supabase
    .from("cv_files")
    .select("*")
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return new NextResponse("No active CV found", { status: 404 })
  }

  // 2️⃣ Generate short-lived signed URL (internal use only)
  const { data: signedUrlData, error: signedError } =
    await supabase.storage
      .from(BUCKET)
      .createSignedUrl(data.file_path, 10) // 10 seconds enough

  if (signedError || !signedUrlData?.signedUrl) {
    return new NextResponse("Failed to generate signed URL", { status: 500 })
  }

  // 3️⃣ Fetch file from Supabase
  const fileResponse = await fetch(signedUrlData.signedUrl)

  if (!fileResponse.ok) {
    return new NextResponse("Failed to fetch file", { status: 500 })
  }

  const fileBuffer = await fileResponse.arrayBuffer()

  // 4️⃣ Return file directly to user (no Supabase URL exposed)
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.file_name}"`,
      "Cache-Control": "no-store",
    },
  })
}
/* ============================
   POST → Upload New CV
============================ */
export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (auth.response) return auth.response

  const supabase = supabaseAdmin
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return json({ error: "File is required" }, 400)
  }

  if (file.type !== "application/pdf") {
    return json({ error: "Only PDF files allowed" }, 400)
  }

  if (file.size > 5 * 1024 * 1024) {
    return json({ error: "File too large (max 5MB)" }, 400)
  }

  const filePath = `cv-${Date.now()}.pdf`

  /* 1️⃣ Upload to Storage */
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType: "application/pdf",
      upsert: false,
    })

  if (uploadError) {
    return json({ error: "Upload failed" }, 500)
  }

  /* 2️⃣ Deactivate old CV */
  await supabase
    .from("cv_files")
    .update({ is_active: false })
    .eq("is_active", true)

  /* 3️⃣ Insert new row */
  const { error: dbError } = await supabase
    .from("cv_files")
    .insert({
      file_name: file.name,
      file_path: filePath,
      is_active: true,
    })

  if (dbError) {
    return json({ error: "Database insert failed" }, 500)
  }

  return json({ message: "CV uploaded successfully" })
}

/* ============================
   PUT → Replace Current CV
============================ */
export async function PUT(request: Request) {
  const auth = await requireAuthenticatedUser()
  if (auth.response) return auth.response

  return POST(request)
}

/* ============================
   DELETE → Delete Active CV
============================ */
export async function DELETE() {
  const auth = await requireAuthenticatedUser()
  if (auth.response) return auth.response

  const supabase = supabaseAdmin

  const { data, error } = await supabase
    .from("cv_files")
    .select("*")
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return json({ error: "No active CV found" }, 404)
  }

  /* Remove from storage */
  await supabase.storage
    .from(BUCKET)
    .remove([data.file_path])

  /* Remove from table */
  await supabase
    .from("cv_files")
    .delete()
    .eq("id", data.id)

  return json({ message: "CV deleted successfully" })
}
