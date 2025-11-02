import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostData } from '@/lib/blog';
import Comments from '@/components/Comments';

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostData(slug);
  } catch (error) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-[#111111] dark:text-gray-100">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.readingTime && (
            <>
              <span>•</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
      </header>

      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-[#111111] prose-headings:dark:text-gray-100 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-[#1a1a1a] prose-p:dark:text-gray-300 prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 prose-a:hover:text-blue-700 prose-a:dark:hover:text-blue-300 prose-strong:text-[#111111] prose-strong:dark:text-gray-100 prose-code:text-[#111111] prose-code:dark:text-gray-100 prose-pre:bg-transparent prose-pre:p-0"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Comments slug={slug} title={post.title} />
    </article>
  );
}

