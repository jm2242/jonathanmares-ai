const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'content', 'blog');
const imageDir = path.join(__dirname, '..', 'public', 'blog-images');

// Get all available images
const availableImages = fs.existsSync(imageDir) 
  ? fs.readdirSync(imageDir).map(f => f.toLowerCase())
  : [];

console.log(`Found ${availableImages.length} images to match...`);

// Get all markdown files
const markdownFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

markdownFiles.forEach((file) => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Match image references like ![alt](./image.jpg) or ![alt](image.jpg) or ![alt](/path/image.jpg)
  // Also match in markdown: ![alt](image.jpg) or ![alt](./image.jpg)
  const imageRegex = /!\[([^\]]*)\]\((\.?\/?)([^)]+\.(jpg|jpeg|png|gif))\)/gi;
  
  content = content.replace(imageRegex, (match, alt, prefix, imageName, ext) => {
    // Clean up the image name
    const cleanName = imageName.replace(/^\.\//, '').toLowerCase();
    
    // Check if this image exists in our blog-images directory
    if (availableImages.includes(cleanName)) {
      modified = true;
      // Replace with new path
      return `![${alt}](/blog-images/${cleanName})`;
    }
    
    // If not found, try to find it with different casing
    const foundImage = availableImages.find(img => img.toLowerCase() === cleanName);
    if (foundImage) {
      modified = true;
      return `![${alt}](/blog-images/${foundImage})`;
    }
    
    console.log(`⚠️  Image not found: ${imageName} in ${file}`);
    return match; // Keep original if not found
  });
  
  // Also handle cover image in frontmatter
  const coverRegex = /^cover:\s*\.?\/?([^\n]+)$/m;
  content = content.replace(coverRegex, (match, imagePath) => {
    const cleanName = imagePath.replace(/^\.\//, '').toLowerCase();
    const foundImage = availableImages.find(img => img.toLowerCase() === cleanName);
    if (foundImage) {
      modified = true;
      return `cover: /blog-images/${foundImage}`;
    }
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed image paths in: ${file}`);
  }
});

console.log('\n✅ Image path fixing complete!');

