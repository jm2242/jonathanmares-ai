import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/blog";
import BlogFilter from "@/components/BlogFilter";
import BlogPostList from "@/components/BlogPostList";

interface BlogProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Blog({ searchParams }: BlogProps) {
  const { tag } = await searchParams;
  const allPosts = getSortedPostsData();
  const posts = tag ? allPosts.filter((post) => post.tags?.includes(tag)) : allPosts;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
          Archive
        </p>
        <h1 className="font-serif-display text-5xl leading-none text-[var(--foreground)] sm:text-6xl">
          Writing
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          Software notes, motorcycle trip reports, and music updates in one scan-friendly archive.
        </p>
      </header>

      <Suspense fallback={<div className="mb-8 text-[var(--muted)]">Loading filters...</div>}>
        <BlogFilter posts={allPosts} />
      </Suspense>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-sm">
          <p className="text-[var(--muted)]">
            {tag ? `No posts found with tag "${tag}".` : "No blog posts yet. Check back soon!"}
          </p>
        </div>
      ) : (
        <BlogPostList posts={posts} />
      )}
    </div>
  );
}
