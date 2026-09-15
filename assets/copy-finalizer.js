(() => {
  const page = document.body?.dataset.page || '';
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => [...document.querySelectorAll(sel)];
  const text = (sel, value) => { const el = qs(sel); if (el) el.textContent = value; };
  const html = (sel, value) => { const el = qs(sel); if (el) el.innerHTML = value; };
  const meta = (name, value) => {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute('content', value);
  };
  const remove = (sel) => qsa(sel).forEach(el => el.remove());

  const visitorNodes = [
    ['Belegt auf der Auetal-Arbeitgeber- und Jobseite', 'Kostenfreie Kinderkrippe für Mitarbeitende und Wiedereinsteiger.'],
    ['Konkrete Entwicklung statt „Weiterbildung möglich“', 'Fortbildungen, Seminare, Trainings und Aufstiegsmöglichkeiten.'],
    ['Digitalisierung als Zeitgewinn erzählen – nicht als Software-Feature', 'Elektronische Dokumentation soll Bürokratie reduzieren.'],
    ['Konkrete Konditionen immer rollenspezifisch ausspielen', 'Konkrete Konditionen werden je Stelle transparent genannt.'],
    ['Probearbeiten senkt das gefühlte Wechselrisiko', 'Probearbeiten ist ausdrücklich möglich.'],
    ['Auetal kommuniziert elektronische Dokumentation ausdrücklich als Mittel, den bürokratischen Aufwand zu reduzieren. Genau so wird aus Technik ein Arbeitgeberargument.', 'Auetal nutzt elektronische Dokumentation, um bürokratischen Aufwand zu reduzieren und mehr Raum für die eigentliche Pflege zu schaffen.']
  ];
  const exactMap = new Map(visitorNodes);

  const sweepText = (root = document.body) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) return;
      const raw = node.nodeValue || '';
      const trimmed = raw.trim();
      if (!exactMap.has(trimmed)) return;
      const before = raw.match(/^\s*/)?.[0] || '';
      const after = raw.match(/\s*$/)?.[0] || '';
      node.nodeValue = before + exactMap.get(trimmed) + after;
    });
  };

  if (page === 'home') {
    document.title = 'Seniorenheim Auetal · Zuhause, Pflege & Karriere';
    meta('description', 'Seniorenheim Auetal in Kalefeld-Echte: zwei Häuser, persönliche Pflege, Orientierung für Angehörige und eine Karrierewelt für Pflegekräfte.');
    text('.route-section .split-heading > p', 'Wählen Sie einfach den Weg, der zu Ihrer Situation passt. So gelangen Sie ohne Umwege zu den wichtigsten Informationen und nächsten Schritten.');
    text('.site-footer .footer-grid > p', 'Seniorenheim Auetal in Kalefeld-Echte – zwei Häuser, persönliche Pflege und ein Arbeitsplatz mit Haltung.');
    remove('.site-footer a[href="admin.html"]');
  }

  if (page === 'career') {
    document.title = 'Karriere im Seniorenheim Auetal · Pflegejobs';
    meta('description', 'Pflegejobs im Seniorenheim Auetal: Arbeitgeber kennenlernen, offene Stellen ansehen und ohne Bewerbungsroman prüfen, ob ein Kennenlernen passt.');

    text('.manifesto-note strong', 'Ein guter Arbeitsplatz zeigt sich im Alltag.');
    text('.manifesto-note p', 'Entscheidend ist, ob Team, Arbeitsalltag und Arbeitgeber zu deinem Leben passen. Deshalb lernst du hier erst Auetal kennen – und dann die passende Stelle.');
    text('.workday-copy > p:not(.eyebrow)', 'Was Auetal als Arbeitgeber ausmacht, zeigt sich in Team, Entwicklung, Familienfreundlichkeit und der Möglichkeit, erst einmal reinzuschnuppern.');
    text('.benefits-experience .split-heading > p', 'So siehst du nicht nur, was Auetal anbietet, sondern was davon zu deinem Alltag und deinen Plänen passen könnte.');

    text('.life-benefits .life-benefit:nth-child(3) .life-benefit-answer', 'Pool, Massageangebot und Ruheräume werden für diese Stelle konkret genannt.');
    text('.life-benefits .life-benefit:nth-child(4) .life-benefit-answer', 'Einarbeitung, Training und Entwicklung gehören mit zum Blick nach vorn.');
    text('.life-benefits .life-benefit:nth-child(5) .life-benefit-answer', 'Elektronische Dokumentation soll den Papieraufwand reduzieren.');
    text('.trust-stamp small', 'ERST KENNENLERNEN');

    html('.truth-intro .eyebrow', '<span></span> Ehrlich statt schönreden');
    text('.truth-intro > p:last-child', 'Pflege ist anspruchsvoll. Darum versprechen wir dir nicht, dass jeder Tag leicht ist – sondern zeigen dir, was Auetal konkret anbietet und was du persönlich klären solltest.');
    text('.truth-no > small', 'WAS WIR NICHT VERSPRECHEN');

    html('.employer-story-copy .eyebrow', '<span></span> Ein Arbeitsplatz, der zum Leben passen soll');
    text('.family-proof strong', 'Familienfreundlichkeit wird im Auetal seit Jahren gelebt.');
    text('.employer-story-visual blockquote small', 'Was im Alltag einen Unterschied machen kann');

    html('.pay-copy .eyebrow', '<span></span> Pflegeassistenz · konkrete Konditionen');
    text('.pay-note strong', 'Konkrete Konditionen');
    text('.pay-note span', 'für eine konkrete ausgeschriebene Stelle');
    const payLink = qs('.pay-copy a[href="recruiting.html"]');
    if (payLink) payLink.innerHTML = 'Pflegeassistenz im Detail ansehen <span>↗</span>';

    html('.system-reveal-head .eyebrow', '<span></span> Dein Weg zu Auetal');
    html('.system-reveal-head h2', 'Vom ersten Eindruck bis zum <em>Kennenlernen</em> – ohne Umwege.');
    text('.system-reveal-head > p', 'Du kannst Auetal kennenlernen, passende Stellen ansehen, den Job-Match nutzen und anschließend direkt Kontakt aufnehmen.');
    const system = qsa('.system-reveal .system-node');
    const systemCopy = [
      ['Erster Eindruck','Auetal entdecken','Lerne Team, Alltag und offene Stellen kennen.'],
      ['Orientierung','Passende Stelle','Finde die Rolle, die zu dir und deinem Leben passt.'],
      ['Nächster Schritt','Job-Match','Vier kurze Fragen statt langer Bewerbung.'],
      ['Persönlich','Kennenlernen','Telefonieren, vorbeikommen oder Probearbeiten besprechen.']
    ];
    system.forEach((node, i) => {
      if (!systemCopy[i]) return;
      const [smallCopy,strongCopy,pCopy] = systemCopy[i];
      const small = node.querySelector('small'); const strong = node.querySelector('strong'); const p = node.querySelector('p');
      if (small) small.textContent = smallCopy;
      if (strong) strong.textContent = strongCopy;
      if (p) p.textContent = pCopy;
    });
    text('.system-demo-link p', 'Wenn es sich gut anfühlt, ist der nächste Schritt ganz einfach.');
    const systemLink = qs('.system-demo-link a');
    if (systemLink) { systemLink.href = '#jobmatch'; systemLink.innerHTML = 'Job-Match starten <span>↓</span>'; }

    const matchPoints = qsa('.jobmatch-points span');
    if (matchPoints[2]) matchPoints[2].textContent = '✓ deine Antworten werden erst beim Kontakt übermittelt';

    text('.site-footer .footer-grid > p', 'Karriere im Seniorenheim Auetal. Konditionen und Arbeitsmodelle können je Stelle unterschiedlich sein.');
    const recruitingFooter = qs('.site-footer a[href="recruiting.html"]');
    if (recruitingFooter) recruitingFooter.textContent = 'Pflegeassistenz';
    remove('.site-footer a[href="admin.html"]');
  }

  if (page === 'recruiting') {
    document.title = 'Pflegeassistenz im Auetal · Stelle & Konditionen';
    meta('description', 'Pflegeassistenz im Seniorenheim Auetal: konkrete Konditionen, Arbeitgebervorteile und ein kurzer Job-Match für den ersten unverbindlichen Kontakt.');

    text('.ad-story-grid > div:last-child > p:last-child', 'Du musst nicht erst Unterlagen zusammensuchen. Ein paar kurze Fragen reichen, um herauszufinden, ob ein Gespräch für dich Sinn ergibt.');
    text('.ad-life-proof .split-heading > p', 'Entscheidend ist nicht, wie eine Benefit-Liste klingt, sondern was davon in deinem Alltag wirklich einen Unterschied machen kann.');
    text('.quickmatch-section .jobmatch-copy > p:not(.eyebrow)', 'Vier kurze Fragen helfen dir einzuschätzen, ob Auetal zu dir passen könnte.');

    html('.system-reveal-head .eyebrow', '<span></span> Dein Weg zu Auetal');
    html('.system-reveal-head h2', 'Von der ersten Info bis zum <em>Kennenlernen.</em>');
    text('.system-reveal-head > p', 'Erst Rolle und Konditionen ansehen, dann Auetal kennenlernen, kurz prüfen, ob es passt, und direkt Kontakt aufnehmen.');
    const system = qsa('.system-reveal .system-node');
    const systemCopy = [
      ['Stelle','Konditionen','Sieh auf einen Blick, worum es geht.'],
      ['Arbeitgeber','Auetal kennenlernen','Erfahre, was deinen Arbeitsalltag prägen kann.'],
      ['Vier Fragen','Job-Match','Prüfe ohne Bewerbungsroman, ob ein Gespräch passt.'],
      ['Direkt','Kontakt','Nimm anschließend persönlich Kontakt auf.']
    ];
    system.forEach((node, i) => {
      if (!systemCopy[i]) return;
      const [smallCopy,strongCopy,pCopy] = systemCopy[i];
      const small = node.querySelector('small'); const strong = node.querySelector('strong'); const p = node.querySelector('p');
      if (small) small.textContent = smallCopy;
      if (strong) strong.textContent = strongCopy;
      if (p) p.textContent = pCopy;
    });
    text('.mini-demo-footer span', 'Pflegeassistenz im Seniorenheim Auetal · Angaben basieren auf der aktuell veröffentlichten Stellenausschreibung.');
  }

  if (page === 'admin') {
    document.title = 'Auetal Recruiting Cockpit · Beispielansicht';
    text('.admin-side-note span', 'Beispielansicht');
    text('.admin-side-note p', 'Keine echten Bewerberdaten.');
    text('.admin-demo-banner strong', 'Interaktive Beispielansicht');
    text('.admin-demo-banner span', 'Alle Kontakte und Kennzahlen auf dieser Seite sind Beispieldaten.');
    text('.admin-user small', 'Beispieldaten');
    text('#simulateLead', '+ Beispielkontakt simulieren');

    const metricCopy = [
      ['—','nach Kampagnenstart messbar'],
      ['—','nach Kampagnenstart messbar'],
      ['—','nach Kampagnenstart messbar'],
      ['—','nach Aktivierung messbar']
    ];
    qsa('.metric-grid article').forEach((card, i) => {
      const strong = card.querySelector('strong'); const small = card.querySelector('small');
      if (strong) strong.textContent = metricCopy[i]?.[0] || '—';
      if (small) small.textContent = metricCopy[i]?.[1] || 'Beispielwert';
    });

    qsa('.pipeline .lead-card strong').forEach((el, i) => { el.textContent = `Beispielkontakt ${String.fromCharCode(65+i)}`; });
    qsa('.pipeline .lead-card small').forEach(el => {
      if (!el.textContent.includes('Beispiel')) el.textContent = `Beispiel · ${el.textContent}`;
    });

    qsa('.funnel-bars b').forEach(el => { el.textContent = '—'; });
    qsa('.admin-panel .status-live').forEach(el => { if (el.textContent.trim() === 'LIVE') el.textContent = 'BEISPIEL'; });
    const insights = qsa('.insight-card strong');
    insights.forEach(el => { el.textContent = 'Beispiel'; });
  }

  sweepText();

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; sweepText(); });
  });
  if (document.body) observer.observe(document.body, { subtree:true, childList:true, characterData:true });
})();
