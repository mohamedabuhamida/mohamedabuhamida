"use client";

import dynamic from "next/dynamic";
import { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type EasyMDE from "easymde";
import type { Options } from "easymde";
import type { Editor } from "codemirror";
import { Download, Eye, FileImage, FilePlus2, LoaderCircle, PencilLine, Rocket, Save, Trash2 } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { calculateReadingTime, formatBlogDate, normalizeTags, slugify } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import type { BlogListItem } from "@/types";
import type { SimpleMdeToCodemirrorEvents } from "react-simplemde-editor";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

interface BlogEditorState {
  id?: string;
  title: string;
  slug: string;
  description: string;
  tags: string;
  cover_image: string;
  content: string;
  published: boolean;
  created_at?: string;
}

interface EmbeddedImageEntry {
  dataUrl: string;
  alt?: string;
}

interface EmbeddedCoverImage {
  dataUrl: string;
  fileName: string;
}

interface ParsedMarkdownImport {
  frontmatter: Record<string, string>;
  content: string;
}

const emptyBlog: BlogEditorState = {
  title: "",
  slug: "",
  description: "",
  tags: "",
  cover_image: "",
  content: "# New article\n\nStart writing here...",
  published: false,
};

function mapBlogToEditor(post?: BlogListItem | null): BlogEditorState {
  if (!post) return emptyBlog;

  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    description: post.description,
    tags: post.tags.join(", "),
    cover_image: post.cover_image ?? "",
    content: post.content,
    published: post.published,
    created_at: post.created_at,
  };
}

const DATA_URL_IMAGE_PATTERN = /!\[([^\]]*)\]\((data:image\/[^)]+)\)/g;
const EMBEDDED_IMAGE_TOKEN_PATTERN = /!\[([^\]]*)\]\(embedded:([^)]+)\)(?:\r?\n<!--.*?-->){0,2}/g;

function createEmbeddedImageToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `embedded-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmbeddedImagePlaceholder(altText: string, token: string) {
  return `![${altText}](embedded:${token})\n<!-- embedded image -->\n<!-- ... -->\n`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(dataUrl: string, fallbackName: string) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Unsupported embedded image format.");
  }

  const mimeType = match[1];
  const base64 = match[2];
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], `${fallbackName}.${extension}`, { type: mimeType });
}

function fileToText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read markdown file."));
    reader.readAsText(file);
  });
}

function parseFrontmatterValue(rawValue: string) {
  const value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean)
      .join(", ");
  }

  return value;
}

function parseMarkdownImport(source: string): ParsedMarkdownImport {
  if (!source.startsWith("---")) {
    return { frontmatter: {}, content: source.trim() };
  }

  const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return { frontmatter: {}, content: source.trim() };
  }

  const frontmatterBlock = frontmatterMatch[1];
  const frontmatter = frontmatterBlock.split(/\r?\n/).reduce<Record<string, string>>((accumulator, line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return accumulator;
    }

    const separatorIndex = trimmedLine.indexOf(":");
    if (separatorIndex === -1) {
      return accumulator;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim().toLowerCase();
    const value = parseFrontmatterValue(trimmedLine.slice(separatorIndex + 1));

    if (key) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});

  return {
    frontmatter,
    content: source.slice(frontmatterMatch[0].length).trim(),
  };
}

function extractTitleFromMarkdown(content: string) {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : "";
}

function escapeYamlString(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogEditorState>(emptyBlog);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [embeddedImages, setEmbeddedImages] = useState<Record<string, EmbeddedImageEntry>>({});
  const [embeddedCoverImage, setEmbeddedCoverImage] = useState<EmbeddedCoverImage | null>(null);
  const deferredContent = useDeferredValue(editingBlog.content);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const markdownImportInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<EasyMDE | null>(null);

  const insertMarkdownAtCursor = useCallback(
    (markdown: string) => {
      const editor = editorRef.current?.codemirror;

      if (editor) {
        editor.getDoc().replaceSelection(markdown, "around");
        editor.focus();
        handleFieldChange("content", editor.getValue());
        return;
      }

      handleFieldChange("content", `${editingBlog.content}\n\n${markdown}`);
    },
    [editingBlog.content]
  );

  const editorOptions = useMemo<Options>(
    () => ({
      spellChecker: false,
      status: false,
      minHeight: "420px",
      lineWrapping: true,
      previewRender: (plainText: string) => plainText,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "code",
        "table",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ] as const,
    }),
    []
  );

  const refreshBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/blogs", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load blogs.");
      }

      setBlogs(
        (data ?? []).map((post: BlogListItem) => ({
          ...post,
          tags: normalizeTags(post.tags),
          readingTimeMinutes: calculateReadingTime(post.content),
        }))
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load blogs.";
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBlogs();
  }, []);

  const normalizeEmbeddedContent = useCallback((content: string) => {
    const capturedImages: Record<string, EmbeddedImageEntry> = {};

    const normalizedContent = content.replace(DATA_URL_IMAGE_PATTERN, (_, rawAltText, dataUrl) => {
      const altText = String(rawAltText || "").trim() || "Embedded image";
      const token = createEmbeddedImageToken();

      capturedImages[token] = {
        dataUrl,
        alt: altText,
      };

      return createEmbeddedImagePlaceholder(altText, token).trimEnd();
    });

    return { normalizedContent, capturedImages };
  }, []);

  const handleFieldChange = <K extends keyof BlogEditorState>(key: K, value: BlogEditorState[K]) => {
    setEditingBlog((current) => {
      const next = { ...current, [key]: value };

      if (key === "title" && !slugTouched) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  };

  const handleEdit = (post: BlogListItem) => {
    setEditingBlog(mapBlogToEditor(post));
    setEmbeddedImages({});
    setEmbeddedCoverImage(null);
    setSlugTouched(true);
    setStatusMessage(null);
  };

  const handleCreate = () => {
    setEditingBlog(emptyBlog);
    setEmbeddedImages({});
    setEmbeddedCoverImage(null);
    setSlugTouched(false);
    setStatusMessage(null);
  };

  const handleContentChange = useCallback(
    (value: string) => {
      const { normalizedContent, capturedImages } = normalizeEmbeddedContent(value);

      if (Object.keys(capturedImages).length > 0) {
        setEmbeddedImages((current) => ({ ...current, ...capturedImages }));
      }

      handleFieldChange("content", normalizedContent);
    },
    [normalizeEmbeddedContent]
  );

  const handleSave = async (nextPublished?: boolean) => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      let normalizedContent = editingBlog.content;
      let coverImageUrl = editingBlog.cover_image;
      const hadEmbeddedCoverImage = Boolean(embeddedCoverImage?.dataUrl);
      const rawEmbeddedImages = Array.from(normalizedContent.matchAll(DATA_URL_IMAGE_PATTERN));

      if (embeddedCoverImage?.dataUrl) {
        const coverFile = dataUrlToFile(embeddedCoverImage.dataUrl, "blog-cover");
        coverImageUrl = await uploadImage(coverFile, "blog-covers");
      }

      if (rawEmbeddedImages.length > 0) {
        const replacements = await Promise.all(
          rawEmbeddedImages.map(async ([fullMatch, altText, dataUrl], index) => {
            const file = dataUrlToFile(dataUrl, `embedded-image-${Date.now()}-${index}`);
            const url = await uploadImage(file, "blog-inline");
            return {
              fullMatch,
              replacement: `![${altText || `image-${index + 1}`}](${url})`,
            };
          })
        );

        replacements.forEach(({ fullMatch, replacement }) => {
          normalizedContent = normalizedContent.replace(fullMatch, replacement);
        });
      }

      const embeddedPlaceholders = Array.from(normalizedContent.matchAll(EMBEDDED_IMAGE_TOKEN_PATTERN));

      if (embeddedPlaceholders.length > 0) {
        const placeholderReplacements = await Promise.all(
          embeddedPlaceholders.map(async ([fullMatch, altText, token], index) => {
            const embeddedImage = embeddedImages[token];

            if (!embeddedImage?.dataUrl) {
              throw new Error("Embedded image data is missing. Please reinsert the image and try again.");
            }

            const file = dataUrlToFile(embeddedImage.dataUrl, `embedded-image-${Date.now()}-${index}`);
            const url = await uploadImage(file, "blog-inline");

            return {
              fullMatch,
              replacement: `![${altText || embeddedImage.alt || `image-${index + 1}`}](${url})`,
            };
          })
        );

        placeholderReplacements.forEach(({ fullMatch, replacement }) => {
          normalizedContent = normalizedContent.replace(fullMatch, replacement);
        });
      }

      const payload = {
        ...editingBlog,
        slug: slugify(editingBlog.slug || editingBlog.title),
        tags: normalizeTags(editingBlog.tags),
        cover_image: coverImageUrl,
        content: normalizedContent,
        published: nextPublished ?? editingBlog.published,
      };

      const response = await fetch("/api/blogs", {
        method: editingBlog.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save blog.");
      }

      const savedBlog = {
        ...data,
        title: data?.title ?? payload.title,
        slug: data?.slug ?? payload.slug,
        description: data?.description ?? payload.description,
        tags: Array.isArray(data?.tags) ? data.tags : payload.tags,
        cover_image: data?.cover_image ?? coverImageUrl ?? null,
        content: data?.content ?? normalizedContent,
        published: typeof data?.published === "boolean" ? data.published : payload.published,
      };

      setEditingBlog(
        mapBlogToEditor({
          ...savedBlog,
          readingTimeMinutes: calculateReadingTime(savedBlog.content),
        })
      );
      setEmbeddedImages({});
      setEmbeddedCoverImage(null);
      setSlugTouched(true);
      setStatusMessage(
        rawEmbeddedImages.length > 0 || embeddedPlaceholders.length > 0 || hadEmbeddedCoverImage
          ? payload.published
            ? "Blog saved, embedded images uploaded, cover uploaded, and post published."
            : "Draft saved, embedded images uploaded, and cover uploaded."
          : payload.published
            ? "Blog saved and published."
            : "Draft saved."
      );
      await refreshBlogs();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save blog.";
      setStatusMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm("Delete this blog permanently?");
    if (!confirmed) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete blog.");
      }

      handleCreate();
      setStatusMessage("Blog deleted.");
      await refreshBlogs();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete blog.";
      setStatusMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = useCallback(async (file: File, folder: string) => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    body.append("bucket", "blogs");

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to upload image.");
    }

    return data.url as string;
  }, []);

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    setStatusMessage(null);

    try {
      const dataUrl = await fileToDataUrl(file);
      setEmbeddedCoverImage({
        dataUrl,
        fileName: file.name,
      });
      handleFieldChange("cover_image", "");
      setStatusMessage("Cover image selected. It will be uploaded automatically when you save or publish.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to prepare cover image.";
      setStatusMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarkdownImport = useCallback(
    async (file?: File) => {
      if (!file) return;

      setIsUploading(true);
      setStatusMessage(null);

      try {
        const markdown = await fileToText(file);
        const { frontmatter, content } = parseMarkdownImport(markdown);
        const { normalizedContent, capturedImages } = normalizeEmbeddedContent(content);
        const importedTitle =
          frontmatter.title?.trim() ||
          extractTitleFromMarkdown(normalizedContent) ||
          file.name.replace(/\.(md|markdown)$/i, "").replace(/[-_]+/g, " ").trim();
        const importedSlug = frontmatter.slug?.trim() || slugify(importedTitle);
        const importedDescription = frontmatter.description?.trim() || "";
        const importedTags = frontmatter.tags?.trim() || "";
        const importedCover = frontmatter.cover_image?.trim() || frontmatter.cover?.trim() || "";
        const importedPublished =
          frontmatter.published?.trim().toLowerCase() === "true" ||
          frontmatter.status?.trim().toLowerCase() === "published";

        setEditingBlog((current) => ({
          ...current,
          title: importedTitle || current.title,
          slug: importedSlug || current.slug,
          description: importedDescription,
          tags: importedTags,
          cover_image: importedCover.startsWith("data:image/") ? "" : importedCover,
          content: normalizedContent || current.content,
          published: importedPublished,
        }));

        if (Object.keys(capturedImages).length > 0) {
          setEmbeddedImages((current) => ({ ...current, ...capturedImages }));
        }

        if (importedCover.startsWith("data:image/")) {
          setEmbeddedCoverImage({
            dataUrl: importedCover,
            fileName: frontmatter.cover_file_name?.trim() || "Imported cover",
          });
        } else {
          setEmbeddedCoverImage(null);
        }

        setSlugTouched(Boolean(frontmatter.slug?.trim()));
        setStatusMessage("Markdown file imported. Review the fields, then save draft or publish.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to import markdown file.";
        setStatusMessage(message);
      } finally {
        setIsUploading(false);
        if (markdownImportInputRef.current) {
          markdownImportInputRef.current.value = "";
        }
      }
    },
    [normalizeEmbeddedContent]
  );

  const insertEmbeddedImage = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setStatusMessage(null);

      try {
        const dataUrl = await fileToDataUrl(file);
        const altText = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Embedded image";
        const token = createEmbeddedImageToken();

        setEmbeddedImages((current) => ({
          ...current,
          [token]: {
            dataUrl,
            alt: altText,
          },
        }));

        insertMarkdownAtCursor(createEmbeddedImagePlaceholder(altText, token));
        setStatusMessage("Embedded image inserted. It will be uploaded automatically when you save or publish.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to insert embedded image.";
        setStatusMessage(message);
      } finally {
        setIsUploading(false);
        if (inlineImageInputRef.current) {
          inlineImageInputRef.current.value = "";
        }
      }
    },
    [insertMarkdownAtCursor]
  );

  const editorEvents = useMemo<SimpleMdeToCodemirrorEvents>(
    () => ({
      paste: (instance: Editor, event: ClipboardEvent) => {
        const files = Array.from(event.clipboardData?.items ?? [])
          .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
          .map((item) => item.getAsFile())
          .filter((file): file is File => Boolean(file));

        if (files.length === 0) return;

        event.preventDefault();
        void insertEmbeddedImage(files[0]);
      },
      drop: (instance: Editor, event: DragEvent) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) => file.type.startsWith("image/"));
        if (files.length === 0) return;

        event.preventDefault();
        const position = instance.coordsChar({ left: event.clientX, top: event.clientY });
        instance.getDoc().setCursor(position);
        void insertEmbeddedImage(files[0]);
      },
    }),
    [insertEmbeddedImage]
  );

  const readingTime = useMemo(() => calculateReadingTime(editingBlog.content), [editingBlog.content]);
  const previewContent = useMemo(
    () =>
      deferredContent.replace(EMBEDDED_IMAGE_TOKEN_PATTERN, (_, rawAltText, token) => {
        const embeddedImage = embeddedImages[token];

        if (!embeddedImage?.dataUrl) {
          return "";
        }

        const altText = String(rawAltText || embeddedImage.alt || "Embedded image").trim() || "Embedded image";
        return `![${altText}](${embeddedImage.dataUrl})`;
      }),
    [deferredContent, embeddedImages]
  );

  const handleExportMarkdown = useCallback(() => {
    const resolvedContent = editingBlog.content.replace(EMBEDDED_IMAGE_TOKEN_PATTERN, (_, rawAltText, token) => {
      const embeddedImage = embeddedImages[token];

      if (!embeddedImage?.dataUrl) {
        return "";
      }

      const altText = String(rawAltText || embeddedImage.alt || "Embedded image").trim() || "Embedded image";
      return `![${altText}](${embeddedImage.dataUrl})`;
    });

    const effectiveCoverImage = embeddedCoverImage?.dataUrl || editingBlog.cover_image;
    const tags = normalizeTags(editingBlog.tags);
    const frontmatterLines = [
      "---",
      `title: ${escapeYamlString(editingBlog.title || "Untitled post")}`,
      `slug: ${escapeYamlString(slugify(editingBlog.slug || editingBlog.title || "untitled-post"))}`,
      `description: ${escapeYamlString(editingBlog.description || "")}`,
      `tags: [${tags.map((tag) => escapeYamlString(tag)).join(", ")}]`,
      `cover_image: ${escapeYamlString(effectiveCoverImage || "")}`,
      `published: ${editingBlog.published ? "true" : "false"}`,
      "---",
      "",
    ];

    const markdown = `${frontmatterLines.join("\n")}${resolvedContent.trim()}\n`;
    const fileName = `${slugify(editingBlog.slug || editingBlog.title || "blog-post") || "blog-post"}.md`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusMessage("Markdown file exported.");
  }, [editingBlog.content, editingBlog.cover_image, editingBlog.description, editingBlog.published, editingBlog.slug, editingBlog.tags, editingBlog.title, embeddedCoverImage, embeddedImages]);

  return (
    <section className="space-y-8 pb-36">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Blogs</h2>
          <p className="mt-2 max-w-2xl text-sm text-text/55">
            Manage drafts and published articles, upload cover images to Supabase Storage, and write content in Markdown.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-bg transition hover:bg-accent/85"
        >
          <FilePlus2 className="h-5 w-5" />
          New Blog
        </button>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-text/85">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[360px,minmax(0,1fr)]">
        <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Blogs</h3>
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin text-accent" /> : null}
          </div>

          <div className="space-y-3">
            {blogs.map((blog) => {
              const active = editingBlog.id === String(blog.id);

              return (
                <button
                  key={blog.id}
                  type="button"
                  onClick={() => handleEdit(blog)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-accent bg-accent/10"
                      : "border-white/8 bg-white/[0.03] hover:border-accent/30 hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{blog.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text/35">
                        {blog.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px]",
                        blog.published ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
                      )}
                    >
                      {blog.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-text/55">{blog.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-text/55">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}

            {!isLoading && blogs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-text/45">
                No blogs yet. Create your first article from the editor panel.
              </div>
            ) : null}
          </div>
        </aside>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Title</label>
              <input
                value={editingBlog.title}
                onChange={(event) => handleFieldChange("title", event.target.value)}
                placeholder="Building practical multimodal AI systems"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Slug</label>
              <input
                value={editingBlog.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  handleFieldChange("slug", slugify(event.target.value));
                }}
                placeholder="building-practical-multimodal-ai-systems"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Description</label>
              <textarea
                value={editingBlog.description}
                onChange={(event) => handleFieldChange("description", event.target.value)}
                placeholder="Short summary for cards, metadata, and social previews."
                className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Tags</label>
              <input
                value={editingBlog.tags}
                onChange={(event) => handleFieldChange("tags", event.target.value)}
                placeholder="LLMs, Computer Vision, Next.js"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Status</label>
              <label className="flex h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4">
                <input
                  type="checkbox"
                  checked={editingBlog.published}
                  onChange={(event) => handleFieldChange("published", event.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm text-text/70">Published and publicly visible</span>
              </label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Cover Image</label>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),auto]">
                <input
                  value={editingBlog.cover_image}
                  onChange={(event) => {
                    setEmbeddedCoverImage(null);
                    handleFieldChange("cover_image", event.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
                />
                <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text/75 transition hover:border-accent/40 hover:text-white">
                  {isUploading ? "Uploading..." : "Upload cover"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event.target.files?.[0])}
                  />
                </label>
              </div>
              {embeddedCoverImage ? (
                <div className="space-y-3">
                  <img
                    src={embeddedCoverImage.dataUrl}
                    alt="Embedded cover preview"
                    className="h-44 w-full rounded-2xl border border-white/10 object-cover"
                  />
                  <p className="text-xs text-text/45">
                    {embeddedCoverImage.fileName} will be uploaded automatically when you save or publish.
                  </p>
                </div>
              ) : editingBlog.cover_image ? (
                <img
                  src={editingBlog.cover_image}
                  alt="Blog cover preview"
                  className="h-44 w-full rounded-2xl border border-white/10 object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr),minmax(320px,0.9fr)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs uppercase tracking-[0.2em] text-text/35">Markdown Content</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text/75 transition hover:border-accent/40 hover:text-white">
                    <FileImage className="h-3.5 w-3.5" />
                    {isUploading ? "Uploading..." : "Insert image"}
                    <input
                      ref={inlineImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void insertEmbeddedImage(file);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-text/35">{readingTime} min read</span>
                </div>
              </div>
              <SimpleMDE
                value={editingBlog.content}
                onChange={handleContentChange}
                options={editorOptions}
                events={editorEvents}
                getMdeInstance={(instance) => {
                  editorRef.current = instance;
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-text/35">Live Preview</label>
              <div className="max-h-[680px] overflow-y-auto rounded-3xl border border-white/10 bg-black/25 p-5">
                <MarkdownRenderer content={previewContent} embeddedImages={embeddedImages} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="text-sm text-text/45">
              {editingBlog.created_at ? `Created ${formatBlogDate(editingBlog.created_at)}` : "Unsaved draft"}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-30 lg:left-[calc(16rem+2.5rem)] lg:right-10">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
            {editingBlog.slug ? (
              <Link
                href={`/dashboard/blogs/preview/${editingBlog.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-text/75 transition hover:border-accent/40 hover:text-white"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            ) : null}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-text/75 transition hover:border-accent/40 hover:text-white">
              <FilePlus2 className="h-4 w-4" />
              {isUploading ? "Importing..." : "Import .md"}
              <input
                ref={markdownImportInputRef}
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                className="hidden"
                onChange={(event) => handleMarkdownImport(event.target.files?.[0])}
              />
            </label>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-text/75 transition hover:border-accent/40 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export .md
            </button>

            {editingBlog.id ? (
              <button
                type="button"
                onClick={() => handleDelete(editingBlog.id)}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 px-4 py-3 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-text/80 transition hover:border-accent/40 hover:text-white disabled:opacity-60"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  handleSave(true);
                });
              }}
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-bg transition hover:bg-accent/85 disabled:opacity-60"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingBlog.id ? <Rocket className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
              {editingBlog.published ? "Update Published Post" : "Publish Blog"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
