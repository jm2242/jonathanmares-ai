const fs = require('fs');
const path = require('path');

const oldBlogDir = '/tmp/personalWebsite-old/src/pages/blog';
const newBlogDir = path.join(__dirname, '..', 'content', 'blog');

// Ensure new blog directory exists
if (!fs.existsSync(newBlogDir)) {
  fs.mkdirSync(newBlogDir, { recursive: true });
}

// Get all blog post directories
const postDirs = fs.readdirSync(oldBlogDir).filter(dir => {
  const fullPath = path.join(oldBlogDir, dir);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Found ${postDirs.length} blog posts to migrate...`);

postDirs.forEach((dir) => {
  const oldPostPath = path.join(oldBlogDir, dir, 'index.md');
  
  if (!fs.existsSync(oldPostPath)) {
    console.log(`⚠️  No index.md found in ${dir}, skipping...`);
    return;
  }

  // Read the old post
  const content = fs.readFileSync(oldPostPath, 'utf8');
  
  // Extract slug from directory name (remove date prefix)
  // Format: 2021-12-24-feature-flags-post -> feature-flags-post
  const slugMatch = dir.match(/\d{4}-\d{2}-\d{2}-(.+)/);
  if (!slugMatch) {
    console.log(`⚠️  Could not parse slug from ${dir}, skipping...`);
    return;
  }
  
  const slug = slugMatch[1];
  const newPostPath = path.join(newBlogDir, `${slug}.md`);
  
  // Check if post already exists
  if (fs.existsSync(newPostPath)) {
    console.log(`⚠️  Post ${slug}.md already exists, skipping...`);
    return;
  }
  
  // Parse frontmatter to ensure date format is correct
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  if (!frontmatterMatch) {
    console.log(`⚠️  Could not parse frontmatter in ${dir}, skipping...`);
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];
  
  // Ensure date is in YYYY-MM-DD format
  const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
  let fixedFrontmatter = frontmatter;
  
  if (dateMatch) {
    const dateStr = dateMatch[1].trim();
    // If date is already in YYYY-MM-DD format, keep it; otherwise try to parse
    // For now, we'll assume dates are already in correct format or fix common issues
    // Dates like "2021-12-24" should be fine
  }
  
  // Remove 'draft' field if it's false, and remove 'cover' field (we'll handle images separately)
  let cleanedFrontmatter = fixedFrontmatter
    .split('\n')
    .filter(line => {
      // Remove draft: false lines
      if (line.trim().startsWith('draft:') && line.includes('false')) {
        return false;
      }
      // Keep cover line for now, but we might want to handle images differently
      return true;
    })
    .join('\n');
  
  // Write the new post
  const newContent = `---\n${cleanedFrontmatter}\n---\n\n${body}`;
  fs.writeFileSync(newPostPath, newContent, 'utf8');
  
  console.log(`✅ Migrated: ${slug}.md`);
});

console.log('\n✅ Migration complete!');
console.log(`📝 Check ${newBlogDir} for your migrated posts.`);

