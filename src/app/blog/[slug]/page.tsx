import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServerMarkdownRenderer from "@/components/ServerMarkdownRenderer";
import BlogTableOfContents from "@/components/BlogTableOfContents";
import { extractTableOfContents, formatBlogDate, stripLeadingTitleHeading } from "@/lib/blog-utils";
import { getBlogBySlug } from "@/lib/blogs";
import { CalendarDays, Clock3 } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      images: post.cover_image ? [{ url: post.cover_image, alt: post.title }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export const revalidate = 300;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleContent = stripLeadingTitleHeading(post.content, post.title);
  const toc = extractTableOfContents(articleContent).filter((item) => item.level >= 2);
  const readingTime = Math.max(1, Math.ceil(articleContent.trim().split(/\s+/).filter(Boolean).length / 200));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#143b6a30,transparent_24%),linear-gradient(180deg,#02050a,#05101a_34%,#02050a)] px-6 pb-24 pt-32 sm:px-8">
        <article className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl">
            <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-text/45">
                <span className="text-accent/80">Case Study</span>
                <span className="inline-flex items-center gap-2 normal-case tracking-normal text-[13px] text-text/45">
                  <CalendarDays className="h-3.5 w-3.5 text-accent/75" />
                  Published {formatBlogDate(post.created_at)}
                </span>
                <span className="inline-flex items-center gap-2 normal-case tracking-normal text-[13px] text-text/45">
                  <Clock3 className="h-3.5 w-3.5 text-accent/75" />
                  {readingTime} min read
                </span>
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-text/62">
                {post.description}
              </p>

              {post.tags.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1.5 text-[11px] font-medium text-accent/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </header>

          {post.cover_image ? (
            <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-[24px] border border-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <img src={post.cover_image} alt={post.title} className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[380px]" />
            </div>
          ) : null}

          <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start">
            <BlogTableOfContents items={toc} />

            <div className="min-w-0 flex-1">
              <div className="blog-article mx-auto max-w-3xl space-y-14">
                <ServerMarkdownRenderer content={articleContent} tocItems={toc} />

                <section className="rounded-[24px] border border-white/8 bg-white/[0.03] p-6 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.22em] text-text/35">Author</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Written by Mohamed AbuHamida - AI Engineer</h2>
                  <p className="mt-3 text-base leading-7 text-text/60">
                    I build AI products with a focus on LLM systems, computer vision, and production-ready full-stack experiences.
                  </p>
                </section>

                <section className="rounded-[24px] border border-accent/20 bg-[linear-gradient(135deg,rgba(78,168,222,0.12),rgba(78,168,222,0.04))] p-6 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.22em] text-accent/80">Let&apos;s Build</p>
                  <p className="mt-3 max-w-2xl text-lg leading-8 text-white">
                    If you&apos;re looking for an AI Engineer specialized in Computer Vision and LLM systems, feel free to reach out.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
