"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  getWritingInterestFilter,
  postMatchesWritingInterest,
  writingInterestFilters,
} from "@/lib/writing-interests";

interface BlogFilterProps {
  posts: Array<{ slug: string; tags?: string[] }>;
}

export default function BlogFilter({ posts }: BlogFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedInterest = getWritingInterestFilter(searchParams.get("interest"));

  const handleInterestClick = (interestValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (interestValue && interestValue !== selectedInterest?.value) {
      params.set("interest", interestValue);
      params.delete("tag");
    } else {
      params.delete("interest");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const filteredPostsCount = useMemo(() => {
    if (!selectedInterest) return posts.length;
    return posts.filter((post) => postMatchesWritingInterest(post, selectedInterest)).length;
  }, [posts, selectedInterest]);

  return (
    <div className="mb-10">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-extrabold text-[var(--foreground)]">Filter</span>
        <button
          onClick={() => handleInterestClick(null)}
          className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-dark)] ${
            !selectedInterest
              ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white dark:bg-[#d9f0e9] dark:text-[#111816]"
              : "border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[#b7c3ba] hover:bg-[var(--surface-muted)] dark:hover:border-[#53625d]"
          }`}
          aria-pressed={!selectedInterest}
        >
          All
        </button>
        {writingInterestFilters.map((interest) => (
          <button
            key={interest.value}
            onClick={() => handleInterestClick(interest.value)}
            className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-dark)] ${
              selectedInterest?.value === interest.value
                ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white dark:bg-[#d9f0e9] dark:text-[#111816]"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[#b7c3ba] hover:bg-[var(--surface-muted)] dark:hover:border-[#53625d]"
            }`}
            aria-pressed={selectedInterest?.value === interest.value}
          >
            {interest.label}
          </button>
        ))}
      </div>
      {selectedInterest && (
        <p className="text-sm text-[var(--muted)]">
          Showing {filteredPostsCount} post{filteredPostsCount !== 1 ? "s" : ""} for{" "}
          <strong>{selectedInterest.label}</strong>
        </p>
      )}
    </div>
  );
}
