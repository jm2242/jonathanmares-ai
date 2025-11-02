import Link from 'next/link';
import { Suspense } from 'react';
import { getSortedPostsData } from '@/lib/blog';
import BlogFilter from '@/components/BlogFilter';
import BlogPostList from '@/components/BlogPostList';

interface BlogProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Blog({ searchParams }: BlogProps) {
  const { tag } = await searchParams;
  const allPosts = getSortedPostsData();
  
  // Filter posts by tag if provided
  const posts = tag 
    ? allPosts.filter((post) => post.tags?.includes(tag))
    : allPosts;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 text-[#111111] dark:text-gray-100">Blog</h1>
      <p className="text-lg text-[#1a1a1a] dark:text-gray-400 mb-8">
        Thoughts on software engineering, computer science, and motorcycles.
      </p>

      <Suspense fallback={<div className="mb-8">Loading filters...</div>}>
        <BlogFilter posts={allPosts} />
      </Suspense>

      {posts.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            {tag ? `No posts found with tag "${tag}".` : 'No blog posts yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <BlogPostList posts={posts} />
      )}
    </div>
  );
}

