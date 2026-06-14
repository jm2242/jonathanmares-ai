import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-center">
      <h1 className="font-serif-display mb-4 text-5xl text-[var(--foreground)]">Post Not Found</h1>
      <p className="mb-8 text-lg text-[var(--muted)]">
        The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/blog"
        className="inline-flex min-h-12 items-center rounded-full bg-[var(--green-dark)] px-6 font-extrabold text-white transition hover:opacity-90 dark:bg-[#d9f0e9] dark:text-[#111816]"
      >
        Back to Writing
      </Link>
    </div>
  );
}
