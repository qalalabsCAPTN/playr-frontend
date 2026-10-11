const fs = require('fs');
const path = 'C:/Users/aashi/Downloads/shopify_theme_export';

console.log('=== 1. ALL AVAILABLE SECTIONS IN THEME EXPORT (75 total) ===');
const sectionFiles = fs.readdirSync(`${path}/sections`).filter(f => f.endsWith('.liquid'));
const sectionUsage = {};
sectionFiles.forEach(f => {
  const base = f.replace('.liquid', '');
  sectionUsage[base] = [];
});

// Check where each section is used across all templates
const templateFiles = fs.readdirSync(`${path}/templates`).filter(f => f.endsWith('.json'));
templateFiles.forEach(tFile => {
  try {
    const t = JSON.parse(fs.readFileSync(`${path}/templates/${tFile}`, 'utf8'));
    if (t.sections) {
      Object.values(t.sections).forEach(s => {
        if (sectionUsage[s.type]) {
          sectionUsage[s.type].push(tFile);
        }
      });
    }
  } catch (e) {}
});

// Also check header, footer, popup groups
['header-group.json', 'footer-group.json', 'popup-group.json', 'general-group.json'].forEach(gFile => {
  try {
    const g = JSON.parse(fs.readFileSync(`${path}/sections/${gFile}`, 'utf8'));
    if (g.sections) {
      Object.values(g.sections).forEach(s => {
        if (sectionUsage[s.type]) {
          sectionUsage[s.type].push(gFile);
        }
      });
    }
  } catch (e) {}
});

console.log('\n--- Section Catalog & Template Usage ---');
Object.entries(sectionUsage).sort().forEach(([name, usedIn]) => {
  const uniqueTemplates = [...new Set(usedIn)];
  console.log(`${name.padEnd(35)}: used in [${uniqueTemplates.length ? uniqueTemplates.join(', ') : 'Theme Library / Unused'}]`);
});
