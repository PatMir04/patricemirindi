// Browser smoke tests for patricemirindi.com.
//
//   node smoke.mjs                         test ./docs on a local server with World Bank data mocked
//   BASE_URL=https://patricemirindi.com node smoke.mjs   test the live site against the real API
//
// Env: CHROME_PATH (default: google-chrome on PATH), OFFLINE=1 (serve Chart.js from node_modules and
// stub other CDNs — for sandboxes without internet), PRIVATE_BLOCKLIST (comma-separated terms that
// must never appear in chatbot answers), SCREENSHOTS=dir (save page screenshots).
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(here, '..', 'docs');
const LIVE = !!process.env.BASE_URL;
const OFFLINE = process.env.OFFLINE === '1';
const PRIVATE = (process.env.PRIVATE_BLOCKLIST || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const SHOTS = process.env.SCREENSHOTS;
const PAGES = ['/', '/about.html', '/work-experience.html', '/skills-expertise.html', '/key-projects.html',
  '/data-analytics.html', '/blog.html', '/contact.html'];

const failures = [];
let passed = 0;
function check(cond, msg) { if (cond) passed++; else { failures.push(msg); console.log('  ✗ ' + msg); } }

// ---------- local static server ----------
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(DOCS, path.normalize(p));
      if (!f.startsWith(DOCS) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        res.writeHead(404, { 'content-type': 'text/html' });
        return res.end(fs.readFileSync(path.join(DOCS, '404.html')));
      }
      res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve(srv));
  });
}

// ---------- mocked World Bank API ----------
function wbFixture(url) {
  const u = new URL(url);
  const m = u.pathname.match(/country\/([^/]+)\/indicator\/([^/]+)/);
  const countries = decodeURIComponent(m[1]).split(';');
  const code = m[2];
  const rows = [];
  countries.forEach((c, ci) => {
    for (let y = 2024; y >= 2000; y--) {
      const sparse = code === 'SI.POV.DDAY' || code === 'FX.OWN.TOTL.ZS';
      const value = sparse && y % 3 ? null : +(10 + ci * 3 + Math.sin(y + ci) * 2 + (y - 2000) * 0.2).toFixed(3);
      rows.push({ indicator: { id: code, value: 'Mock indicator ' + code }, country: { id: c, value: c },
        countryiso3code: c, date: String(y), value, unit: '', obs_status: '', decimal: 1 });
    }
  });
  return JSON.stringify([{ page: 1, pages: 1, per_page: 20000, total: rows.length, sourceid: '2', lastupdated: '2026-10-01' }, rows]);
}

async function main() {
  const chromePath = process.env.CHROME_PATH || execSync('command -v google-chrome || command -v chromium || command -v chromium-browser').toString().trim();
  let srv, base = process.env.BASE_URL;
  if (!LIVE) { srv = await serve(); base = 'http://127.0.0.1:' + srv.address().port; }
  console.log(`Testing ${base}${LIVE ? '' : ' (World Bank API mocked)'}`);
  const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
  const context = await browser.newContext({ acceptDownloads: true });

  if (!LIVE) {
    await context.route('https://api.worldbank.org/**', r => r.fulfill({ contentType: 'application/json', body: wbFixture(r.request().url()) }));
  }
  if (OFFLINE) {
    const chartJs = fs.readFileSync(path.join(here, 'node_modules/chart.js/dist/chart.umd.js'));
    await context.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/Chart\.js\/.*chart\.umd\.min\.js/, r => r.fulfill({ contentType: 'text/javascript', body: chartJs }));
    await context.route(/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome|unpkg\.com|cdn\.jsdelivr\.net|cdn\.plot\.ly|d3js\.org|formspree\.io|ghchart\.rshah\.org|tile\.openstreetmap\.org/,
      r => r.fulfill({ status: 200, contentType: r.request().resourceType() === 'stylesheet' ? 'text/css' : 'text/javascript', body: '' }));
  }

  async function open(p, viewport = { width: 1366, height: 900 }) {
    const page = await context.newPage();
    await page.setViewportSize(viewport);
    const errors = [], bad = [];
    // Offline sandboxes stub third-party libraries, so their "not defined" errors are expected there
    const offlineNoise = m => OFFLINE && /\b(AOS|L|Plotly|d3) is not defined/.test(m);
    page.on('pageerror', e => { if (!offlineNoise(e.message)) errors.push(e.message); });
    page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text()) && !offlineNoise(m.text())) errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) bad.push(r.status() + ' ' + r.url()); });
    await page.goto(base + p, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    return { page, errors, bad };
  }

  // 1. Every page: no errors, no broken same-origin files, one h1, assistant present, no sideways scroll on phones
  for (const p of PAGES) {
    console.log('• ' + p);
    const { page, errors, bad } = await open(p);
    check(!errors.length, `${p}: JavaScript errors: ${errors.join(' | ')}`);
    check(!bad.length, `${p}: broken files: ${bad.join(', ')}`);
    check(await page.locator('h1').count() === 1, `${p}: should have exactly one <h1>`);
    check(await page.locator('.kc-btn').count() === 1, `${p}: chatbot button missing`);
    for (const term of PRIVATE) check(!(await page.content()).toLowerCase().includes(term), `${p}: contains a private term`);
    if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, (p.replace(/\W+/g, '_') || 'home') + '.png'), fullPage: false }); }
    await page.close();
    const m = await open(p, { width: 375, height: 812 });
    const overflow = await m.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 1, `${p}: page scrolls sideways on a 375px phone (${overflow}px)`);
    if (SHOTS) await m.page.screenshot({ path: path.join(SHOTS, (p.replace(/\W+/g, '_') || 'home') + '_mobile.png') });
    await m.page.close();
  }

  // 2. Home page content
  console.log('• home details');
  {
    const { page } = await open('/');
    await page.waitForTimeout(1500);
    check(await page.locator('#services .card').count() === 4, 'home: four service cards');
    check(await page.locator('#latest-card').isVisible(), 'home: latest-article card visible');
    check(await page.locator('#post-cards .card').count() >= 1, 'home: recent articles listed');
    const charts = await page.evaluate(() => ['c-pov', 'c-acc', 'c-agr', 'c-co2'].map(id => !!(window.Chart && Chart.getChart(id))));
    check(charts.every(Boolean), `home: all four indicator charts render (${charts})`);
    await page.close();
  }

  // 3. Dashboard works end to end
  console.log('• dashboard');
  {
    const { page, errors } = await open('/data-analytics.html');
    await page.waitForFunction(() => window.Chart && Chart.getChart('trend-chart'), null, { timeout: 15000 }).catch(() => {});
    const n0 = await page.evaluate(() => Chart.getChart('trend-chart')?.data.datasets.length || 0);
    check(n0 >= 3, `dashboard: trend chart draws the default countries (${n0})`);
    check(await page.locator('#dash-status').isHidden(), 'dashboard: loading message clears');
    await page.selectOption('#indicator', 'SP.DYN.LE00.IN');
    await page.waitForTimeout(800);
    check((await page.textContent('#chart-title')).includes('Life expectancy'), 'dashboard: indicator change updates the chart title');
    check(page.url().includes('i=SP.DYN.LE00.IN'), 'dashboard: URL keeps the selected indicator');
    await page.getByRole('button', { name: "Where I've worked" }).click();
    await page.waitForTimeout(800);
    const n1 = await page.evaluate(() => Chart.getChart('trend-chart')?.data.datasets.length || 0);
    check(n1 >= 6, `dashboard: preset loads its countries (${n1})`);
    await page.selectOption('#year-from', '2015');
    await page.waitForTimeout(300);
    const first = await page.evaluate(() => Chart.getChart('trend-chart').data.labels[0]);
    check(+first >= 2015, `dashboard: year filter applies (${first})`);
    check(await page.locator('#dash-table tbody tr').count() >= 5, 'dashboard: data table has rows');
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('#download-csv')]);
    if (dl) {
      const csv = fs.readFileSync(await dl.path(), 'utf8');
      check(csv.startsWith('country_code,country,year,indicator_code,indicator,value'), 'dashboard: CSV has the expected header');
      check(csv.split('\n').length > 10, 'dashboard: CSV has data rows');
    } else check(false, 'dashboard: CSV download did not start');
    await page.locator('#country-search').fill('ken');
    check(await page.locator('.country:visible').count() === 1, 'dashboard: country filter narrows the list');
    check(!errors.length, `dashboard: JavaScript errors: ${errors.join(' | ')}`);
    await page.close();
  }

  // 4. Chatbot answers from the knowledge base
  console.log('• chatbot');
  {
    const { page } = await open('/');
    const ask = q => page.evaluate(q => window.KnowledgeChat.ask(q), q);
    const a1 = await ask('What services do you offer?');
    check(/Power BI/.test(a1.text), 'chatbot: services answer mentions Power BI');
    const a2 = await ask('How do I remove duplicate rows in SQL?');
    check(/ROW_NUMBER/.test(a2.code || ''), 'chatbot: SQL question returns the ROW_NUMBER snippet');
    const a3 = await ask('Comment vous joindre ?');
    check(a3.lang === 'fr' && /formulaire/.test(a3.text), 'chatbot: French contact question answered in French');
    const a4 = await ask('Who do you work for right now?');
    check(/Data Systems Analyst/.test(a4.text), 'chatbot: current-role answer');
    for (const term of PRIVATE) check(!JSON.stringify(a4).toLowerCase().includes(term), 'chatbot: current-role answer leaks a private term');
    const a5 = await ask('Show me recent articles');
    check((a5.links || []).length >= 1, 'chatbot: lists recent articles');
    await page.click('.kc-btn');
    await page.fill('.kc-form input', 'Which countries has Patrice worked in?');
    await page.press('.kc-form input', 'Enter');
    await page.waitForTimeout(500);
    check(await page.locator('.kc-bot').count() >= 2, 'chatbot: UI shows an answer');
    await page.close();
  }

  // 5. Blog index, filters and article pages
  console.log('• blog');
  {
    const { page } = await open('/blog.html?lang=en');
    const en = await page.locator('.post-card').count();
    check(en >= 1, 'blog: English articles listed');
    await page.click('[data-lang="fr"]');
    const frTitles = await page.locator('.post-card h2').allTextContents();
    check(frTitles.length === en, 'blog: French list matches English count');
    const seriesBtns = page.locator('#tag-filters button');
    check(await seriesBtns.count() >= 2, 'blog: series filters present');
    await page.close();
    const posts = JSON.parse(LIVE ? await (await fetch(base + '/blog/posts.json')).text() : fs.readFileSync(path.join(DOCS, 'blog/posts.json'), 'utf8'));
    for (const p of posts.slice(0, 4)) {
      const a = await open(p.url);
      check(await a.page.locator('.sources li').count() >= 1, `${p.url}: lists sources`);
      check(await a.page.locator('link[hreflang]').count() === 2, `${p.url}: links its translation`);
      check(!a.errors.length, `${p.url}: JavaScript errors: ${a.errors.join(' | ')}`);
      await a.page.close();
    }
  }

  await browser.close();
  if (srv) srv.close();
  console.log(`\n${passed} checks passed, ${failures.length} failed`);
  process.exit(failures.length ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
