"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Tag } from "lucide-react";
import { formatBlogDate } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import type { BlogListItem } from "@/types";

interface BlogIndexClientProps {
  posts: BlogListItem[];
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = useMemo(() => {
    const values = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => values.add(tag)));
    return ["All", ...Array.from(values)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTag === "All") return posts;
    return posts.filter((post) => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              selectedTag === tag
                ? "border-accent bg-accent/15 text-accent"
                : "border-white/10 bg-white/5 text-text/65 hover:border-accent/40 hover:text-white"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center text-text/55">
          No published articles found for this tag yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:border-accent/40 hover:bg-white/[0.05]"
            >
              <article className="grid gap-0 lg:grid-cols-[1.2fr,0.8fr]">
                <div className="p-7 sm:p-8">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-white transition group-hover:text-accent sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-text/65 sm:text-base">
                    {post.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text/50">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatBlogDate(post.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {post.readingTimeMinutes} min read
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {post.tags.length} tags
                    </span>
                  </div>
                </div>

                <div className="relative min-h-60 overflow-hidden border-t border-white/10 bg-slate-900 lg:border-l lg:border-t-0">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4ea8de33,transparent_55%),linear-gradient(135deg,#071120,#0c1f3b_55%,#02060d)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
