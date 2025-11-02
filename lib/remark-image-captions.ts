import { visit } from 'unist-util-visit';
import type { Root, Paragraph, Image, Emphasis, Text } from 'mdast';

/**
 * Remark plugin that transforms markdown patterns like:
 * 
 * ![alt](image.jpg)
 * *Caption text*
 * 
 * Or even when in same paragraph:
 * ![alt](image.jpg)
 * *Caption text*
 * 
 * Into proper HTML figure/figcaption elements:
 * 
 * <figure>
 *   <img src="image.jpg" alt="alt">
 *   <figcaption>Caption text</figcaption>
 * </figure>
 */
export function remarkImageCaptions() {
  return (tree: Root) => {
    const replacements: Array<{ 
      paragraph: Paragraph; 
      imageIndex: number;
      parent: any;
    }> = [];
    
    visit(tree, 'paragraph', (paragraph: Paragraph, index, parent) => {
      if (!parent || !Array.isArray(parent.children)) return;
      
      // Look for paragraphs that contain an image
      const imageIndex = paragraph.children.findIndex(child => child.type === 'image');
      if (imageIndex === -1) return;
      
      const image = paragraph.children[imageIndex] as Image;
      
      // Check if there's an em (italic) node after the image (could be next sibling in same paragraph)
      const emIndex = paragraph.children.findIndex((child, idx) => 
        idx > imageIndex && child.type === 'emphasis'
      );
      
      if (emIndex !== -1) {
        // Found image + caption in same paragraph
        const emNode = paragraph.children[emIndex] as Emphasis;
        const captionText = extractTextFromEmphasis(emNode);
        
        replacements.push({
          paragraph,
          imageIndex: parent.children.indexOf(paragraph),
          parent,
        });
        
        // We'll replace this paragraph with a figure HTML node
        // Do this after visiting to avoid modifying while traversing
      }
    });
    
    // Also check for captions in following paragraphs
    visit(tree, 'image', (image: Image, index, parent) => {
      if (!parent || !Array.isArray(parent.children)) return;
      
      const imageIndex = parent.children.indexOf(image);
      
      // Check if image is in a paragraph - if so, we might have already handled it above
      if (parent.children[imageIndex]?.type === 'paragraph') return;
      
      // Look at next node(s) for a caption paragraph
      for (let i = imageIndex + 1; i < parent.children.length && i < imageIndex + 5; i++) {
        const nextNode = parent.children[i];
        
        if (nextNode && nextNode.type === 'paragraph') {
          const paragraph = nextNode as Paragraph;
          
          // Check if this paragraph contains only an emphasis node
          if (
            paragraph.children.length === 1 &&
            paragraph.children[0].type === 'emphasis'
          ) {
            const emNode = paragraph.children[0] as Emphasis;
            const captionText = extractTextFromEmphasis(emNode);
            
            // Create figure HTML
            const escapedUrl = escapeHtml(image.url || '');
            const escapedAlt = escapeHtml(image.alt || '');
            const escapedCaption = escapeHtml(captionText);
            
            const figureHtml = {
              type: 'html',
              value: `<figure>\n  <img src="${escapedUrl}" alt="${escapedAlt}" />\n  <figcaption>${escapedCaption}</figcaption>\n</figure>`,
            };
            
            // Replace image with figure and remove caption paragraph
            parent.children[imageIndex] = figureHtml as any;
            parent.children.splice(i, 1);
            break;
          } else {
            // If we hit a paragraph with other content, stop
            break;
          }
        }
      }
    });
    
    // Now handle paragraphs with image + caption in same paragraph
    replacements.reverse().forEach(({ paragraph, imageIndex, parent }) => {
      const imgNode = paragraph.children.find(child => child.type === 'image') as Image;
      const emNode = paragraph.children.find(child => 
        child.type === 'emphasis' && 
        paragraph.children.indexOf(child) > paragraph.children.indexOf(imgNode)
      ) as Emphasis;
      
      if (!imgNode || !emNode) return;
      
      const captionText = extractTextFromEmphasis(emNode);
      const escapedUrl = escapeHtml(imgNode.url || '');
      const escapedAlt = escapeHtml(imgNode.alt || '');
      const escapedCaption = escapeHtml(captionText);
      
      const figureHtml = {
        type: 'html',
        value: `<figure>\n  <img src="${escapedUrl}" alt="${escapedAlt}" />\n  <figcaption>${escapedCaption}</figcaption>\n</figure>`,
      };
      
      parent.children[imageIndex] = figureHtml as any;
    });
  };
}

function extractTextFromEmphasis(emphasis: Emphasis): string {
  return emphasis.children
    .map((child) => {
      if (child.type === 'text') {
        return (child as Text).value;
      }
      if (child.type === 'emphasis') {
        return extractTextFromEmphasis(child as Emphasis);
      }
      return '';
    })
    .join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
