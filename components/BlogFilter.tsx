"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

interface BlogFilterProps {
  posts: Array<{ slug: string; tags?: string[] }>;
}

export default function BlogFilter({ posts }: BlogFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedTag = searchParams.get("tag");

  // Get all unique tags from all posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const handleTagClick = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag && tag !== selectedTag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredPostsCount = useMemo(() => {
    if (!selectedTag) return posts.length;
    return posts.filter((post) => post.tags?.includes(selectedTag)).length;
  }, [posts, selectedTag]);

  const promotedTags = ["tech", "motorcycle", "piano"];
  const orderedTags = promotedTags.filter((tag) => allTags.includes(tag));
  if (selectedTag && !orderedTags.includes(selectedTag) && allTags.includes(selectedTag)) {
    orderedTags.push(selectedTag);
  }

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="mr-2 text-sm font-extrabold text-[var(--foreground)]">Filter</span>
        <button
          onClick={() => handleTagClick(null)}
          className={`min-h-10 px-4 text-sm font-bold rounded-full border transition-colors cursor-pointer ${
            !selectedTag
              ? "bg-[var(--green-dark)] text-white dark:bg-[#d9f0e9] dark:text-[#111816] border-[var(--green-dark)]"
              : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--line)] hover:border-[#b7c3ba] dark:hover:border-[#53625d]"
          }`}
        >
          All
        </button>
        {orderedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`min-h-10 px-4 text-sm font-bold rounded-full border transition-colors cursor-pointer ${
              selectedTag === tag
                ? "bg-[var(--green-dark)] text-white dark:bg-[#d9f0e9] dark:text-[#111816] border-[var(--green-dark)]"
                : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--line)] hover:border-[#b7c3ba] dark:hover:border-[#53625d]"
            }`}
          >
            {tag === "tech" ? "Software" : tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
      {selectedTag && (
        <p className="text-sm text-[var(--muted)]">
          Showing {filteredPostsCount} post{filteredPostsCount !== 1 ? "s" : ""} tagged with{" "}
          <strong>{selectedTag}</strong>
        </p>
      )}
    </div>
  );
}
