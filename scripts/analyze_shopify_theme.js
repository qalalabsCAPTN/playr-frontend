const fs = require('fs');
const themePath = 'C:/Users/aashi/Downloads/shopify_theme_export';

function analyzeIndex() {
  const index = JSON.parse(fs.readFileSync(`${themePath}/templates/index.json`, 'utf8'));
  console.log('=== HOMEPAGE SECTIONS IN INDEX.JSON ===');
  index.order.forEach((k, idx) => {
    const s = index.sections[k];
    console.log(`\n#${idx + 1}: ${k}`);
    console.log(`  Type: ${s.type} | Disabled: ${!!s.disabled}`);
    console.log(`  Key Settings:`, JSON.stringify({
      heading: s.settings?.heading || s.settings?.title || s.settings?.text,
      collection: s.settings?.collection,
      collections: s.settings?.collections,
      link: s.settings?.link,
      section_width: s.settings?.section_width,
      aspect_ratio: s.settings?.aspect_ratio
    }));
    if (s.blocks) {
      console.log(`  Blocks (${Object.keys(s.blocks).length}):`);
      Object.entries(s.blocks).forEach(([bid, b]) => {
        console.log(`    - [${b.type}] heading="${b.settings?.heading || b.settings?.title || b.settings?.label || ''}" col="${b.settings?.collection || ''}" img="${b.settings?.image || b.settings?.desktop_image || ''}" link="${b.settings?.link || ''}"`);
      });
    }
  });
}

function analyzeHeader() {
  console.log('\n=== HEADER GROUP ===');
  const h = JSON.parse(fs.readFileSync(`${themePath}/sections/header-group.json`, 'utf8'));
  h.order.forEach(k => {
    const s = h.sections[k];
    console.log(`Section: ${k} (${s.type}), disabled: ${!!s.disabled}`);
    if (s.blocks) {
      Object.entries(s.blocks).forEach(([bid, b]) => {
        console.log(`  Block: ${b.type}`, b.settings);
      });
    }
  });
}

function analyzeFooter() {
  console.log('\n=== FOOTER GROUP ===');
  const f = JSON.parse(fs.readFileSync(`${themePath}/sections/footer-group.json`, 'utf8'));
  f.order.forEach(k => {
    const s = f.sections[k];
    console.log(`Section: ${k} (${s.type}), disabled: ${!!s.disabled}`);
    if (s.blocks) {
      Object.entries(s.blocks).forEach(([bid, b]) => {
        console.log(`  Block: ${b.type}`, b.settings?.heading || b.settings?.title || b.settings);
      });
    }
  });
}

function analyzePopups() {
  console.log('\n=== POPUPS ===');
  const p = JSON.parse(fs.readFileSync(`${themePath}/sections/popup-group.json`, 'utf8'));
  p.order.forEach(k => {
    const s = p.sections[k];
    console.log(`Popup: ${k} (${s.type}), disabled: ${!!s.disabled}`);
  });
}

function analyzeAllTemplates() {
  console.log('\n=== OTHER TEMPLATES ===');
  const files = fs.readdirSync(`${themePath}/templates`);
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'index.json') {
      try {
        const t = JSON.parse(fs.readFileSync(`${themePath}/templates/${file}`, 'utf8'));
        console.log(`\nTemplate: ${file} (order: ${t.order ? t.order.join(', ') : 'none'})`);
        if (t.sections) {
          Object.entries(t.sections).forEach(([sk, sv]) => {
            console.log(`  -> ${sk} (${sv.type}) disabled: ${!!sv.disabled}`);
          });
        }
      } catch (e) {}
    }
  });
}

analyzeHeader();
analyzeIndex();
analyzeFooter();
analyzePopups();
analyzeAllTemplates();
