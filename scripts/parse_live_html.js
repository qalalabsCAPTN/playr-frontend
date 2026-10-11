const fs = require('fs');

const html = fs.readFileSync('scripts/live_playr_in.html', 'utf8');

console.log('=== SHOPIFY SECTIONS FOUND ON LIVE SITE ===');
const sectionRegex = /id=["']shopify-section-([^"']+)["']/g;
let m;
const liveSections = [];
while ((m = sectionRegex.exec(html)) !== null) {
  liveSections.push(m[1]);
}
console.log('Unique live section count:', new Set(liveSections).size);
console.log('Live sections in order of appearance:');
[...new Set(liveSections)].forEach((s, i) => console.log(`${i + 1}. ${s}`));

console.log('\n=== HEADINGS FOUND ON LIVE HOMEPAGE ===');
const hRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
const headings = [];
while ((m = hRegex.exec(html)) !== null) {
  const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (text && text.length < 100 && !headings.includes(text)) {
    headings.push(text);
  }
}
headings.forEach(h => console.log(`- ${h}`));

console.log('\n=== SCRIPTS / APPS / INTEGRATIONS DETECTED ===');
const appKeywords = ['judge.me', 'nector', 'gsc-instagram', 'quizive', 'whatsapp', 'klaviyo', 'payu', 'razorpay', 'shiprocket', 'returngo', 'customerfields', 'simpl', 'cashfree', 'gokwik'];
appKeywords.forEach(kw => {
  if (html.toLowerCase().includes(kw)) {
    console.log(`- Detected integration/app: ${kw}`);
  }
});
