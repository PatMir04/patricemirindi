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
      dash: 'The development dashboard tracks 15 World Bank indicators — growth, poverty, financial inclusion, internet use and more — for 32 countries and economies, with charts, a comparison table and downloads. The data is from the World Bank (World Development Indicators, updated 11 November 2026) and is re-checked weekly. For the latest headline figures, see the article “The world in numbers, late 2026”.',
      hire: 'Patrice works as a consultant: dashboards, data pipelines and impact analysis for public-sector, non-profit and development teams. Pricing depends on the project — the contact form asks for your budget range (from under $5k to $50k+), and a first 30-minute consultation is free.',
      book: 'You can book a free 30-minute consultation through the contact form. It asks about your project type, timeline and budget, and Patrice replies within 24 hours.',
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
      dash: 'Le tableau de bord du développement suit 15 indicateurs de la Banque mondiale — croissance, pauvreté, inclusion financière, usage d’internet et plus — pour 32 pays et économies, avec graphiques, tableau comparatif et téléchargements. Les données proviennent de la Banque mondiale (Indicateurs du développement dans le monde, mis à jour le 11 novembre 2026) et sont revérifiées chaque semaine. Pour les derniers chiffres clés, voyez l’article « Le monde en chiffres, fin 2026 ».',
      hire: 'Patrice travaille comme consultant : tableaux de bord, flux de données et analyses d’impact pour le secteur public, les organismes sans but lucratif et le développement international. Les tarifs dépendent du projet — le formulaire de contact demande votre fourchette de budget (de moins de 5 000 $ à 50 000 $ et plus), et une première consultation de 30 minutes est gratuite.',
      book: 'Vous pouvez réserver une consultation gratuite de 30 minutes via le formulaire de contact. Il pose des questions sur le type de projet, l’échéancier et le budget, et Patrice répond dans les 24 heures.',
      note: 'Les réponses proviennent des pages et articles du site.'
    }
  };

  var STOP = new Set(('a an and are as at be by can do does for from has have he his how i in is it its me my of on or our ' +
    'tell that the their this to was we what when where which who why will with you your about any there some show ' +
    'le la les un une des de du et est en au aux pour par sur dans que qui quoi quel quelle quels quelles ce ces cette ' +
    'il elle ils vous nous je mon ma mes son sa ses leur leurs pas plus avec comment où est-ce y a-t-il votre vos patrice').split(' '));
  var SYN = { powerbi: ['power', 'bi'], powerquery: ['power', 'query'], cv: ['experience', 'about'],
    resume: ['experience', 'about'], cout: ['service', 'contact'], prix: ['service', 'contact'],
    tarifs: ['service', 'contact'], tarif: ['service', 'contact'],
    job: ['experience'], career: ['experience'], work: ['experience'], parcours: ['experience'],
    ability: ['skill'], expertise: ['skill'], competence: ['skill'], realisation: ['project'] };
  function expand(qt) {
    var out = qt.slice();
    qt.forEach(function (tk) { (SYN[tk] || []).forEach(function (s) { if (out.indexOf(s) < 0) out.push(s); }); });
    return out;
  }
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
    var qt = expand(tokens(q));
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
  var DASHBOARD_RE = /\b(dashboard|tableau de bord|world bank|banque mondiale|indicators?|indicateurs?)\b/i;
  var BUILD_RE = /\b(power bi|fabric|excel|tableau software|build|building|create|make|cr[ée]er|construire)\b/i;
  var HIRE_RE = /\b(hire|hiring|engage|engager|embaucher|cost|costs|price|pricing|rates|fees|prix|tarifs?|co[ûu]t\w*)\b/i;
  var BOOKING_RE = /\b(book|booking|schedule|consultation|appointment|rendez-vous|r[ée]server|appel|rencontrer)\b/i;
  var NAME_RE = /\b(patric\w*|patris|mirindi|mirndi|miridi)\b/;
  var ABOUT_RE = /\b(who is patrice|who's patrice|tell me about patrice|about patrice|who are you|who is he|who's this (guy|person)|who is this (guy|person)|who (runs|owns|built|made) this site|(author|owner) of this site|tell me about the author|qui est patrice|qui est-il|c'est qui|parlez-moi de patrice|a propos de patrice|presentez?(-moi)? patrice)\b/;
  var ABOUT_SKILLS_RE = /\b(patrice's skills|skills of patrice|what are (his|patrice's) skills|competences de patrice|quelles sont (ses|les) competences|what (skills|abilities) (does|has)|que sait-il faire|savoir-faire)\b/;
  var ABOUT_EXP_RE = /\b(where (has|did) (he|patrice) work|patrice's (experience|career)|his (career|experience)|parcours de patrice|experience de patrice|ou (a-t-il|patrice a) travaille|que fait patrice|que fait-il|what does (patrice|he) do|do for a living|patrice's job|his job|son travail|son metier|metier de patrice|fait-il dans la vie)\b/;
  var ABOUT_EDU_RE = /\b(patrice's education|his education|education of patrice|formation de patrice|etudes de patrice|diplomes? de patrice|where did (he|patrice) study)\b/;
  var ABOUT_PROJ_RE = /\b(patrice's projects|his projects|projets de patrice)\b/;
  var LOC_RE = /\b(where (is|does) he (based|live)|base ou|ou (vit|habite)-t-il|ou est-il base|where is patrice based)\b/;
  var TESTI_RE = /\b(testimonials?|temoignages?|disent (les|ses) clients|clients? (say|disent)|avis (des )?clients|what do (clients|people) say)\b/;
  var ARTICLES_RE = /\b(article|articles|blog|insight|insights|post|posts|analyse|analyses|recent|récent)/i;

  // ---------- About Patrice: guided follow-up flow ----------
  var aboutState = null; // 'menu' | 'positions' | 'projects' — remembers one pending follow-up
  function expDocs() { return kb.docs.filter(function (d) { return d.type === 'experience'; }); }
  function projDocs() { return kb.docs.filter(function (d) { return d.type === 'project'; }).slice(0, 5); }
  function firstSentences(text, n) {
    var s = text.match(/[^.!?]+[.!?]+/g) || [text];
    return s.slice(0, n).map(function (x) { return x.trim(); }).join(' ');
  }
  function aboutMenu(lang, soft) {
    aboutState = 'menu';
    if (soft) {
      return { lang: lang, links: [{ title: pageName('/about.html', lang), url: '/about.html' }],
        text: lang === 'fr'
          ? 'Je peux vous parler de Patrice — son parcours personnel, son expérience, ses compétences, ses projets, ses services ou sa formation. Lequel vous intéresse ?\n1) Parcours personnel\n2) Expérience professionnelle\n3) Compétences\n4) Projets\n5) Services et consultation\n6) Formation et certifications\n\nRépondez par un numéro ou un mot-clé.'
          : 'I can tell you about Patrice — his background, experience, skills, projects, services or education. Which one?\n1) Personal background\n2) Professional experience\n3) Skills\n4) Projects\n5) Services & consulting\n6) Education & certifications\n\nReply with a number or a keyword.' };
    }
    var text = lang === 'fr'
      ? 'Patrice Mirindi est un analyste des systèmes de données, développeur et économiste du développement bilingue (FR/EN) basé à Ottawa, au Canada. Il transforme des données complexes en décisions concrètes — flux de données, tableaux de bord et analyses d\u2019impact pour le secteur public, les organismes sans but lucratif et le développement international.\n\nQue voulez-vous savoir sur lui ?\n1) Parcours personnel\n2) Expérience professionnelle\n3) Compétences\n4) Projets\n5) Services et consultation\n6) Formation et certifications\n\nRépondez par un numéro ou un mot-clé.'
      : 'Patrice Mirindi is a bilingual (EN/FR) data systems analyst, developer and development economist based in Ottawa, Canada. He turns complex data into decisions people act on — pipelines, dashboards and impact analysis for public-sector, non-profit and development teams.\n\nWhat would you like to know about him?\n1) Personal background\n2) Professional experience\n3) Skills\n4) Projects\n5) Services & consulting\n6) Education & certifications\n\nReply with a number or a keyword.';
    return { lang: lang, text: text, links: [{ title: pageName('/about.html', lang), url: '/about.html' }] };
  }
  function aboutTestimonials(lang) {
    aboutState = null;
    return { lang: lang, links: [{ title: lang === 'fr' ? 'Accueil — témoignages' : 'Home — testimonials', url: '/' }],
      text: lang === 'fr'
        ? 'Ce que disent les clients et collaborateurs : Tamara Flink (responsable de programme, CBI) a salué le soutien de Patrice en collecte, analyse et présentation de données pour son équipe de programme. Le site présente aussi les témoignages de Kerry Kyd, Melanie van der Baaren-Haga (CBI), Nikki Naiker (Economic Sense) et Rexford Akrong (Université de Nairobi) — voir la page d\u2019accueil.'
        : 'What clients and collaborators say: Tamara Flink (Programme Manager, CBI) praised Patrice\u2019s data collection, analysis and presentation support to her programme team. The site also carries testimonials from Kerry Kyd, Melanie van der Baaren-Haga (CBI), Nikki Naiker (Economic Sense) and Rexford Akrong (University of Nairobi) — see the home page.' };
  }
  function possCategory(nq) {
    if (!/\b(his|her|ses|son|sa)\b/.test(nq)) return null;
    if (/(skills?|competences?)/.test(nq)) return 'skills';
    if (/(projects?|projets?)/.test(nq)) return 'projects';
    if (/(experience|parcours|career)/.test(nq)) return 'professional';
    if (/(education|formation|certif)/.test(nq)) return 'education';
    if (/background/.test(nq)) return 'personal';
    if (/(services?|consult)/.test(nq)) return 'services';
    return null;
  }
  function nameComboCategory(nq) {
    if (/(skills?|competences?|expertise|abilit|savoir)/.test(nq)) return 'skills';
    if (/(projects?|projets?|realisations?)/.test(nq)) return 'projects';
    if (/(educat|formation|diplom|etudes|universit|certif)/.test(nq)) return 'education';
    if (/(experience|parcours|career|emplois?)/.test(nq)) return 'professional';
    if (/background/.test(nq)) return 'personal';
    if (/(services?|consult|tarifs?|prix|hire)/.test(nq)) return 'services';
    return null;
  }
  function aboutCategory(cat, lang) {
    var t = T[lang];
    aboutState = null;
    if (cat === 'personal') {
      return { lang: lang, links: [{ title: pageName('/about.html', lang), url: '/about.html' }],
        text: lang === 'fr'
          ? 'La biographie publique, en bref : Patrice Mirindi est basé à Ottawa, au Canada. Il travaille en français et en anglais (il parle aussi le swahili et le lingala) comme analyste des systèmes de données, développeur et économiste du développement. Il détient une maîtrise en économie agricole de l\u2019Université de Nairobi et la certification PMP. C\u2019est la biographie professionnelle publique — pour le reste, il faut le demander à Patrice lui-même.'
          : 'The public bio, in short: Patrice Mirindi is based in Ottawa, Canada. He works in English and French (he also speaks Swahili and Lingala) as a data systems analyst, developer and development economist. He holds an MSc in Agricultural Economics from the University of Nairobi and is PMP certified. That\u2019s the public professional bio — anything more personal, you\u2019d have to ask Patrice himself.' };
    }
    if (cat === 'professional') {
      aboutState = 'positions';
      var list = expDocs().map(function (d, i) {
        var title = d.title;
        if (!/,/.test(title)) title += lang === 'fr' ? ' — Ottawa (employeur non indiqué publiquement)' : ' — Ottawa (employer not listed publicly)';
        return (i + 1) + ') ' + title;
      }).join('\n');
      return { lang: lang, links: [{ title: pageName('/work-experience.html', lang), url: '/work-experience.html' }],
        text: (lang === 'fr'
          ? 'Patrice a travaillé dans des instituts de recherche, en consultation et dans des équipes de données d\u2019entreprise. Son poste actuel : analyste des systèmes de données à Ottawa (2026–présent) — son employeur n\u2019est pas indiqué publiquement ; auparavant, des rôles seniors en données et en consultation (résilience financière, développement des affaires, soutien aux entrepreneurs).\n\nSur quel poste ou organisation voulez-vous plus de détails ?'
          : 'Patrice has worked across research institutes, consulting and enterprise data teams. His current role is Data Systems Analyst in Ottawa (2026–present) — his employer isn\u2019t listed publicly; before that, senior data and consulting roles in financial resilience, business development and entrepreneur support.\n\nWhich position or organisation do you want more detail on?') + '\n' + list };
    }
    if (cat === 'skills') {
      return { lang: lang, links: [{ title: pageName('/skills-expertise.html', lang), url: '/skills-expertise.html' }],
        text: lang === 'fr'
          ? 'Les compétences centrales de Patrice, d\u2019après sa page Compétences : SQL, Power BI et Microsoft Fabric au centre ; ingénierie des données et flux (Azure Synapse, Synapse Link, Dataflows Gen2, modèles Direct Lake) ; Python & PySpark et R & Stata pour l\u2019analyse ; prévision et apprentissage automatique (tests A/B, détection d\u2019anomalies) ; gouvernance des données (Microsoft Purview, catalogage, standardisation des indicateurs) ; et la création d\u2019agents IA & LLM. Vous voulez du détail sur un domaine ? Demandez-moi son ingénierie des données, son travail BI/Fabric ou ses analyses.'
          : 'Patrice\u2019s core skills, from his Skills page: SQL, Power BI and Microsoft Fabric at the centre; data engineering and pipelines (Azure Synapse, Synapse Link, Dataflows Gen2, Direct Lake models); Python & PySpark and R & Stata for analysis; forecasting and machine learning (A/B testing, anomaly detection); data governance (Microsoft Purview, cataloguing, KPI standardisation); and building AI & LLM agents. Want depth on one area? Ask me about his data engineering, BI/Fabric, or analysis work.' };
    }
    if (cat === 'projects') {
      aboutState = 'projects';
      var plist = projDocs().map(function (d, i) { return (i + 1) + ') ' + d.title; }).join('\n');
      return { lang: lang, links: [{ title: pageName('/key-projects.html', lang), url: '/key-projects.html' }],
        text: (lang === 'fr'
          ? 'Quelques projets phares (la page Projets en présente davantage) :\n'
          : 'A few flagship projects (the Projects page has more):\n') + plist +
          (lang === 'fr' ? '\n\nSur quel projet voulez-vous plus de détails ? Répondez par un numéro ou un nom.' : '\n\nWhich project do you want more on? Reply with a number or a name.') };
    }
    if (cat === 'services') {
      return { lang: lang, text: t.hire, links: [{ title: t.contact, url: '/contact.html' }] };
    }
    // education
    return { lang: lang, links: [{ title: pageName('/about.html', lang), url: '/about.html' }],
      text: lang === 'fr'
        ? 'Formation et certifications : maîtrise (MSc) en économie agricole — Université de Nairobi. PMP (Project Management Professional), certifié 2024–2027. Il travaille en français et en anglais. Tous les détails sont sur la page À propos.'
        : 'Education & certifications: MSc in Agricultural Economics — University of Nairobi. PMP (Project Management Professional), certified 2024–2027. He also works bilingually in English and French. Full details are on the About page.' };
  }
  function aboutSelect(q, lang) {
    var nq = norm(q);
    var num = nq.match(/^\s*([1-6])\b/);
    if (aboutState === 'menu') {
      var cats = ['personal', 'professional', 'skills', 'projects', 'services', 'education'];
      if (num) return aboutCategory(cats[+num[1] - 1], lang);
      if (/\b(personal|background|personnel|parcours personnel|bio)\b/.test(nq)) return aboutCategory('personal', lang);
      if (/\b(profession\w*|experience|career|carriere|emplois?|parcours)\b/.test(nq)) return aboutCategory('professional', lang);
      if (/\b(skills?|competences?)\b/.test(nq)) return aboutCategory('skills', lang);
      if (/\b(projects?|projets?)\b/.test(nq)) return aboutCategory('projects', lang);
      if (/\b(services?|consult\w*|tarifs?|prix|hire)\b/.test(nq)) return aboutCategory('services', lang);
      if (/\b(educat\w*|certif\w*|formation|diplomes?|etudes)\b/.test(nq)) return aboutCategory('education', lang);
      return null;
    }
    if (aboutState === 'positions' || aboutState === 'projects') {
      var docs = aboutState === 'positions' ? expDocs() : projDocs();
      var url = aboutState === 'positions' ? '/work-experience.html' : '/key-projects.html';
      if (num && docs[+num[1] - 1]) {
        var d = docs[+num[1] - 1]; aboutState = null;
        return { lang: lang, text: firstSentences(d.text, 3), links: [{ title: pageName(url, lang), url: url }] };
      }
      var toks = tokens(q);
      for (var i = 0; i < docs.length; i++) {
        var tt = tokens(docs[i].title).filter(function (x) { return x.length >= 5; });
        if (toks.some(function (x) { return tt.indexOf(x) >= 0; })) {
          var dd = docs[i]; aboutState = null;
          return { lang: lang, text: firstSentences(dd.text, 3), links: [{ title: pageName(url, lang), url: url }] };
        }
      }
      return null;
    }
    return null;
  }

  function answer(q) {
    var lang = FR_HINT.test(q) ? 'fr' : (/[a-z]/i.test(q) ? (pageLang === 'fr' && !/\b(the|what|how|you)\b/i.test(q) ? 'fr' : 'en') : pageLang);
    var t = T[lang];
    if (HELLO_RE.test(q)) return { lang: lang, text: t.hello };
    if (aboutState) { var sel = aboutSelect(q, lang); if (sel) return sel; aboutState = null; }
    if (ROLE_RE.test(q)) {
      var role = kb.docs.filter(function (x) { return x.type === 'faq' && x.lang === lang && /(current role|poste actuel)/i.test(x.title); })[0];
      if (role) return { lang: lang, text: role.text, links: [{ title: pageName(role.url, lang), url: role.url }] };
    }
    var nq = norm(q);
    var poss = possCategory(nq); if (poss) return aboutCategory(poss, lang);
    if (LOC_RE.test(nq)) return aboutCategory('personal', lang);
    if (TESTI_RE.test(nq)) return aboutTestimonials(lang);
    if (ABOUT_SKILLS_RE.test(nq)) return aboutCategory('skills', lang);
    if (ABOUT_EXP_RE.test(nq)) return aboutCategory('professional', lang);
    if (ABOUT_EDU_RE.test(nq)) return aboutCategory('education', lang);
    if (ABOUT_PROJ_RE.test(nq)) return aboutCategory('projects', lang);
    if (NAME_RE.test(nq) && tokens(q).length <= 5) { var combo = nameComboCategory(nq); return combo ? aboutCategory(combo, lang) : aboutMenu(lang); }
    if (ABOUT_RE.test(nq)) return aboutMenu(lang);
    if (DASHBOARD_RE.test(q) && !BUILD_RE.test(q)) {
      return { lang: lang, text: t.dash, links: [{ title: pageName('/data-analytics.html', lang), url: '/data-analytics.html' },
        { title: lang === 'fr' ? 'Le monde en chiffres, fin 2026' : 'The world in numbers, late 2026', url: '/blog/world-bank-numbers-late-2026' + (lang === 'fr' ? '.fr' : '') + '.html' }] };
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
    if (HIRE_RE.test(q)) {
      return { lang: lang, text: t.hire, links: [{ title: t.contact, url: '/contact.html' }] };
    }
    if (BOOKING_RE.test(q)) {
      return { lang: lang, text: t.book, links: [{ title: t.contact, url: '/contact.html' }] };
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
      if (NAME_RE.test(nq) || ABOUT_RE.test(nq) ||
          (/\b(he|him|his|il|lui|ses|son)\b/.test(nq) && /(skill|competence|project|projet|experience|parcours|educat|formation|based|background|client)/.test(nq))) {
        return aboutMenu(lang, true);
      }
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
