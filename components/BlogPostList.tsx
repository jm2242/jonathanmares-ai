import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

interface BlogPostListProps {
  posts: ReturnType<typeof getSortedPostsData>;
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block p-6 bg-[#f9fafb] dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all group"
        >
          <h2 className="text-2xl font-semibold mb-2 text-[#111111] dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-[#374151] dark:text-gray-400 mb-2">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-800 text-[#374151] dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {post.excerpt && (
            <p className="text-[#1a1a1a] dark:text-gray-300 mt-2">
              {post.excerpt}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

