const fs = require('fs');
if (!fs.existsSync('./lh.json')) {
  console.log('Lighthouse report not found');
  process.exit(0);
}
const data = JSON.parse(fs.readFileSync('./lh.json', 'utf8'));
const scores = {
  performance: Math.round(data.categories.performance.score * 100),
  accessibility: Math.round(data.categories.accessibility.score * 100),
  bestPractices: Math.round(data.categories['best-practices'].score * 100),
  seo: Math.round(data.categories.seo.score * 100),
};
console.log('Lighthouse Scores:', scores);
