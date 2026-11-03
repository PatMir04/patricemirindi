/* Knowledge-based site assistant (EN/FR).
 * Answers from /data/knowledge.json, which tools/build_site_content.py regenerates from
 * articles, projects, skills, experience and content/faq.json — so every new article
 * extends what it can answer. Runs entirely in the browser: no API, no cost, no tracking.
 */
(function () {
  'use strict';
  if (window.__kcLoaded) return;
  window.__kcLoaded = true;

  var KB_URL = '/data/knowledge.json';
  var pageLang = (document.documentElement.lang || 'en').slice(0, 2) === 'fr' ? 'fr' : 'en';

  var T = {
    en: {
      open: 'Ask about my work', title: 'Ask about Patrice’s work', close: 'Close assistant',
      placeholder: 'Ask a question…', send: 'Send', loading: 'Loading what I know…',
      hello: 'Hi! I can answer questions about Patrice’s services, projects, skills and articles — and share code tips from his articles. What would you like to know?',
      none: 'I couldn’t find that on this site. You could try one of the suggestions below, or ask Patrice directly.',
      read: 'Read more', related: 'Related pages', contact: 'Contact Patrice',
      error: 'Sorry — I couldn’t load my knowledge right now. You can still reach Patrice through the Contact page.',
      chips: ['What services do you offer?', 'SQL tip: remove duplicates', 'Show me recent articles', 'How can I contact you?'],
      note: 'Answers come from this site’s pages and articles.'
    },
    fr: {
      open: 'Poser une question', title: 'Questions sur le travail de Patrice', close: 'Fermer l’assistant',
      placeholder: 'Posez votre question…', send: 'Envoyer', loading: 'Chargement…',
      hello: 'Bonjour ! Je peux répondre à vos questions sur les services, projets, compétences et articles de Patrice, et partager des astuces de code tirées de ses articles. Que souhaitez-vous savoir ?',
      none: 'Je n’ai pas trouvé cette information sur le site. Essayez une des suggestions ci-dessous ou écrivez directement à Patrice.',
      read: 'En savoir plus', related: 'Pages liées', contact: 'Contacter Patrice',
      error: 'Désolé, je n’arrive pas à charger mes informations. Vous pouvez joindre Patrice par la page Contact.',
      chips: ['Quels services offrez-vous ?', 'Astuce SQL : dédoublonner', 'Articles récents', 'Comment vous joindre ?'],
      note: 'Les réponses proviennent des pages et articles du site.'
    }
  };

  var STOP = new Set(('a an and are as at be by can do does for from has have he his how i in is it its me my of on or our ' +
    'tell that the their this to was we what when where which who why will with you your about any there some show ' +
    'le la les un une des de du et est en au aux pour par sur dans que qui quoi quel quelle quels quelles ce ces cette ' +
    'il elle ils vous nous je mon ma mes son sa ses leur leurs pas plus avec comment où est-ce y a-t-il votre vos patrice').split(' '));
  var FR_HINT = /\b(le|la|les|des|est|pour|vous|quels?|quelles?|comment|où|êtes|avez|travaillez|bonjour|merci)\b|[àâçéèêëîïôûùüÿœ]/i;

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function tokens(s) {
    return norm(s).split(/[^a-z0-9+#.]+/).filter(function (t) { return t.length > 1 && !STOP.has(t); })
      .map(function (t) { return t.replace(/\.$/, '').replace(/(ies)$/, 'y').replace(/([^s])s$/, '$1'); });
  }

  // ---------- BM25 index ----------
  var kb = null, index = null;
  function buildIndex(docs) {
    var df = {}, total = 0;
    var rows = docs.map(function (d) {
      var tf = {};
      var all = tokens(d.text).concat(tokens(d.title), tokens(d.title), tokens((d.tags || []).join(' ')), tokens((d.tags || []).join(' ')), tokens(d.code || ''));
      all.forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });
      Object.keys(tf).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
      total += all.length;
      return { doc: d, tf: tf, len: all.length };
    });
    return { rows: rows, df: df, N: rows.length, avg: total / Math.max(rows.length, 1) };
  }
  function search(q, lang, onlyType) {
    var qt = tokens(q);
    if (!qt.length) return [];
    var k1 = 1.4, b = 0.75;
    return index.rows.map(function (r) {
      if (onlyType && r.doc.type !== onlyType) return { doc: r.doc, score: 0 };
      var s = 0;
      qt.forEach(function (t) {
        var f = r.tf[t];
        if (!f) return;
        var idf = Math.log(1 + (index.N - index.df[t] + 0.5) / (index.df[t] + 0.5));
        s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * r.len / index.avg));
      });
      if (s && r.doc.lang === lang) s *= 1.35;
      if (s && r.doc.type === 'faq') s *= 1.2;
      return { doc: r.doc, score: s };
    }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
  }
  function bestSentences(text, q, n) {
    var qt = new Set(tokens(q));
    var sents = text.match(/[^.!?]+[.!?]+/g) || [text];
    var scored = sents.map(function (s, i) {
      var hit = tokens(s).filter(function (t) { return qt.has(t); }).length;
      return { s: s.trim(), i: i, hit: hit };
    });
    var top = scored.slice().sort(function (a, b) { return b.hit - a.hit || a.i - b.i; }).slice(0, n)
      .sort(function (a, b) { return a.i - b.i; });
    return top.map(function (x) { return x.s; }).join(' ');
  }

  // ---------- intents ----------
  var CODE_RE = /```|traceback|exception|error:|syntaxerror|stack trace|\bdebug|\bbug\b|my code|mon code|\bselect\s.+\sfrom\b|\bdef\s\w+\(|=>|\bdax\b.*(measure|formula)|\bfix (this|my)\b/i;
  var HOWTO_RE = /\b(sql|t-sql|tsql|python|pandas|pyspark|spark|dax|power query|m code|excel|vba|r code|dplyr|query|snippet|code|fabric|lakehouse|notebook|window function|row_number|join|pivot|deduplicat|duplicate|running total|cumul|lag|rank)\b/i;
  var DOING_RE = /\b(how|write|example|snippet|code|query|tip|tips|syntax|calculate|compute|remove|keep|rank|compare|dedup\w*|deduplicat\w*|filter|join|pivot|comment|exemple|astuce|requ[eê]te|[eé]crire|calculer|supprimer|d[eé]doublonner|classer)\b/i;
  var ROLE_RE = /\b(work for|employer|employed|who.*(work|employ)|current (job|role|position|employer)|day job|pour qui|employeur|poste actuel|emploi actuel)\b/i;
  var HELLO_RE = /^\s*(hi|hello|hey|bonjour|salut|allo|good (morning|afternoon|evening))\b[\s!.?]*$/i;
  var ARTICLES_RE = /\b(article|articles|blog|insight|insights|post|posts|analyse|analyses|recent|récent)/i;

  function answer(q) {
    var lang = FR_HINT.test(q) ? 'fr' : (/[a-z]/i.test(q) ? (pageLang === 'fr' && !/\b(the|what|how|you)\b/i.test(q) ? 'fr' : 'en') : pageLang);
    var t = T[lang];
    if (HELLO_RE.test(q)) return { lang: lang, text: t.hello };
    if (ROLE_RE.test(q)) {
      var role = kb.docs.filter(function (x) { return x.type === 'faq' && x.lang === lang && /(current role|poste actuel)/i.test(x.title); })[0];
      if (role) return { lang: lang, text: role.text, links: [{ title: pageName(role.url, lang), url: role.url }] };
    }
    if ((HOWTO_RE.test(q) && DOING_RE.test(q)) || CODE_RE.test(q)) {
      var sn = search(q, lang, 'snippet');
      if (sn.length && sn[0].score >= 2.5) {
        var d = sn[0].doc;
        return { lang: lang, text: d.text, code: d.code, codeLang: d.codeLang,
          links: [{ title: (lang === 'fr' ? 'Article complet : ' : 'Full article: ') + d.title.split(' — ')[0], url: d.url }] };
      }
      if (CODE_RE.test(q)) {
        var faqCode = kb.docs.filter(function (x) { return x.type === 'faq' && /code/.test(norm(x.title)) && x.lang === lang; })[0];
        if (faqCode) return { lang: lang, text: faqCode.text, links: [{ title: t.contact, url: '/contact.html' }] };
      }
    }
    if (ARTICLES_RE.test(q) && tokens(q).length <= 3) {
      var seen = {}, arts = kb.docs.filter(function (d) {
        if (d.type !== 'article' || d.lang !== lang || seen[d.url]) return false;
        seen[d.url] = 1; return true;
      }).slice(0, 4);
      if (arts.length) {
        return { lang: lang, text: lang === 'fr' ? 'Voici les articles les plus récents :' : 'Here are the latest articles:',
          links: arts.map(function (d) { return { title: d.title, url: d.url }; }) };
      }
    }
    var hits = search(q, lang);
    if (!hits.length || hits[0].score < 2.2) {
      return { lang: lang, text: t.none, links: [{ title: t.contact, url: '/contact.html' }], chips: true };
    }
    var top = hits[0].doc;
    if (top.type === 'snippet') {
      return { lang: lang, text: top.text, code: top.code, codeLang: top.codeLang, links: [{ title: top.title.split(' — ')[0], url: top.url }] };
    }
    var text = top.type === 'faq' ? top.text : bestSentences(top.text, q, 2);
    var links = [], urls = {};
    hits.slice(0, 6).forEach(function (h) {
      if (links.length < 3 && !urls[h.doc.url] && h.score > hits[0].score * 0.5) {
        urls[h.doc.url] = 1;
        links.push({ title: h.doc.type === 'faq' ? pageName(h.doc.url, lang) : h.doc.title, url: h.doc.url });
      }
    });
    return { lang: lang, text: text, links: links };
  }
  function pageName(url, lang) {
    var en = { '/contact.html': 'Contact', '/about.html': 'About', '/key-projects.html': 'Projects',
      '/skills-expertise.html': 'Skills & expertise', '/work-experience.html': 'Work experience',
      '/data-analytics.html': 'Development dashboard', '/blog.html': 'Insights' };
    var fr = { '/contact.html': 'Contact', '/about.html': 'À propos', '/key-projects.html': 'Projets',
      '/skills-expertise.html': 'Compétences', '/work-experience.html': 'Parcours',
      '/data-analytics.html': 'Tableau de bord', '/blog.html': 'Analyses' };
    return (lang === 'fr' ? fr : en)[url] || url;
  }

  // ---------- UI ----------
  var css = '' +
    '.kc-btn{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;align-items:center;gap:10px;background:#FF7A1A;color:#0B1B33;border:0;border-radius:999px;padding:14px 20px;font:700 15px/1 "Avenir Next",Avenir,"Nunito Sans",system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.35);min-height:48px}' +
    '.kc-btn:hover{background:#FFA25E}.kc-btn svg{flex-shrink:0}' +
    '.kc-panel{position:fixed;right:20px;bottom:84px;z-index:10000;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 120px));display:flex;flex-direction:column;background:#0B1B33;color:#CBD5E1;border:1px solid #1E3A63;border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.5);font:15px/1.5 "Avenir Next",Avenir,"Nunito Sans",system-ui,sans-serif;overflow:hidden}' +
    '.kc-panel[hidden]{display:none}.kc-panel,.kc-panel *{box-sizing:border-box}.kc-panel{padding:0;margin:0}' +
    '.kc-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #1E3A63;background:#12284A}' +
    '.kc-head h2{margin:0;font-size:15px;line-height:1.3;letter-spacing:0;color:#F1F5F9;font-weight:700}.kc-head p{margin:2px 0 0;font-size:12px;color:#94A3B8}' +
    '.kc-x{background:none;border:0;color:#CBD5E1;cursor:pointer;width:40px;height:40px;border-radius:10px;font-size:22px;line-height:1}.kc-x:hover{background:#183259;color:#fff}' +
    '.kc-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}' +
    '.kc-msg{max-width:88%;padding:10px 14px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}' +
    '.kc-bot{background:#12284A;border:1px solid #1E3A63;align-self:flex-start;color:#E2E8F0}' +
    '.kc-me{background:#FF7A1A;color:#0B1B33;align-self:flex-end;font-weight:600}' +
    '.kc-links{margin:8px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}.kc-links a{color:#FF9445;text-decoration:none;font-weight:600}.kc-links a:hover{text-decoration:underline}' +
    '.kc-code{margin:10px 0 6px;padding:10px;background:#081428;border:1px solid #1E3A63;border-radius:10px;overflow-x:auto;font:12.5px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#E2E8F0;white-space:pre}' +
    '.kc-copy{background:transparent;border:1px solid #1E3A63;color:#CBD5E1;border-radius:8px;padding:6px 10px;font:inherit;font-size:12px;cursor:pointer}.kc-copy:hover{border-color:#FF7A1A;color:#fff}' +
    '.kc-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px}.kc-chip{background:transparent;color:#CBD5E1;border:1px solid #1E3A63;border-radius:999px;padding:8px 12px;font:inherit;font-size:13px;cursor:pointer;min-height:36px}.kc-chip:hover{border-color:#FF7A1A;color:#fff}' +
    '.kc-form{display:flex;gap:8px;padding:12px;border-top:1px solid #1E3A63;background:#0E2240}' +
    '.kc-form input{flex:1;min-width:0;background:#0B1B33;border:1px solid #1E3A63;border-radius:12px;color:#F1F5F9;padding:12px;font:inherit}.kc-form input::placeholder{color:#94A3B8}' +
    '.kc-form button{background:#FF7A1A;color:#0B1B33;border:0;border-radius:12px;padding:0 16px;font:inherit;font-weight:700;cursor:pointer;min-height:44px}' +
    '@media (max-width:480px){.kc-btn span{display:none}.kc-btn{padding:14px}}' +
    '@media print{.kc-btn,.kc-panel{display:none!important}}';

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text) e.textContent = text;
    return e;
  }

  function init() {
    var t = T[pageLang];
    var style = el('style'); style.textContent = css; document.head.appendChild(style);

    var btn = el('button', { type: 'button', class: 'kc-btn', 'aria-expanded': 'false', 'aria-controls': 'kc-panel' });
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    btn.appendChild(el('span', {}, t.open));

    var panel = el('div', { id: 'kc-panel', class: 'kc-panel', role: 'dialog', 'aria-label': t.title, hidden: '' });
    var head = el('div', { class: 'kc-head' });
    var hd = el('div'); hd.appendChild(el('h2', {}, t.title)); hd.appendChild(el('p', {}, t.note));
    var x = el('button', { type: 'button', class: 'kc-x', 'aria-label': t.close }, '×');
    head.appendChild(hd); head.appendChild(x);
    var log = el('div', { class: 'kc-log', 'aria-live': 'polite' });
    var chips = el('div', { class: 'kc-chips' });
    var form = el('form', { class: 'kc-form' });
    var input = el('input', { type: 'text', 'aria-label': t.placeholder, placeholder: t.placeholder, maxlength: '300', autocomplete: 'off' });
    var send = el('button', { type: 'submit' }, t.send);
    form.appendChild(input); form.appendChild(send);
    panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form);
    document.body.appendChild(panel); document.body.appendChild(btn);

    function say(who, text, links, code) {
      var m = el('div', { class: 'kc-msg ' + (who === 'me' ? 'kc-me' : 'kc-bot') }, text);
      if (code) {
        var pre = el('pre', { class: 'kc-code' }); pre.appendChild(el('code', {}, code)); m.appendChild(pre);
        var cp = el('button', { type: 'button', class: 'kc-copy' }, pageLang === 'fr' ? 'Copier le code' : 'Copy code');
        cp.onclick = function () { if (navigator.clipboard) navigator.clipboard.writeText(code).then(function () { cp.textContent = '✓'; }); };
        m.appendChild(cp);
      }
      if (links && links.length) {
        var ul = el('ul', { class: 'kc-links' });
        links.forEach(function (l) { var li = el('li'); li.appendChild(el('a', { href: l.url }, '→ ' + l.title)); ul.appendChild(li); });
        m.appendChild(ul);
      }
      log.appendChild(m); log.scrollTop = log.scrollHeight;
    }
    function showChips(lang) {
      chips.innerHTML = '';
      T[lang].chips.forEach(function (c) {
        var b = el('button', { type: 'button', class: 'kc-chip' }, c);
        b.onclick = function () { ask(c); };
        chips.appendChild(b);
      });
    }
    function load() {
      if (kb) return Promise.resolve();
      return fetch(KB_URL).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) { kb = d; index = buildIndex(d.docs || []); });
    }
    function ask(q) {
      q = (q || '').trim();
      if (!q) return;
      say('me', q);
      input.value = '';
      chips.innerHTML = '';
      load().then(function () {
        var a = answer(q);
        say('bot', a.text, a.links, a.code);
        if (a.chips) showChips(a.lang);
      }).catch(function () { say('bot', t.error, [{ title: t.contact, url: '/contact.html' }]); });
    }
    var opened = false;
    function open() {
      panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
      if (!opened) { opened = true; say('bot', t.hello); showChips(pageLang); load().catch(function () {}); }
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    btn.onclick = function () { panel.hidden ? open() : close(); };
    x.onclick = close;
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    form.onsubmit = function (e) { e.preventDefault(); ask(input.value); };

    // Exposed for automated tests
    window.KnowledgeChat = { ask: function (q) { return load().then(function () { return answer(q); }); }, open: open };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
