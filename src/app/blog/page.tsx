import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogIndexClient from "@/components/BlogIndexClient";
import { getPublishedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on AI engineering, LLM systems, computer vision, and modern full-stack product work.",
  openGraph: {
    title: "Mohamed AbuHamida Blog",
    description:
      "AI engineering insights, project breakdowns, and practical lessons from building production systems.",
    url: "/blog",
  },
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#123a7235,transparent_30%),linear-gradient(180deg,#02050a,#050b13_40%,#02050a)] px-6 pb-20 pt-32 sm:px-8">
        <section className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-accent/80">
              Blog
            </p>

            <h1 className="mt-4 text-4xl font-bold text-white sm:text-6xl">
              Insights from building real-world AI systems and scalable
              products.
            </h1>

            <p className="mt-6 text-base leading-8 text-text/60 sm:text-lg">
              Deep dives into computer vision, LLMs, and production-grade
              engineering — based on real projects, not theory.
            </p>
          </div>

          <BlogIndexClient posts={posts} />
        </section>
      </main>
      <Footer />
    </>
  );
}
