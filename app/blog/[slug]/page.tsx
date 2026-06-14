import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import { getAllPostSlugs, getPostData, getSortedPostsData } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function displayTag(tags?: string[]) {
  if (!tags?.length) return "Writing";
  if (tags.includes("motorcycle")) return "Motorcycle / Travel Journal";
  if (tags.includes("piano")) return "Piano / Recordings";
  if (tags.some((tag) => ["tech", "software", "react"].includes(tag))) return "Software / Notes";
  return tags[0];
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostData(slug);
  } catch {
    notFound();
  }

  const relatedPosts = getSortedPostsData()
    .filter((candidate) => candidate.slug !== post.slug)
    .filter((candidate) =>
      post.tags?.length ? candidate.tags?.some((tag) => post.tags?.includes(tag)) : true
    )
    .slice(0, 2);
  const heroImage = post.tags?.includes("motorcycle")
    ? "/images/coast-motorcycle-hero.png"
    : post.cover;

  return (
    <article>
      <header className="border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.86fr] lg:px-10 lg:py-18">
          <div className="flex flex-col justify-center">
            <Link
              href="/blog"
              className="mb-8 inline-flex w-fit rounded-full px-3 py-2 text-sm font-bold text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--green-dark)]"
            >
              ← Back to Writing
            </Link>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
              {displayTag(post.tags)}
            </p>
            <h1 className="font-serif-display max-w-4xl text-5xl leading-[0.98] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">{post.excerpt}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--foreground)]">
                {formatDate(post.date)}
              </span>
              {post.readingTime && (
                <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--foreground)]">
                  {post.readingTime}
                </span>
              )}
              {post.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {heroImage && (
            <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)] lg:min-h-[520px]">
              <Image
                src={heroImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                priority
                className="object-cover object-[50%_42%]"
              />
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[180px_minmax(0,760px)_260px] lg:px-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28 text-sm">
            <p className="mb-4 font-extrabold text-[var(--foreground)]">In This Post</p>
            <div className="grid gap-3 text-[var(--muted)]">
              <span>Overview</span>
              {post.tags?.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              <span>Comments</span>
            </div>
          </div>
        </aside>

        <div>
          <div
            className="prose prose-lg max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)] prose-a:text-[var(--green)] prose-strong:text-[var(--foreground)] prose-code:text-[var(--foreground)] prose-pre:bg-transparent prose-pre:p-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-14 border-t border-[var(--line)] pt-10">
            <Comments slug={slug} title={post.title} />
          </div>
        </div>

        <aside className="lg:block">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">More Writing</h2>
            <div className="grid gap-5">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                  {related.cover && (
                    <div className="relative mb-3 h-28 overflow-hidden rounded-md bg-[var(--surface-muted)]">
                      <Image
                        src={related.cover}
                        alt=""
                        fill
                        sizes="220px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-base font-bold leading-tight text-[var(--foreground)] group-hover:text-[var(--green)]">
                    {related.title}
                  </h3>
                  {related.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm leading-5 text-[var(--muted)]">
                      {related.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
