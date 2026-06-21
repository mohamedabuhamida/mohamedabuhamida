import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_ASSETS_BUCKET || "portfolio-assets";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface StorageImageItem {
  name: string;
  path: string;
  folder: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StorageBucketItem {
  id: string;
  name: string;
  public: boolean;
  fileSizeLimit?: number | null;
  allowedMimeTypes?: string[] | null;
}

function sanitizeBucket(bucket: string | null) {
  return String(bucket || DEFAULT_BUCKET).replace(/[^a-zA-Z0-9-_]/g, "") || DEFAULT_BUCKET;
}

function sanitizeFolder(folder: string | null) {
  return String(folder || "").replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9/_-]/g, "");
}

function sanitizePath(path: string | null) {
  return String(path || "").replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9/._-]/g, "");
}

function isFolderLike(item: {
  id?: string | null;
  metadata?: { mimetype?: string; size?: number | null } | null;
}) {
  return !item.id && !item.metadata?.mimetype;
}

async function listStorageFiles(bucket: string, folder = ""): Promise<StorageImageItem[]> {
  const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    throw new Error(error.message);
  }

  const files: StorageImageItem[] = [];

  for (const item of data ?? []) {
    const itemPath = folder ? `${folder}/${item.name}` : item.name;

    if (isFolderLike(item)) {
      files.push(...(await listStorageFiles(bucket, itemPath)));
      continue;
    }

    const mimeType = item.metadata?.mimetype || "application/octet-stream";

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(itemPath);

    files.push({
      name: item.name,
      path: itemPath,
      folder,
      url: publicUrlData.publicUrl,
      size: item.metadata?.size || 0,
      mimeType,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    });
  }

  return files;
}

export async function GET(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (mode === "buckets") {
      const { data, error } = await supabaseAdmin.storage.listBuckets();

      if (error) {
        throw new Error(error.message);
      }

      const buckets: StorageBucketItem[] = (data ?? []).map((bucket) => ({
        id: bucket.id,
        name: bucket.name,
        public: Boolean(bucket.public),
        fileSizeLimit: bucket.file_size_limit,
        allowedMimeTypes: bucket.allowed_mime_types,
      }));

      return NextResponse.json(buckets);
    }

    const bucket = sanitizeBucket(searchParams.get("bucket"));
    const folder = sanitizeFolder(searchParams.get("folder"));
    const items = await listStorageFiles(bucket, folder);

    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list storage assets.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();
    const bucket = sanitizeBucket(String(formData.get("bucket") || DEFAULT_BUCKET));
    const folder = sanitizeFolder(String(formData.get("folder") || "dashboard"));
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File is too large (max 5MB)." }, { status: 400 });
    }

    const extension = file.name.split(".").pop() || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error } = await supabaseAdmin.storage.from(bucket).upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ path: filePath, url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const { bucket: rawBucket, fromPath, toPath } = await request.json();
    const bucket = sanitizeBucket(rawBucket);
    const sanitizedFromPath = sanitizePath(fromPath);
    const sanitizedToPath = sanitizePath(toPath);

    if (!sanitizedFromPath || !sanitizedToPath) {
      return NextResponse.json({ error: "Both source and destination paths are required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(bucket).move(sanitizedFromPath, sanitizedToPath);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(sanitizedToPath);

    return NextResponse.json({ path: sanitizedToPath, url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to rename image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();
    const bucket = sanitizeBucket(String(formData.get("bucket") || DEFAULT_BUCKET));
    const path = sanitizePath(String(formData.get("path") || ""));
    const file = formData.get("file") as File | null;

    if (!path || !file) {
      return NextResponse.json({ error: "File path and file are required." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File is too large (max 5MB)." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(bucket).update(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ path, url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to replace file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const { bucket: rawBucket, paths } = await request.json();
    const bucket = sanitizeBucket(rawBucket);
    const sanitizedPaths = Array.isArray(paths) ? paths.map((path) => sanitizePath(String(path))).filter(Boolean) : [];

    if (sanitizedPaths.length === 0) {
      return NextResponse.json({ error: "At least one file path is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove(sanitizedPaths);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
