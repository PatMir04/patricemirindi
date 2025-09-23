/* assets/js/global-analytics-dashboard.js
   Global Development Analytics – live auto-updating from official public APIs
   Design-safe: uses your existing IDs, classes, and markup.
*/

/* ==============================
   Utility: DOM helpers
============================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ==============================
   Controls & targets (existing IDs)
============================== */
const countrySelect = $('#country-selector');
const indicatorSelect = $('#indicator-selector');
const timeRangeSelect = $('#time-range');
const chartTypeSelect = $('#chart-type');
const btnUpdate = $('#update-charts');

const showTrends = $('#show-trends');
const showForecasts = $('#show-forecasts');

const mainChartTitle = $('#main-chart-title');
const mainChartInfo  = $('#main-chart-info');
const mainChartSrc   = $('#main-chart-source'); // chart-citation in main chart

/* Secondary chart source lines (already in your HTML) */
const comparisonSourceEl = document.querySelector('.charts-grid .chart-container:nth-child(1) .chart-citation .data-source');
const regionalSourceEl   = document.querySelector('.charts-grid .chart-container:nth-child(2) .chart-citation .data-source');
const tradeSourceEl      = document.querySelector('.charts-grid .chart-container:nth-child(3) .chart-citation .data-source');
const devSourceEl        = document.querySelector('.charts-grid .chart-container:nth-child(4) .chart-citation .data-source');

/* ==============================
   Country code helpers
   - Your <option> values are ISO2 (e.g., "CA"), which World Bank supports.
============================== */
function getSelectedCountries() {
  return Array.from(countrySelect.selectedOptions).map(o => o.value);
}

/* ==============================
   Time range parsing
============================== */
function parseTimeRange(val) {
  // e.g., "2015-2024"
  const m = /^(\d{4})-(\d{4})$/.exec(val);
  if (!m) return { start: 2015, end: 2024 };
  return { start: +m[1], end: +m[2] };
}

/* ==============================
   Dataset registry (source adapters)
   Minimal viable connections:
   - World Bank (robust, keyless, JSON)
   - Derived (computed, e.g., Trade Balance)
   Placeholders for UNDP/UNESCO/IMF/WHO/FAOSTAT (connect later).
============================== */
const Registry = {
  worldbank: {
    label: 'World Bank Open Data',
    // indicatorCode example: "NY.GDP.MKTP.KD.ZG"
    fetchSeries: async ({ indicatorCode, countries, startYear, endYear }) => {
      // WB paginates; we fetch per-country for clarity & stable error handling
      const series = {};
      for (const iso2 of countries) {
        const url = `https://api.worldbank.org/v2/country/${encodeURIComponent(iso2)}/indicator/${encodeURIComponent(indicatorCode)}?date=${startYear}:${endYear}&format=json&per_page=2000`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`World Bank fetch failed: ${iso2} ${indicatorCode}`);
        const data = await resp.json();
        // data[1] holds observations, data[0] holds meta (lastupdated)
        const lastUpdated = (data?.[0]?.lastupdated) ? new Date(data[0].lastupdated).toISOString().slice(0,10) : '';
        const rows = (data?.[1] || [])
          .filter(d => d.value !== null && d.date) // values exist
          .map(d => ({ year: +d.date, value: +d.value }));
        // Sort ascending by year
        rows.sort((a,b) => a.year - b.year);
        series[iso2] = { points: rows, lastUpdated, source: 'World Bank Open Data', sourceUrl: 'https://data.worldbank.org' };
      }
      return series;
    }
  },

  derived: {
    label: 'Derived (from other sources)',
    // For trade-balance, compute Exports - Imports using World Bank codes
    fetchSeries: async ({ indicatorCode, countries, startYear, endYear }) => {
      if (indicatorCode !== 'NE.EXP.GNFS.CD-NE.IMP.GNFS.CD') {
        throw new Error('Unknown derived indicator');
      }
      // Pull both series from WB, then subtract
      const exp = await Registry.worldbank.fetchSeries({ indicatorCode: 'NE.EXP.GNFS.CD', countries, startYear, endYear });
      const imp = await Registry.worldbank.fetchSeries({ indicatorCode: 'NE.IMP.GNFS.CD', countries, startYear, endYear });

      const series = {};
      for (const iso2 of countries) {
        const map = new Map();
        (exp[iso2]?.points || []).forEach(p => map.set(p.year, { year: p.year, exp: p.value, imp: null }));
        (imp[iso2]?.points || []).forEach(p => {
          const m = map.get(p.year) || { year: p.year, exp: null, imp: null };
          m.imp = p.value;
          map.set(p.year, m);
        });
        const points = Array.from(map.values())
          .filter(r => r.exp != null && r.imp != null)
          .map(r => ({ year: r.year, value: r.exp - r.imp }));
        points.sort((a,b) => a.year - b.year);

        // Build source line combining both WB series
        const lastUpdated = [exp[iso2]?.lastUpdated, imp[iso2]?.lastUpdated].filter(Boolean).sort().pop() || '';
        const source = 'World Bank Open Data (Exports & Imports)';
        const sourceUrl = 'https://data.worldbank.org';
        series[iso2] = { points, lastUpdated, source, sourceUrl };
      }
      return series;
    }
  },

  // Placeholders for specialist APIs. They render “Source pending” until keys/routes added.
  undp: {
    label: 'UNDP Human Development Data',
    fetchSeries: async () => {
      return { _pending: true, _note: 'Connect UNDP API for HDI/GDI. Showing placeholder.' };
    }
  },
  unesco: {
    label: 'UNESCO Institute for Statistics',
    fetchSeries: async () => {
      return { _pending: true, _note: 'Connect UNESCO UIS API for education index. Showing placeholder.' };
    }
  },
  imf: {
    label: 'IMF SDMX (WEO/IFS)',
    fetchSeries: async () => {
      return { _pending: true, _note: 'Connect IMF SDMX JSON (e.g., IFS/EXR). Showing placeholder.' };
    }
  },
  who: {
    label: 'WHO Global Health Observatory',
    fetchSeries: async () => {
      return { _pending: true, _note: 'Connect WHO GHO API (indicator codes like UHC_SER_1). Showing placeholder.' };
    }
  },
  faostat: {
    label: 'FAOSTAT',
    fetchSeries: async () => {
      return { _pending: true, _note: 'Connect FAOSTAT API for food security. Showing placeholder.' };
    }
  },
  // UN Comtrade requires throttling/API key for heavy use. Hook later if needed.
  comtrade: {
    label: 'UN Comtrade',
    fetchSeries: async () => {
      return { _pending: true, _note: 'Connect UN Comtrade for detailed HS trade flows. Showing placeholder.' };
    }
  }
};

/* ==============================
   Indicator resolver
   - Reads data-source & data-code if present
   - Defaults to World Bank mapping for common indicators
============================== */
function resolveIndicator() {
  const opt = indicatorSelect.selectedOptions[0];
  const id = opt?.value || 'gdp-growth';
  const src = opt?.dataset?.source;
  const code = opt?.dataset?.code;

  // Fallback mappings (if data-* not present)
  const defaults = {
    'gdp-growth':       { source: 'worldbank', code: 'NY.GDP.MKTP.KD.ZG', label: 'GDP Growth Rate (%)' },
    'inflation':        { source: 'worldbank', code: 'FP.CPI.TOTL.ZG',    label: 'Inflation Rate (%)' },
    'unemployment':     { source: 'worldbank', code: 'SL.UEM.TOTL.ZS',    label: 'Unemployment Rate (%) of labor force' },
    'fdi':              { source: 'worldbank', code: 'BX.KLT.DINV.WD.GD.ZS', label: 'FDI, net inflows (% of GDP)' },
    'debt-gdp':         { source: 'worldbank', code: 'GC.DOD.TOTL.GD.ZS', label: 'Government debt (% of GDP)' },
    'poverty':          { source: 'worldbank', code: 'SI.POV.DDAY',       label: 'Poverty headcount ratio ($2.15/day, % of pop.)' },
    'life-expectancy':  { source: 'worldbank', code: 'SP.DYN.LE00.IN',    label: 'Life expectancy at birth (years)' },
    'exports':          { source: 'worldbank', code: 'NE.EXP.GNFS.CD',    label: 'Exports of goods & services (current US$)' },
    'imports':          { source: 'worldbank', code: 'NE.IMP.GNFS.CD',    label: 'Imports of goods & services (current US$)' },
    'trade-balance':    { source: 'derived',   code: 'NE.EXP.GNFS.CD-NE.IMP.GNFS.CD', label: 'Trade balance (US$)' },
    'internet-users':   { source: 'worldbank', code: 'IT.NET.USER.ZS',    label: 'Individuals using the Internet (% of pop.)' },
    'mobile-subscriptions': { source: 'worldbank', code: 'IT.CEL.SETS.P2',label: 'Mobile cellular subscriptions (per 100 people)' },
    // Specialized (pending live connectors unless data-* present)
    'hdi':              { source: 'undp',     code: 'HDI',                label: 'Human Development Index' },
    'education':        { source: 'unesco',   code: 'EDU_INDEX',          label: 'Education Index' },
    'gender-equality':  { source: 'undp',     code: 'GDI',                label: 'Gender Development Index' },
    'financial-inclusion': { source: 'worldbank', code: 'FX.OWN.TOTL.ZS', label: 'Account ownership (% age 15+)' },
    'exchange-rate':    { source: 'imf',      code: 'EXR.A',              label: 'Exchange rate (index/stability)' },
    'healthcare':       { source: 'who',      code: 'UHC_SER_1',          label: 'UHC service coverage index' },
    'food-security':    { source: 'faostat',  code: 'FS.FIES.MD',         label: 'Food insecurity (moderate/severe, %)' },
  };

  const base = defaults[id] || defaults['gdp-growth'];
  return {
    id,
    label: base.label,
    source: src || base.source,
    code: code || base.code
  };
}

/* ==============================
   Chart.js setup (reuses existing canvases)
============================== */
let mainTrendChart, comparisonChart, regionalChart, tradeChart, developmentChart;

function lineOrBar(type) {
  if (['line','bar','scatter','radar'].includes(type)) return type;
  return 'line';
}

function buildDataset(label, points) {
  // Chart.js expects [{x: date, y: value}] for time series
  return points.map(p => ({ x: new Date(`${p.year}-01-01`), y: p.value }));
}

function ensureChart(ctx, config) {
  if (!ctx._chart) {
    ctx._chart = new Chart(ctx, config);
  } else {
    ctx._chart.config.data = config.data;
    ctx._chart.config.options = config.options;
    ctx._chart.update();
  }
  return ctx._chart;
}

/* ==============================
   Formatting helpers
============================== */
const fmt = {
  number: (n) => {
    if (Math.abs(n) >= 1e12) return (n/1e12).toFixed(2) + 'T';
    if (Math.abs(n) >= 1e9)  return (n/1e9).toFixed(2)  + 'B';
    if (Math.abs(n) >= 1e6)  return (n/1e6).toFixed(2)  + 'M';
    if (Math.abs(n) >= 1e3)  return (n/1e3).toFixed(2)  + 'K';
    return (Math.round(n*100)/100).toString();
  },
  percent: (n) => `${(Math.round(n*10)/10).toFixed(1)}%`,
  dateISO: (d) => (d ? new Date(d).toISOString().slice(0,10) : '')
};

/* ==============================
   Source line writer (per chart)
============================== */
function writeSource(el, sourceLabel, url, lastUpdated) {
  if (!el) return;
  const dateTxt = lastUpdated ? ` (Last updated: ${lastUpdated})` : '';
  el.textContent = `Source: ${sourceLabel}${dateTxt}`;
  if (el.id === 'main-chart-source') {
    // keep your original wording style for main chart
    el.textContent = `${sourceLabel}${dateTxt ? ' — ' + dateTxt : ''}`;
  }
}

/* ==============================
   Data pipeline
============================== */
async function loadAndRender() {
  const { start, end } = parseTimeRange(timeRangeSelect.value);
  const { source, code, label, id } = resolveIndicator();
  const countries = getSelectedCountries();
  const chartKind = lineOrBar(chartTypeSelect.value);

  // Title
  mainChartTitle.textContent = `Global ${label} Trends`;
  mainChartInfo.textContent = `Selected countries • ${start}–${end}`;

  // Fetch series via registry
  let series;
  try {
    const adapter = Registry[source];
    if (!adapter) throw new Error(`Unknown source adapter: ${source}`);
    series = await adapter.fetchSeries({ indicatorCode: code, countries, startYear: start, endYear: end });

    // If placeholder
    if (series?._pending) {
      writeSource(mainChartSrc, `${adapter.label} (connect API)`, '', '');
      renderPlaceholderCharts(label, adapter.label, series._note);
      return;
    }
  } catch (e) {
    console.error(e);
    writeSource(mainChartSrc, 'Data source error', '', '');
    renderErrorCharts(`Could not load ${label}.`);
    return;
  }

  // Prepare datasets for main trend chart
  const mainCtx = document.getElementById('mainTrendChart').getContext('2d');
  const datasets = countries.map(iso2 => {
    const s = series[iso2];
    const points = s?.points || [];
    return {
      label: iso2,
      data: buildDataset(iso2, points),
      borderWidth: 2,
      tension: showTrends.checked ? 0.3 : 0,  // trend line smoothing toggle
      fill: false,
      pointRadius: 0
    };
  });

  // Compute lastUpdated union + write source line
  const latestUpdated = countries
    .map(c => series[c]?.lastUpdated)
    .filter(Boolean)
    .sort()
    .pop() || '';
  const sourceLabel = countries.map(c => series[c]?.source).filter(Boolean)[0] || Registry[source].label;
  const sourceUrl   = countries.map(c => series[c]?.sourceUrl).filter(Boolean)[0] || '';
  writeSource(mainChartSrc, sourceLabel, sourceUrl, latestUpdated);

  // Build main chart
  ensureChart(mainCtx, {
    type: chartKind === 'scatter' ? 'scatter' : chartKind,
    data: { datasets },
    options: {
      responsive: true,
      parsing: false,
      scales: {
        x: { type: 'time', time: { unit: 'year' } },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            title: (items) => {
              const d = items?.[0]?.parsed?.x;
              return d ? new Date(d).getFullYear().toString() : '';
            },
            label: (item) => `${item.dataset.label}: ${fmt.number(item.parsed.y)}`
          }
        }
      }
    }
  });

  // Secondary charts (reuse same data for quick comparisons)
  renderComparison(series, countries, label, sourceLabel, latestUpdated);
  renderRegional(series, countries, label, sourceLabel, latestUpdated);
  renderTrade(series, countries, label, sourceLabel, latestUpdated);
  renderDevelopment(series, countries, label, sourceLabel, latestUpdated);

  // Insights (simple examples)
  computeAndFillInsights(series, countries);
}

/* ==============================
   Secondary charts
============================== */
function pickLatestValue(points) {
  if (!points?.length) return null;
  return points[points.length - 1]; // last chronologically (we sort asc)
}

function renderComparison(series, countries, label, sourceLabel, lastUpdated) {
  const ctx = document.getElementById('comparisonChart').getContext('2d');
  const rows = countries.map(c => {
    const p = pickLatestValue(series[c]?.points);
    return { country: c, value: p ? p.value : null };
  }).filter(r => r.value != null);

  const data = {
    labels: rows.map(r => r.country),
    datasets: [{ label: `Latest ${label}`, data: rows.map(r => r.value) }]
  };

  ensureChart(ctx, {
    type: 'bar',
    data,
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
  writeSource(comparisonSourceEl, sourceLabel, '', lastUpdated);
}

function renderRegional(series, countries, label, sourceLabel, lastUpdated) {
  // Simple “region” placeholder: compute average of selected countries as “region”
  // You can replace this with a real region mapping later without UI changes.
  const ctx = document.getElementById('regionalChart').getContext('2d');
  const avgs = [];
  for (const c of countries) {
    const arr = series[c]?.points?.map(p => p.value) || [];
    if (arr.length) avgs.push(arr.reduce((a,b)=>a+b,0)/arr.length);
  }
  const pseudoRegionAvg = avgs.length ? (avgs.reduce((a,b)=>a+b,0)/avgs.length) : null;

  ensureChart(ctx, {
    type: 'radar',
    data: {
      labels: ['Pseudo-Region Avg'],
      datasets: [{ label: `Regional avg of selected (${label})`, data: [pseudoRegionAvg ?? 0] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
  writeSource(regionalSourceEl, sourceLabel, '', lastUpdated);
}

function renderTrade(series, countries, label, sourceLabel, lastUpdated) {
  const ctx = document.getElementById('tradeChart').getContext('2d');
  // If current indicator is already trade-balance, reuse; else compute simple export-import if available
  // For simplicity we mirror comparison chart’s latest values
  const rows = countries.map(c => {
    const p = pickLatestValue(series[c]?.points);
    return { country: c, value: p ? p.value : null };
  }).filter(r => r.value != null);

  ensureChart(ctx, {
    type: 'bar',
    data: {
      labels: rows.map(r => r.country),
      datasets: [{ label: `Latest ${label}`, data: rows.map(r => r.value) }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
  writeSource(tradeSourceEl, sourceLabel, '', lastUpdated);
}

function renderDevelopment(series, countries, label, sourceLabel, lastUpdated) {
  const ctx = document.getElementById('developmentChart').getContext('2d');
  // Show last available value by country as a scatter to suggest progress
  const pts = countries.map(c => {
    const p = pickLatestValue(series[c]?.points);
    return p ? { x: new Date(`${p.year}-01-01`), y: p.value, label: c } : null;
  }).filter(Boolean);

  ensureChart(ctx, {
    type: 'scatter',
    data: { datasets: [{ label: `Latest ${label}`, data: pts }] },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: { x: { type: 'time', time: { unit: 'year' } } }
    }
  });
  writeSource(devSourceEl, sourceLabel, '', lastUpdated);
}

/* ==============================
   Insights fillers (simple)
============================== */
function computeAndFillInsights(series, countries) {
  const best = { c: null, v: -Infinity };
  let sum = 0, n = 0;

  for (const c of countries) {
    const last = pickLatestValue(series[c]?.points);
    if (last) {
      if (last.value > best.v) { best.c = c; best.v = last.value; }
      sum += last.value; n++;
    }
  }
  const avg = n ? sum / n : null;

  const bestEl = $('#best-performer');
  const avgEl  = $('#average-growth');
  const trendEl = $('#trend-direction');

  if (bestEl) bestEl.textContent = best.c ? `${best.c} ${fmt.number(best.v)}` : '—';
  if (avgEl)  avgEl.textContent  = avg != null ? fmt.number(avg) : '—';
  if (trendEl) trendEl.textContent = '—'; // placeholder; add slope calc later if desired
}

/* ==============================
   Placeholder & error renderers
============================== */
function renderPlaceholderCharts(label, sourceName, note) {
  const msg = `${label}: ${sourceName} connection pending. ${note || ''}`;
  [ 'mainTrendChart', 'comparisonChart', 'regionalChart', 'tradeChart', 'developmentChart' ]
    .forEach(id => {
      const ctx = document.getElementById(id).getContext('2d');
      ensureChart(ctx, {
        type: 'bar',
        data: { labels: [label], datasets: [{ label: 'Pending', data: [0] }] },
        options: { plugins: { legend: { display: false }, title: { display: true, text: msg } } }
      });
    });
}

function renderErrorCharts(msg) {
  [ 'mainTrendChart', 'comparisonChart', 'regionalChart', 'tradeChart', 'developmentChart' ]
    .forEach(id => {
      const ctx = document.getElementById(id).getContext('2d');
      ensureChart(ctx, {
        type: 'bar',
        data: { labels: ['Error'], datasets: [{ label: 'Error', data: [0] }] },
        options: { plugins: { legend: { display: false }, title: { display: true, text: msg } } }
      });
    });
}

/* ==============================
   Export buttons (CSV / JSON / images)
============================== */
function currentIndicatorSnapshot() {
  const { start, end } = parseTimeRange(timeRangeSelect.value);
  const { source, code, label } = resolveIndicator();
  const countries = getSelectedCountries();
  return { start, end, source, code, label, countries, when: new Date().toISOString() };
}

function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'global_analytics.json';
  a.href = url; a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(rows) {
  const header = Object.keys(rows[0] || { country:'', year:'', value:'' }).join(',');
  const csv = [header, ...rows.map(r => [r.country, r.year, r.value].join(','))].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'global_analytics.csv';
  a.href = url; a.click();
  URL.revokeObjectURL(url);
}

async function gatherFlatRows() {
  const { start, end } = parseTimeRange(timeRangeSelect.value);
  const { source, code } = resolveIndicator();
  const countries = getSelectedCountries();
  const adapter = Registry[source];
  if (!adapter) return [];
  const series = await adapter.fetchSeries({ indicatorCode: code, countries, startYear: start, endYear: end });
  const out = [];
  for (const c of countries) {
    (series[c]?.points || []).forEach(p => out.push({ country: c, year: p.year, value: p.value }));
  }
  return out;
}

$('#export-json')?.addEventListener('click', async () => {
  const snap = currentIndicatorSnapshot();
  const rows = await gatherFlatRows();
  exportJSON({ meta: snap, rows });
});

$('#export-csv')?.addEventListener('click', async () => {
  const rows = await gatherFlatRows();
  exportCSV(rows);
});

$('#export-charts')?.addEventListener('click', () => {
  // Save main chart as PNG
  const c = document.getElementById('mainTrendChart');
  const a = document.createElement('a');
  a.download = 'main_chart.png';
  a.href = c.toDataURL('image/png');
  a.click();
});

/* ==============================
   Events
============================== */
btnUpdate?.addEventListener('click', loadAndRender);
[indicatorSelect, timeRangeSelect, chartTypeSelect, countrySelect]?.forEach(el => {
  el?.addEventListener('change', () => loadAndRender());
});
showTrends?.addEventListener('change', () => loadAndRender());
showForecasts?.addEventListener('change', () => {
  // Forecasting can be added (ARIMA client-side or serverless); for now no-op
  loadAndRender();
});

/* ==============================
   Initial render
============================== */
document.addEventListener('DOMContentLoaded', () => {
  // Kick off with the defaults visible on your page
  loadAndRender();
});

/* ==============================
   Notes on advanced sources (quick how-to)
   - IMF SDMX (IFS/WEO): add your endpoint + series code in Registry.imf.fetchSeries
   - WHO GHO: use https://ghoapi.azureedge.net/ghoapi/api/Indicator?$filter=IndicatorCode eq 'UHC_SER_1'
   - FAOSTAT: https://fenixservices.fao.org/faostat/api/v1/en/… (requires exact domain + params)
   - UNDP HDI: hosted files/API; a small serverless proxy may be required to align country codes
   - UN Comtrade: https://comtradeapi.un.org/ (register free key; respect rate limits)
   This file is design-safe: you can enhance adapters later without touching HTML/CSS.
============================== */
