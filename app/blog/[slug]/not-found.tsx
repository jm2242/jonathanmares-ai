import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Post Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/blog"
        className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
      >
        Back to Blog
      </Link>
    </div>
  );
}

