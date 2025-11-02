import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';
import { remarkImageCaptions } from './remark-image-captions';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  readingTime?: string;
  draft?: boolean;
}

export function getSortedPostsData(): Omit<BlogPost, 'content'>[] {
  // Get file names under /content/blog
  const fileNames = fs.existsSync(postsDirectory)
    ? fs.readdirSync(postsDirectory)
    : [];
  
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data } = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        ...(data as { title: string; date: string; excerpt?: string; draft?: boolean }),
      };
    })
    .filter((post) => !post.draft); // Filter out draft posts

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs(): { slug: string }[] {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      // Only return non-draft posts
      if ((data as { draft?: boolean }).draft) {
        return null;
      }
      
      return {
        slug,
      };
    })
    .filter((post): post is { slug: string } => post !== null);
}

export async function getPostData(slug: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);
  
  // Check if post is a draft and throw error if so
  if ((data as { draft?: boolean }).draft) {
    throw new Error('Post is a draft');
  }

  // Use remark to convert markdown into HTML string with syntax highlighting
  const processedContent = await remark()
    .use(remarkImageCaptions)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrismPlus)
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  // Calculate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Combine the data with the slug and content
  return {
    slug,
    content: contentHtml,
    readingTime: `${readingTime} min read`,
    ...(data as { title: string; date: string; excerpt?: string }),
  };
}

