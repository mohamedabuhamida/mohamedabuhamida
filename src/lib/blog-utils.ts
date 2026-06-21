import type { BlogListItem, BlogPost, TocItem } from "@/types";

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function calculateReadingTime(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_~\-]/g, " ");

  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function withReadingTime(post: BlogPost): BlogListItem {
  return {
    ...post,
    tags: normalizeTags(post.tags),
    readingTimeMinutes: calculateReadingTime(post.content),
  };
}

export function formatBlogDate(date?: string) {
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function normalizeHeadingText(input: string) {
  return input
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

function getUniqueHeadingId(base: string, counts: Map<string, number>) {
  const nextCount = counts.get(base) ?? 0;
  counts.set(base, nextCount + 1);
  return nextCount === 0 ? base : `${base}-${nextCount + 1}`;
}

export function extractTableOfContents(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const counts = new Map<string, number>();
  const items: TocItem[] = [];

  for (const line of lines) {
    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length;
    const text = normalizeHeadingText(match[2]);
    const slug = slugify(text);
    if (!slug) continue;

    items.push({
      id: getUniqueHeadingId(slug, counts),
      text,
      level,
    });
  }

  return items;
}

export function stripLeadingTitleHeading(markdown: string, title: string) {
  const lines = markdown.split(/\r?\n/);
  let removed = false;

  const normalizedTitle = slugify(title);
  const nextLines = lines.filter((line) => {
    if (removed) return true;

    const match = /^(#)\s+(.+)$/.exec(line.trim());
    if (!match) return true;

    const headingText = normalizeHeadingText(match[2]);
    if (slugify(headingText) === normalizedTitle) {
      removed = true;
      return false;
    }

    return true;
  });

  return nextLines.join("\n").replace(/^\s+/, "");
}
