import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

export default function Home() {
  const posts = getSortedPostsData().slice(0, 5); // Show latest 5 posts

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <section className="mb-16">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome to my Blog and Personal Website
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
          Here I write about computer science, software engineering, and motorcycles.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Latest Posts</h2>
          <Link
            href="/blog"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group"
              >
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {post.excerpt && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
