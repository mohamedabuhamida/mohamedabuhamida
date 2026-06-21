import React from "react";
import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import CodeCopyButton from "@/components/CodeCopyButton";
import { normalizeHeadingText } from "@/lib/blog-utils";
import type { TocItem } from "@/types";

interface ServerMarkdownRendererProps {
  content: string;
  tocItems?: TocItem[];
}

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

export default function ServerMarkdownRenderer({
  content,
  tocItems = [],
}: ServerMarkdownRendererProps) {
  const sanitizeSchema = {
    ...defaultSchema,
    protocols: {
      ...defaultSchema.protocols,
      src: ["http", "https", "mailto", "tel", "data"],
    },
  };

  const headingUsage = new Map<string, number>();

  const getHeadingId = (level: number, children: React.ReactNode) => {
    const text = normalizeHeadingText(extractText(children));
    const key = `${level}:${text}`;
    const usage = headingUsage.get(key) ?? 0;
    headingUsage.set(key, usage + 1);

    const matchingItems = tocItems.filter((item) => item.level === level && normalizeHeadingText(item.text) === text);
    return matchingItems[usage]?.id;
  };

  const components: Components = {
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
      const resolvedSrc = typeof src === "string" ? src.trim() : "";

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
      const { inline, className, children } = props as any;
      const value = extractText(children).replace(/\n$/, "");

      if (inline) {
        return <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>;
      }

      return (
        <>
          <CodeCopyButton value={value} />
          <code className={className}>{children}</code>
        </>
      );
    },
  };

  return (
    <article className="markdown-body !bg-transparent prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url, key, node) => {
          if (key === "src" && node.tagName === "img" && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(url)) {
            return url;
          }

          return defaultUrlTransform(url);
        }}
        rehypePlugins={[rehypeHighlight, [rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
