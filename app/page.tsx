import Image from "next/image";
import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
import { displayWritingCategory } from "@/lib/writing-interests";

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

export default function Home() {
  const posts = getSortedPostsData().slice(0, 5);
  const featuredPost =
    posts.find((post) => post.tags?.includes("motorcycle") && post.cover) ??
    posts.find((post) => post.cover) ??
    posts[0];
  const secondaryPosts = posts.filter((post) => post.slug !== featuredPost?.slug).slice(0, 4);

  return (
    <div>
      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#121417] px-5 py-24 text-white sm:px-8 lg:px-18">
        <Image
          src="/images/coast-motorcycle-hero.png"
          alt="Motorcyclist riding a coastal road"
          fill
          sizes="100vw"
          priority
          className="absolute inset-0 -z-20 object-cover object-[50%_36%] sm:object-[50%_34%] lg:object-[50%_32%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_16_18/0.90)_0%,rgb(10_16_18/0.68)_42%,rgb(10_16_18/0.16)_82%),linear-gradient(180deg,rgb(10_16_18/0.12)_0%,rgb(10_16_18/0.45)_100%)]" />
        <div className="mx-auto flex min-h-[430px] max-w-7xl flex-col justify-center">
          <p className="mb-6 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#dae9e3]">
            <span className="h-0.5 w-9 bg-[var(--gold)]" aria-hidden="true" />
            Engineer, Rider, Pianist
          </p>
          <h1 className="font-serif-display max-w-3xl text-6xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            Jonathan Mares
          </h1>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-[#121417] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Read latest writing
            </Link>
            <Link
              href="/piano"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/45 px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Listen to piano recordings
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-18">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
              Latest
            </p>
            <h2 className="font-serif-display text-4xl leading-none text-[var(--foreground)] sm:text-5xl">
              Writing
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden rounded-full px-3 py-2 text-sm font-extrabold text-[var(--green)] transition hover:bg-[#e1ece8] dark:hover:bg-[#22332f] sm:inline-flex"
          >
            View archive
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-sm">
            <p className="text-[var(--muted)]">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative flex min-h-[420px] overflow-hidden rounded-lg border border-[var(--line)] bg-[#121417] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                {featuredPost.cover && (
                  <Image
                    src={featuredPost.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="absolute inset-0 object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_20_22/0.08),rgb(11_20_22/0.82))]" />
                <div className="relative mt-auto max-w-2xl">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#e7d3a2]">
                    {displayTag(featuredPost.tags)} · {formatDate(featuredPost.date)}
                  </p>
                  <h3 className="font-serif-display text-4xl leading-tight text-white sm:text-5xl">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="mt-3 text-sm leading-6 text-[#edf3ef]">{featuredPost.excerpt}</p>
                  )}
                </div>
              </Link>
            )}

            <div className="grid gap-4">
              {secondaryPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b7c3ba] hover:shadow-md dark:hover:border-[#53625d]"
                >
                  <div className="relative overflow-hidden rounded-md bg-[var(--surface-muted)]">
                    {post.cover ? (
                      <Image
                        src={post.cover}
                        alt=""
                        fill
                        sizes="88px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-20 items-center justify-center bg-[#dfe9e5] text-xs font-extrabold uppercase text-[var(--green-dark)] dark:bg-[#22332f]">
                        {displayTag(post.tags)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--green)]">
                      {displayTag(post.tags)} · {new Date(post.date).getFullYear()}
                    </p>
                    <h3 className="text-lg font-bold leading-snug text-[var(--foreground)] group-hover:text-[var(--green)]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--muted)]">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
