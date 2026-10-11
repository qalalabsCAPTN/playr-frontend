const fs = require('fs');

const liveHtmlPath = 'C:/Users/aashi/.gemini/antigravity/brain/371906d7-937d-4679-84e7-d2b5632020b3/.system_generated/steps/63/content.md';
const content = fs.readFileSync(liveHtmlPath, 'utf8');

console.log('=== LIVE SECTIONS EXTRACTED ===');
const sectionMatches = content.match(/id=["']shopify-section-[^"']+["']/g) || [];
sectionMatches.forEach(m => console.log(m));

console.log('\n=== SECTION HEADINGS & TITLES IN LIVE HTML ===');
const headings = content.match(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi) || [];
headings.forEach(h => {
  const clean = h.replace(/<[^>]+>/g, '').trim();
  if (clean && clean.length < 80) {
    console.log(`- ${clean}`);
  }
});
