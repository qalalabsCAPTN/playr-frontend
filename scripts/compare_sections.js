const fs = require('fs');

const themePath = 'C:/Users/aashi/Downloads/shopify_theme_export';
const sectionsDir = `${themePath}/sections`;
const templatesDir = `${themePath}/templates`;

// 1. All sections in Shopify Theme Export
const themeSections = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid') || f.endsWith('.json'));

// 2. Sections in index.json (Homepage)
const indexJson = JSON.parse(fs.readFileSync(`${templatesDir}/index.json`, 'utf8'));
const indexSections = indexJson.order.map(k => {
  const s = indexJson.sections[k];
  return {
    id: k,
    type: s.type,
    disabled: !!s.disabled,
    settings: s.settings,
    blocks: s.blocks ? Object.values(s.blocks).map(b => ({ type: b.type, settings: b.settings })) : []
  };
});

// 3. Current frontend components
const bluorngDir = 'apps/playr/src/components/bluorng';
const currentComponents = fs.existsSync(bluorngDir) ? fs.readdirSync(bluorngDir) : [];

const homeDir = 'apps/playr/src/components/home';
const homeComponents = fs.existsSync(homeDir) ? fs.readdirSync(homeDir) : [];

console.log('=== SUMMARY OF SHOPIFY THEME EXPORT ===');
console.log('Total Section Files in Theme:', themeSections.length);
console.log('Total Active Homepage Sections:', indexSections.filter(s => !s.disabled).length);
console.log('Total Disabled Homepage Sections:', indexSections.filter(s => s.disabled).length);

console.log('\n=== CURRENT FRONTEND HOMEPAGE SECTIONS ===');
const homePageFile = fs.readFileSync('apps/playr/src/app/page.tsx', 'utf8');
const imports = homePageFile.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g) || [];
imports.forEach(i => console.log(i));

console.log('\n=== CURRENT BLUORNG COMPONENTS ===');
currentComponents.forEach(c => console.log(c));

console.log('\n=== CURRENT HOME COMPONENTS ===');
homeComponents.forEach(c => console.log(c));
