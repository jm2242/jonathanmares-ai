import Image from "next/image";
import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
import { displayWritingCategory } from "@/lib/writing-interests";

interface BlogPostListProps {
  posts: ReturnType<typeof getSortedPostsData>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function displayTag(tags?: string[]) {
  return displayWritingCategory(tags);
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <div className="grid gap-5">
      {posts.map((post, index) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className={`group overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b7c3ba] hover:shadow-md dark:hover:border-[#53625d] ${
            index === 0 ? "md:grid md:grid-cols-[0.9fr_1.1fr]" : "md:grid md:grid-cols-[220px_1fr]"
          }`}
        >
          <div
            className={`relative bg-[var(--surface-muted)] ${
              index === 0 ? "min-h-[260px] md:min-h-[320px]" : "min-h-[180px] md:min-h-full"
            }`}
          >
            {post.cover ? (
              <Image
                src={post.cover}
                alt=""
                fill
                sizes={index === 0 ? "(min-width: 768px) 45vw, 100vw" : "220px"}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full min-h-[180px] items-center justify-center bg-[#dfe9e5] p-6 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green-dark)] dark:bg-[#22332f]">
                {displayTag(post.tags)}
              </div>
            )}
          </div>
          <div className="p-5 sm:p-7">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
              {displayTag(post.tags)} · {formatDate(post.date)}
            </p>
            <h2
              className={`font-serif-display leading-tight text-[var(--foreground)] group-hover:text-[var(--green)] ${
                index === 0 ? "text-3xl sm:text-4xl" : "text-2xl"
              }`}
            >
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                {post.excerpt}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
