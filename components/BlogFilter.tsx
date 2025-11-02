'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface BlogFilterProps {
  posts: Array<{ slug: string; tags?: string[] }>;
}

export default function BlogFilter({ posts }: BlogFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedTag = searchParams.get('tag');

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
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredPostsCount = useMemo(() => {
    if (!selectedTag) return posts.length;
    return posts.filter((post) => post.tags?.includes(selectedTag)).length;
  }, [posts, selectedTag]);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-[#111111] dark:text-gray-300 mr-2">Filter by tag:</span>
        <button
          onClick={() => handleTagClick(null)}
          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
            !selectedTag
              ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
              : 'bg-white dark:bg-gray-800 text-[#111111] dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selectedTag === tag
                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                : 'bg-white dark:bg-gray-800 text-[#111111] dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTag && (
        <p className="text-sm text-[#374151] dark:text-gray-400">
          Showing {filteredPostsCount} post{filteredPostsCount !== 1 ? 's' : ''} tagged with <strong>{selectedTag}</strong>
        </p>
      )}
    </div>
  );
}

