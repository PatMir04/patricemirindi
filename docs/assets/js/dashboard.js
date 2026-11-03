/* Development indicators dashboard — live World Bank data.
 * Pick an indicator, countries and years; see a trend chart, the latest values ranked,
 * a data table, and download the exact data as CSV. State is kept in the URL so any view
 * can be shared. Data: World Bank Indicators API v2 (api.worldbank.org), fetched in the browser.
 */
(function () {
  'use strict';

  var API = 'https://api.worldbank.org/v2/country/';
  var MAX_COUNTRIES = 10;
  var FIRST_YEAR = 1990;
  var THIS_YEAR = new Date().getFullYear();

  var INDICATORS = [
    { group: 'Economy', items: [
      ['NY.GDP.MKTP.KD.ZG', 'GDP growth (annual %)', '%'],
      ['NY.GDP.PCAP.CD', 'GDP per capita (current US$)', 'US$'],
      ['FP.CPI.TOTL.ZG', 'Inflation, consumer prices (annual %)', '%'],
      ['NE.EXP.GNFS.ZS', 'Exports of goods and services (% of GDP)', '% of GDP'],
      ['SL.UEM.TOTL.ZS', 'Unemployment (% of labour force, ILO estimate)', '%']] },
    { group: 'Agriculture & food', items: [
      ['NV.AGR.TOTL.ZS', 'Agriculture, forestry and fishing, value added (% of GDP)', '% of GDP'],
      ['SL.AGR.EMPL.ZS', 'Employment in agriculture (% of total employment)', '%'],
      ['AG.YLD.CREL.KG', 'Cereal yield (kg per hectare)', 'kg/ha']] },
    { group: 'People & inclusion', items: [
      ['SI.POV.DDAY', 'Poverty headcount at the international poverty line (% of population)', '%'],
      ['FX.OWN.TOTL.ZS', 'Account ownership (% of population ages 15+)', '%'],
      ['SP.DYN.LE00.IN', 'Life expectancy at birth (years)', 'years'],
      ['SP.POP.TOTL', 'Population, total', 'people']] },
    { group: 'Infrastructure & environment', items: [
      ['EG.ELC.ACCS.ZS', 'Access to electricity (% of population)', '%'],
      ['IT.NET.USER.ZS', 'Individuals using the Internet (% of population)', '%'],
      ['EN.GHG.CO2.MT.CE.AR5', 'CO2 emissions excluding LULUCF (Mt CO2e)', 'Mt CO2e']] }
  ];

  var COUNTRIES = [
    ['WLD', 'World', 'Aggregates'], ['SSF', 'Sub-Saharan Africa', 'Aggregates'], ['LMC', 'Lower middle income', 'Aggregates'],
    ['BFA', 'Burkina Faso', 'West Africa'], ['BEN', 'Benin', 'West Africa'], ['CIV', "Côte d'Ivoire", 'West Africa'],
    ['GHA', 'Ghana', 'West Africa'], ['NGA', 'Nigeria', 'West Africa'], ['SEN', 'Senegal', 'West Africa'],
    ['MLI', 'Mali', 'West Africa'], ['NER', 'Niger', 'West Africa'], ['TGO', 'Togo', 'West Africa'],
    ['COD', 'DR Congo', 'Central & East Africa'], ['BDI', 'Burundi', 'Central & East Africa'], ['RWA', 'Rwanda', 'Central & East Africa'],
    ['KEN', 'Kenya', 'Central & East Africa'], ['UGA', 'Uganda', 'Central & East Africa'], ['TZA', 'Tanzania', 'Central & East Africa'],
    ['ETH', 'Ethiopia', 'Central & East Africa'], ['CMR', 'Cameroon', 'Central & East Africa'],
    ['ZAF', 'South Africa', 'Southern & North Africa'], ['MAR', 'Morocco', 'Southern & North Africa'], ['EGY', 'Egypt', 'Southern & North Africa'],
    ['CAN', 'Canada', 'Other'], ['USA', 'United States', 'Other'], ['FRA', 'France', 'Other'], ['GBR', 'United Kingdom', 'Other'],
    ['DEU', 'Germany', 'Other'], ['NLD', 'Netherlands', 'Other'], ['IND', 'India', 'Other'], ['BRA', 'Brazil', 'Other'], ['CHN', 'China', 'Other']
  ];
  var PRESETS = {
    worked: { label: "Where I've worked", codes: ['BFA', 'BEN', 'CIV', 'GHA', 'NGA', 'BDI', 'COD', 'CAN'] },
    west: { label: 'West Africa', codes: ['BFA', 'BEN', 'CIV', 'GHA', 'NGA', 'SEN', 'MLI', 'NER', 'TGO'] },
    east: { label: 'Central & East Africa', codes: ['COD', 'BDI', 'RWA', 'KEN', 'UGA', 'TZA', 'ETH'] },
    compare: { label: 'Africa vs world', codes: ['SSF', 'LMC', 'WLD'] }
  };
  var PALETTE = ['#FF7A1A', '#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA', '#22D3EE', '#F87171', '#E2E8F0', '#4ADE80'];

  var IND = {};
  INDICATORS.forEach(function (g) { g.items.forEach(function (i) { IND[i[0]] = { code: i[0], name: i[1], unit: i[2], group: g.group }; }); });
  var NAME = {};
  COUNTRIES.forEach(function (c) { NAME[c[0]] = c[1]; });

  var $ = function (id) { return document.getElementById(id); };
  var state = { indicator: 'NY.GDP.MKTP.KD.ZG', countries: ['BFA', 'BEN', 'CIV', 'GHA', 'CAN', 'WLD'], from: 2010, to: THIS_YEAR };
  var cache = {};
  var charts = {};
  var current = null; // { indicator, rows: [{country, year, value}], lastUpdated }

  // ---------- URL state ----------
  function readUrl() {
    var p = new URLSearchParams(location.search);
    if (p.get('i') && IND[p.get('i')]) state.indicator = p.get('i');
    if (p.get('c')) {
      var cs = p.get('c').split(',').filter(function (c) { return NAME[c]; }).slice(0, MAX_COUNTRIES);
      if (cs.length) state.countries = cs;
    }
    var f = parseInt(p.get('from'), 10), t = parseInt(p.get('to'), 10);
    if (f >= FIRST_YEAR && f <= THIS_YEAR) state.from = f;
    if (t >= FIRST_YEAR && t <= THIS_YEAR) state.to = t;
    if (state.from > state.to) { var x = state.from; state.from = state.to; state.to = x; }
  }
  function writeUrl() {
    var p = new URLSearchParams({ i: state.indicator, c: state.countries.join(','), from: state.from, to: state.to });
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  }

  // ---------- data ----------
  function fetchIndicator(code, countries) {
    var key = code + '|' + countries.slice().sort().join(';');
    if (cache[key]) return Promise.resolve(cache[key]);
    var url = API + countries.join(';') + '/indicator/' + code + '?format=json&per_page=20000&date=' + FIRST_YEAR + ':' + THIS_YEAR;
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) {
      if (!Array.isArray(d) || !Array.isArray(d[1])) {
        var msg = d && d[0] && d[0].message ? d[0].message[0].value : 'Unexpected response';
        throw new Error(msg);
      }
      var rows = d[1].filter(function (x) { return x.value !== null; }).map(function (x) {
        return { country: x.countryiso3code || x.country.id, name: x.country.value, year: +x.date, value: +x.value };
      });
      var out = { indicator: code, rows: rows, lastUpdated: d[0].lastupdated || null };
      cache[key] = out;
      return out;
    });
  }

  // ---------- formatting ----------
  function fmt(v, unit) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    var a = Math.abs(v);
    if (unit === 'people') return a >= 1e9 ? (v / 1e9).toFixed(2) + ' bn' : a >= 1e6 ? (v / 1e6).toFixed(1) + ' m' : Math.round(v).toLocaleString('en-CA');
    if (unit === 'US$') return '$' + Math.round(v).toLocaleString('en-CA');
    if (unit === 'kg/ha') return Math.round(v).toLocaleString('en-CA');
    return (a >= 100 ? v.toFixed(0) : v.toFixed(1));
  }

  // ---------- rendering ----------
  function setStatus(kind, text) {
    var s = $('dash-status');
    s.className = 'dash-status ' + (kind || '');
    s.textContent = text || '';
    s.hidden = !text;
    $('dash-results').setAttribute('aria-busy', kind === 'loading' ? 'true' : 'false');
  }

  function render() {
    if (!current) return;
    var ind = IND[current.indicator];
    var rows = current.rows.filter(function (r) { return r.year >= state.from && r.year <= state.to && state.countries.indexOf(r.country) > -1; });
    var years = [];
    for (var y = state.from; y <= state.to; y++) years.push(y);
    var byC = {};
    rows.forEach(function (r) { (byC[r.country] = byC[r.country] || {})[r.year] = r.value; });
    var withData = state.countries.filter(function (c) { return byC[c]; });
    var missing = state.countries.filter(function (c) { return !byC[c]; });

    // trim empty years at the end/start
    var used = years.filter(function (yr) { return withData.some(function (c) { return byC[c][yr] !== undefined; }); });
    if (used.length) years = years.filter(function (yr) { return yr >= used[0] && yr <= used[used.length - 1]; });

    $('chart-title').textContent = ind.name;
    $('rank-title').textContent = 'Latest available value';
    var src = 'Source: World Bank, World Development Indicators (' + ind.code + ')';
    if (current.lastUpdated) src += ' · updated ' + current.lastUpdated;
    $('dash-source').innerHTML = '';
    var a = document.createElement('a');
    a.href = 'https://data.worldbank.org/indicator/' + ind.code; a.target = '_blank'; a.rel = 'noopener'; a.textContent = src;
    $('dash-source').appendChild(a);

    var notes = [];
    if (missing.length) notes.push('No data in this period for: ' + missing.map(function (c) { return NAME[c] || c; }).join(', ') + '.');
    if (ind.code === 'SI.POV.DDAY' || ind.code === 'FX.OWN.TOTL.ZS') notes.push('This indicator comes from surveys run every few years, so the line connects survey years.');
    $('dash-notes').textContent = notes.join(' ');

    if (!withData.length) {
      setStatus('empty', 'No data for this selection. Try a wider year range or other countries.');
      ['trend', 'rank'].forEach(function (k) { if (charts[k]) { charts[k].destroy(); charts[k] = null; } });
      $('dash-table').innerHTML = '';
      return;
    }
    setStatus('', '');

    var datasets = withData.map(function (c, i) {
      var col = PALETTE[state.countries.indexOf(c) % PALETTE.length];
      return { label: NAME[c] || c, data: years.map(function (yr) { return byC[c][yr] === undefined ? null : byC[c][yr]; }),
        borderColor: col, backgroundColor: col, borderWidth: 2.5, pointRadius: years.length > 25 ? 0 : 3, pointHoverRadius: 6,
        spanGaps: true, tension: 0.25 };
    });
    var tick = { color: '#CBD5E1' }, grid = { color: 'rgba(203,213,225,0.12)' };
    var tooltip = { backgroundColor: '#12284A', borderColor: '#1E3A63', borderWidth: 1, titleColor: '#F1F5F9', bodyColor: '#E2E8F0',
      callbacks: { label: function (ctx) { return ' ' + ctx.dataset.label + ': ' + fmt(ctx.parsed.y !== undefined ? ctx.parsed.y : ctx.parsed.x, ind.unit) + ' ' + (ind.unit === 'US$' || ind.unit === 'people' ? '' : ind.unit); } } };

    if (charts.trend) charts.trend.destroy();
    charts.trend = new Chart($('trend-chart'), {
      type: 'line', data: { labels: years, datasets: datasets },
      options: { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'bottom', labels: { color: '#E2E8F0', usePointStyle: true, boxWidth: 8, padding: 16 } }, tooltip: tooltip },
        scales: { x: { ticks: tick, grid: { display: false } },
          y: { ticks: { color: '#CBD5E1', callback: function (v) { return fmt(v, ind.unit); } }, grid: grid, title: { display: true, text: ind.unit, color: '#94A3B8' } } } }
    });

    var latest = withData.map(function (c) {
      var ys = Object.keys(byC[c]).map(Number).filter(function (yr) { return yr >= state.from && yr <= state.to; }).sort(function (a, b) { return b - a; });
      return { c: c, year: ys[0], value: byC[c][ys[0]] };
    }).sort(function (a, b) { return b.value - a.value; });
    if (charts.rank) charts.rank.destroy();
    charts.rank = new Chart($('rank-chart'), {
      type: 'bar',
      data: { labels: latest.map(function (l) { return (NAME[l.c] || l.c) + ' (' + l.year + ')'; }),
        datasets: [{ data: latest.map(function (l) { return l.value; }), backgroundColor: latest.map(function (l) { return PALETTE[state.countries.indexOf(l.c) % PALETTE.length]; }), borderRadius: 6 }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
        plugins: { legend: { display: false }, tooltip: tooltip },
        scales: { x: { ticks: { color: '#CBD5E1', callback: function (v) { return fmt(v, ind.unit); } }, grid: grid }, y: { ticks: tick, grid: { display: false } } } }
    });

    // table
    var t = '<table><caption class="sr-only">' + ind.name + '</caption><thead><tr><th scope="col">Year</th>' +
      withData.map(function (c) { return '<th scope="col">' + (NAME[c] || c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    years.slice().reverse().forEach(function (yr) {
      t += '<tr><th scope="row">' + yr + '</th>' + withData.map(function (c) { return '<td>' + fmt(byC[c][yr], ind.unit) + '</td>'; }).join('') + '</tr>';
    });
    $('dash-table').innerHTML = t + '</tbody></table>';
    current.view = { years: years, withData: withData, byC: byC };
  }

  function load() {
    writeUrl();
    syncControls();
    setStatus('loading', 'Loading World Bank data…');
    var req = state.countries.slice();
    return fetchIndicator(state.indicator, req).then(function (d) {
      current = { indicator: d.indicator, rows: d.rows, lastUpdated: d.lastUpdated };
      render();
    }).catch(function (e) {
      current = null;
      setStatus('error', 'Could not load data from the World Bank right now (' + e.message + ').');
      var b = document.createElement('button'); b.type = 'button'; b.className = 'dash-btn'; b.textContent = 'Try again';
      b.onclick = load; $('dash-status').appendChild(document.createTextNode(' ')); $('dash-status').appendChild(b);
    });
  }

  // ---------- controls ----------
  function buildControls() {
    var sel = $('indicator');
    INDICATORS.forEach(function (g) {
      var og = document.createElement('optgroup'); og.label = g.group;
      g.items.forEach(function (i) { var o = document.createElement('option'); o.value = i[0]; o.textContent = i[1]; og.appendChild(o); });
      sel.appendChild(og);
    });
    sel.onchange = function () { state.indicator = sel.value; load(); };

    ['from', 'to'].forEach(function (k) {
      var s = $('year-' + k);
      for (var y = THIS_YEAR; y >= FIRST_YEAR; y--) { var o = document.createElement('option'); o.value = y; o.textContent = y; s.appendChild(o); }
      s.onchange = function () {
        state[k] = +s.value;
        if (state.from > state.to) { if (k === 'from') state.to = state.from; else state.from = state.to; }
        writeUrl(); syncControls(); render();
      };
    });

    var list = $('country-list'), groups = {};
    COUNTRIES.forEach(function (c) {
      if (!groups[c[2]]) {
        var fs = document.createElement('div'); fs.className = 'country-group';
        var h = document.createElement('p'); h.className = 'country-group-title'; h.textContent = c[2];
        fs.appendChild(h); list.appendChild(fs); groups[c[2]] = fs;
      }
      var lab = document.createElement('label'); lab.className = 'country'; lab.dataset.name = c[1].toLowerCase();
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = c[0];
      cb.onchange = function () {
        if (cb.checked) {
          if (state.countries.length >= MAX_COUNTRIES) { cb.checked = false; flash('Up to ' + MAX_COUNTRIES + ' countries at a time keeps the chart readable.'); return; }
          state.countries.push(c[0]);
        } else {
          if (state.countries.length === 1) { cb.checked = true; flash('Keep at least one country selected.'); return; }
          state.countries = state.countries.filter(function (x) { return x !== c[0]; });
        }
        load();
      };
      lab.appendChild(cb); lab.appendChild(document.createTextNode(' ' + c[1]));
      groups[c[2]].appendChild(lab);
    });
    $('country-search').oninput = function () {
      var q = this.value.trim().toLowerCase();
      list.querySelectorAll('.country').forEach(function (l) { l.hidden = q && l.dataset.name.indexOf(q) === -1; });
    };

    var pre = $('presets');
    Object.keys(PRESETS).forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'dash-chip'; b.textContent = PRESETS[k].label;
      b.onclick = function () { state.countries = PRESETS[k].codes.slice(0, MAX_COUNTRIES); load(); };
      pre.appendChild(b);
    });

    $('download-csv').onclick = downloadCsv;
    $('copy-link').onclick = function () {
      var done = function () { flash('Link copied — it opens this exact view.'); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () { flash(location.href); });
      else flash(location.href);
    };
    $('reset').onclick = function () {
      state = { indicator: 'NY.GDP.MKTP.KD.ZG', countries: ['BFA', 'BEN', 'CIV', 'GHA', 'CAN', 'WLD'], from: 2010, to: THIS_YEAR };
      $('country-search').value = ''; $('country-search').oninput.call($('country-search'));
      load();
    };
  }

  function syncControls() {
    $('indicator').value = state.indicator;
    $('year-from').value = state.from; $('year-to').value = state.to;
    $('country-list').querySelectorAll('input').forEach(function (cb) { cb.checked = state.countries.indexOf(cb.value) > -1; });
    $('selected-count').textContent = state.countries.length + ' of ' + MAX_COUNTRIES + ' selected';
  }

  var flashTimer;
  function flash(msg) {
    var f = $('dash-flash'); f.textContent = msg; f.hidden = false;
    clearTimeout(flashTimer); flashTimer = setTimeout(function () { f.hidden = true; }, 4000);
  }

  function downloadCsv() {
    if (!current || !current.view) { flash('Nothing to download yet.'); return; }
    var ind = IND[current.indicator], v = current.view;
    var lines = [['country_code', 'country', 'year', 'indicator_code', 'indicator', 'value'].join(',')];
    v.withData.forEach(function (c) {
      v.years.forEach(function (yr) {
        var val = v.byC[c][yr];
        if (val !== undefined) lines.push([c, '"' + (NAME[c] || c).replace(/"/g, '""') + '"', yr, ind.code, '"' + ind.name.replace(/"/g, '""') + '"', val].join(','));
      });
    });
    lines.push('', '"Source: World Bank, World Development Indicators, https://data.worldbank.org/indicator/' + ind.code + '"');
    var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = ind.code + '_' + state.from + '-' + state.to + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function start() {
    if (!window.Chart) { setStatus('error', 'The charting library did not load. Please refresh the page.'); return; }
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    readUrl();
    buildControls();
    load();
    window.Dashboard = { state: function () { return JSON.parse(JSON.stringify(state)); }, reload: load };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
