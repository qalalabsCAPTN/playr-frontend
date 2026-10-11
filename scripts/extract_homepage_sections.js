const fs = require('fs');
const index = JSON.parse(fs.readFileSync('C:/Users/aashi/Downloads/shopify_theme_export/templates/index.json', 'utf8'));

index.order.forEach((k, idx) => {
  const s = index.sections[k];
  console.log(`\n========================================`);
  console.log(`SECTION #${idx + 1}: ${k} (Type: ${s.type}) Disabled: ${!!s.disabled}`);
  console.log(`========================================`);
  if (s.settings) {
    const importantSettings = {};
    for (const [sk, sv] of Object.entries(s.settings)) {
      if (typeof sv === 'string' && (sv.includes('http') || sv.includes('shopify://') || sv.length > 0 && !sk.includes('padding') && !sk.includes('margin') && !sk.includes('scheme') && !sk.includes('width') && !sk.includes('border') && !sk.includes('shadow') && !sk.includes('color'))) {
        importantSettings[sk] = sv;
      } else if (typeof sv === 'boolean' || typeof sv === 'number') {
        if (['columns', 'autoplay', 'loop'].some(x => sk.includes(x))) {
          importantSettings[sk] = sv;
        }
      }
    }
    console.log('Settings:', importantSettings);
  }
  if (s.blocks) {
    for (const [bid, b] of Object.entries(s.blocks)) {
      console.log(`  -> BLOCK: ${bid} (${b.type})`);
      const bSet = {};
      for (const [bk, bv] of Object.entries(b.settings || {})) {
        if (typeof bv === 'string' && bv.trim().length > 0 && !bk.includes('padding') && !bk.includes('margin') && !bk.includes('scheme') && !bk.includes('border') && !bk.includes('color')) {
          bSet[bk] = bv;
        }
      }
      console.log('     ', JSON.stringify(bSet));
    }
  }
});
