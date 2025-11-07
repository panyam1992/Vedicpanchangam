const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = process.cwd();
const htmlPath = path.join(root, 'index.html');
const scriptPath = path.join(root, 'script.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const script = fs.readFileSync(scriptPath, 'utf8');

const dom = new JSDOM(html);
const { window } = dom;
const { document } = window;

// Evaluate the page script inside the JSDOM window
window.eval(script);

// Provide sample inputs
const set = (id, v) => {
  const el = document.getElementById(id);
  if (!el) throw new Error('Missing input: ' + id);
  el.value = String(v);
};

set('tithi', 5);
set('vara', 2);
set('nakshatra', 10);
set('yoga', 3);
set('karanam', 1);
set('janma', 4);

// Call the function
if (typeof window.calculatePhalalu !== 'function') {
  console.error('calculatePhalalu not found in page script');
  process.exit(2);
}

window.calculatePhalalu();

const resultHtml = document.getElementById('result')?.innerHTML || '';
console.log('--- RESULT START ---');
console.log(resultHtml);
console.log('--- RESULT END ---');
