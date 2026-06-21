"use client";

import React, { useMemo } from "react";
import ReactMarkdown, { defaultUrlTransform, type Components, type UrlTransform } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import CodeCopyButton from "@/components/CodeCopyButton";
import { normalizeHeadingText } from "@/lib/blog-utils";
import type { TocItem } from "@/types";

interface MarkdownRendererProps {
  content: string;
  tocItems?: TocItem[];
  embeddedImages?: Record<string, { dataUrl: string; alt?: string }>;
}

/**
 * Utility to extract plain text from React nodes
 * Used for the copy-to-clipboard functionality
 */
function extractText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map((child) => extractText(child)).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as any).props?.children);
  }
  return "";
}

export default function MarkdownRenderer({
  content,
  tocItems = [],
  embeddedImages = {},
}: MarkdownRendererProps) {
  // Custom schema to allow Base64 images (data: URI protocol)
  const sanitizeSchema = useMemo(() => ({
    ...defaultSchema,
    protocols: {
      ...defaultSchema.protocols,
      src: ["http", "https", "mailto", "tel", "data"], // 'data' is required for base64
    },
  }), []);

  const urlTransform = useMemo<UrlTransform>(
    () => (url, key, node) => {
      if (key === "src" && node.tagName === "img" && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(url)) {
        return url;
      }

      if (key === "src" && node.tagName === "img" && /^embedded:/.test(url)) {
        return url;
      }

      return defaultUrlTransform(url);
    },
    []
  );

  // Memoize components to prevent hydration mismatch and "empty src" errors
  const components: Components = useMemo(() => {
    const headingUsage = new Map<string, number>();

    const getHeadingId = (level: number, children: React.ReactNode) => {
      const text = normalizeHeadingText(extractText(children));
      const key = `${level}:${text}`;
      const usage = headingUsage.get(key) ?? 0;
      headingUsage.set(key, usage + 1);

      const matchingItems = tocItems.filter((item) => item.level === level && normalizeHeadingText(item.text) === text);
      return matchingItems[usage]?.id;
    };

    return {
      h1: ({ children }) => <h1 className="scroll-mt-32">{children}</h1>,
      h2: ({ children }) => {
        const id = getHeadingId(2, children);
        return <h2 id={id} className="scroll-mt-32">{children}</h2>;
      },
      h3: ({ children }) => {
        const id = getHeadingId(3, children);
        return <h3 id={id} className="scroll-mt-32">{children}</h3>;
      },
      a: ({ href, children }) => (
        <a
          href={href}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          {children}
        </a>
      ),
      img: ({ src, alt }) => {
        // Fix for the "Empty string passed to src" error
        // If src is invalid, we return null so no <img> tag is created at all
        const incomingSrc = typeof src === "string" ? src.trim() : "";
        const embeddedMatch = /^embedded:(.+)$/.exec(incomingSrc);
        const resolvedSrc = embeddedMatch ? embeddedImages[embeddedMatch[1]]?.dataUrl?.trim() ?? "" : incomingSrc;

        if (!resolvedSrc || resolvedSrc === "undefined") {
          return null;
        }

        return (
          <img
            src={resolvedSrc}
            alt={alt || ""}
            loading="lazy"
            className="max-w-full h-auto rounded-lg border my-4"
          />
        );
      },
      pre: ({ children }) => <div className="relative group">{children}</div>,
      code: (props) => {
        // We deconstruct node to prevent it from being passed to the HTML element
        const { inline, className, children, node, ...rest } = props as any;
        const value = extractText(children).replace(/\n$/, "");

        if (inline) {
          return (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          );
        }

        return (
          <>
            <CodeCopyButton value={value} />
            <code className={className}>
              {children}
            </code>
          </>
        );
      },
    };
  }, [embeddedImages, tocItems]);

  return (
    <article className="markdown-body !bg-transparent prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={urlTransform}
        rehypePlugins={[
          rehypeHighlight,
          [rehypeSanitize, sanitizeSchema] // Security layer that allows base64
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
