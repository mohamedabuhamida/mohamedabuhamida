import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { normalizeTags, slugify } from "@/lib/blog-utils";
import { revalidateBlogs } from "@/lib/blogs";

async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

async function ensureUniqueSlug(slug: string, id?: string) {
  const supabase = await createClient();
  let query = supabase.from("blogs").select("id").eq("slug", slug);

  if (id) {
    query = query.neq("id", id);
  }

  const { data, error } = await query.maybeSingle();
  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  if (data) {
    throw new Error("A blog with this slug already exists.");
  }
}

function toPayload(body: Record<string, unknown>) {
  return {
    title: String(body.title ?? ""),
    slug: slugify(String(body.slug || body.title || "")),
    description: String(body.description ?? ""),
    tags: normalizeTags(body.tags),
    cover_image: body.cover_image ? String(body.cover_image) : null,
    content: String(body.content ?? ""),
    published: Boolean(body.published),
  };
}

async function ensureCoverImagePersisted(
  id: string | number,
  payload: ReturnType<typeof toPayload>,
  data: Record<string, unknown> | null
) {
  if (!payload.cover_image || data?.cover_image) {
    return data;
  }

  const supabase = await createClient();
  const { data: patchedData, error } = await supabase
    .from("blogs")
    .update({ cover_image: payload.cover_image })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return patchedData;
}

export async function GET() {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();

  let query = supabase.from("blogs").select("*").order("created_at", { ascending: false });
  if (!currentUserId) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const supabase = await createClient();
    const body = (await request.json()) as Record<string, unknown>;
    const payload = toPayload(body);

    if (!payload.title || !payload.slug || !payload.content) {
      return NextResponse.json({ error: "Title, slug, and content are required." }, { status: 400 });
    }

    await ensureUniqueSlug(payload.slug);

    const { data, error } = await supabase.from("blogs").insert(payload).select("*").single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const persistedData = await ensureCoverImagePersisted(data.id, payload, data);

    revalidateBlogs([payload.slug]);
    return NextResponse.json(persistedData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create blog.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  try {
    const supabase = await createClient();
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id ?? "");
    const payload = toPayload(body);

    if (!id) {
      return NextResponse.json({ error: "Blog id is required." }, { status: 400 });
    }

    if (!payload.title || !payload.slug || !payload.content) {
      return NextResponse.json({ error: "Title, slug, and content are required." }, { status: 400 });
    }

    const { data: existingBlog } = await supabase.from("blogs").select("slug").eq("id", id).maybeSingle();
    await ensureUniqueSlug(payload.slug, id);

    const { data, error } = await supabase
      .from("blogs")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const persistedData = await ensureCoverImagePersisted(id, payload, data);

    revalidateBlogs([payload.slug, existingBlog?.slug].filter(Boolean));
    return NextResponse.json(persistedData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update blog.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const body = (await request.json()) as { id?: string | number };
  const id = String(body.id ?? "");

  if (!id) {
    return NextResponse.json({ error: "Blog id is required." }, { status: 400 });
  }

  const { data: existingBlog } = await supabase.from("blogs").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateBlogs(existingBlog?.slug ? [existingBlog.slug] : []);
  return NextResponse.json({ message: "Blog deleted successfully." });
}
