import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeTags, withReadingTime } from "@/lib/blog-utils";
import type { BlogListItem, BlogPost } from "@/types";

function mapBlog(post: Record<string, unknown>): BlogPost {
  return {
    id: String(post.id ?? ""),
    title: String(post.title ?? ""),
    slug: String(post.slug ?? ""),
    description: String(post.description ?? ""),
    tags: normalizeTags(post.tags),
    cover_image: post.cover_image ? String(post.cover_image) : null,
    content: String(post.content ?? ""),
    published: Boolean(post.published),
    created_at: post.created_at ? String(post.created_at) : undefined,
    updated_at: post.updated_at ? String(post.updated_at) : undefined,
  };
}

export async function getPublishedBlogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => withReadingTime(mapBlog(item)));
}

export async function getAllBlogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => withReadingTime(mapBlog(item)));
}

export async function getBlogBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;
  const supabase = await createClient();
  let query = supabase.from("blogs").select("*").eq("slug", slug);

  if (!includeDrafts) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapBlog(data) : null;
}

export async function createBlog(input: Omit<BlogPost, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      ...input,
      tags: normalizeTags(input.tags),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateBlogs();
  return mapBlog(data);
}

export async function updateBlog(id: string, input: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .update({
      ...input,
      tags: input.tags ? normalizeTags(input.tags) : undefined,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateBlogs();
  return mapBlog(data);
}

export async function deleteBlog(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateBlogs();
}

export function revalidateBlogs(slugs: string[] = []) {
  revalidatePath("/blog");
  revalidatePath("/dashboard/blogs");
  slugs.filter(Boolean).forEach((slug) => revalidatePath(`/blog/${slug}`));
}
