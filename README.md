# Jonathan Mares - Personal Website

A modern personal website and blog built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🏠 **Home Page** - Welcome section with latest blog posts
- 📝 **Blog** - Markdown-based blog with automatic post listing
- ℹ️ **About** - Personal information and interests
- 📧 **Contact** - Contact information and ways to reach out
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 🚀 **Easy Deployment** - Configured for Netlify

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Adding Blog Posts

To add a new blog post:

1. Create a new Markdown file in `content/blog/`
2. Name it with a slug (e.g., `my-new-post.md`)
3. Add frontmatter at the top:

```markdown
---
title: My New Post
date: 2024-11-02
excerpt: A brief description of the post
---

Your content here...
```

4. Push to git - the site will automatically rebuild on Netlify!

## Deployment

This site is configured for Netlify deployment:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect the repository to Netlify
3. Netlify will automatically detect the Next.js configuration and deploy
4. Future pushes to your main branch will trigger automatic deployments

The `netlify.toml` file contains the build configuration.

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Markdown** - Blog post content
- **gray-matter** - Frontmatter parsing
- **remark** - Markdown to HTML conversion

## License

© 2024 Jonathan Mares. All rights reserved.
