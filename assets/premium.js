(() => {
  document.documentElement.classList.add('js-premium');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ lerp: .095, smoothWheel: true, wheelMultiplier: .92 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -85, duration: 1.1 });
    }));
  }

  requestAnimationFrame(() => document.body.classList.add('page-ready'));

  document.querySelectorAll('.reveal').forEach((el) => {
    el.setAttribute('data-premium-reveal','');
    if (el.classList.contains('delay-1')) el.dataset.delay='1';
    if (el.classList.contains('delay-2')) el.dataset.delay='2';
  });
  const revealTargets = document.querySelectorAll('[data-premium-reveal]');
  if (reduce || !('IntersectionObserver' in window)) revealTargets.forEach(x => x.classList.add('is-visible'));
  else {
    const ro = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); }
    }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(x => ro.observe(x));
  }

  const steps = [...document.querySelectorAll('[data-story-step]')];
  const layers = [...document.querySelectorAll('[data-story-layer]')];
  const setStory = id => {
    steps.forEach(s => s.classList.toggle('active', s.dataset.storyStep === id));
    layers.forEach(l => {
      const selected = l.dataset.storyLayer === id;
      l.classList.toggle('active', selected);
      l.setAttribute('aria-hidden', String(!selected));
    });
    const active = steps.find(s => s.dataset.storyStep === id);
    const caption = document.querySelector('[data-story-caption]');
    if (caption && active) caption.innerHTML = `<strong>${active.dataset.caption || active.querySelector('h3')?.textContent || ''}</strong><span>${active.dataset.kicker || 'Auetal'}</span>`;
  };
  if (steps.length && 'IntersectionObserver' in window) {
    const sio = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setStory(e.target.dataset.storyStep);
    }), { threshold: .58, rootMargin: '-12% 0px -30% 0px' });
    steps.forEach(s => sio.observe(s));
    setStory(steps[0].dataset.storyStep);
  }

  const manifesto = document.querySelector('.career-manifesto');
  const lines = [...document.querySelectorAll('.manifesto-line')];
  let ticking = false;
  const updateScrollMotion = () => {
    ticking = false;
    if (!manifesto || reduce) return;
    const r = manifesto.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
    lines.forEach((line, i) => {
      const dir = i % 2 ? 1 : -1;
      const dist = (p - .5) * dir * Math.min(innerWidth * .13, 170);
      line.style.setProperty('--x', `${dist}px`);
    });
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const rr = el.getBoundingClientRect();
      if (rr.bottom < 0 || rr.top > innerHeight) return;
      const py = (rr.top + rr.height/2 - innerHeight/2) / innerHeight;
      el.style.transform = `translate3d(0,${py * -18}px,0) scale(1.035)`;
    });
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScrollMotion); }
  }, { passive:true });
  updateScrollMotion();

  const buildSystemBeam = () => {
    document.querySelectorAll('.system-flow').forEach(flow => {
      const nodes = [...flow.querySelectorAll('.system-node')];
      if (nodes.length < 2 || reduce || innerWidth < 901) return;
      flow.querySelector('.system-beams')?.remove();
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.classList.add('system-beams');
      svg.setAttribute('aria-hidden','true');
      const defs = document.createElementNS(ns,'defs');
      const grad = document.createElementNS(ns,'linearGradient');
      grad.id = 'auetalBeamGradient'; grad.setAttribute('x1','0%'); grad.setAttribute('x2','100%');
      [[0,'rgba(215,177,118,0)'],[.3,'#d7b176'],[.7,'#d8eef0'],[1,'rgba(216,238,240,0)']].forEach(([offset,color]) => {
        const stop = document.createElementNS(ns,'stop'); stop.setAttribute('offset',String(offset)); stop.setAttribute('stop-color',color); grad.append(stop);
      });
      defs.append(grad); svg.append(defs);
      const fr = flow.getBoundingClientRect();
      const w = flow.clientWidth, h = flow.clientHeight;
      svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
      nodes.slice(0,-1).forEach((node,i) => {
        const a=node.getBoundingClientRect(), b=nodes[i+1].getBoundingClientRect();
        const sx=a.right-fr.left, sy=a.top-fr.top+a.height/2;
        const ex=b.left-fr.left, ey=b.top-fr.top+b.height/2;
        const cx=(sx+ex)/2;
        const d=`M ${sx} ${sy} C ${cx} ${sy}, ${cx} ${ey}, ${ex} ${ey}`;
        ['system-beam-base','system-beam-live'].forEach(cls => {
          const path=document.createElementNS(ns,'path');
          path.setAttribute('d',d); path.setAttribute('pathLength','1'); path.setAttribute('class',cls);
          if(cls==='system-beam-live') path.style.animationDelay=`${i*.45}s`;
          svg.append(path);
        });
      });
      flow.prepend(svg);
    });
  };
  if ('ResizeObserver' in window) {
    const beamObserver = new ResizeObserver(() => requestAnimationFrame(buildSystemBeam));
    document.querySelectorAll('.system-flow').forEach(x => beamObserver.observe(x));
  }
  addEventListener('load', buildSystemBeam, {once:true});
  requestAnimationFrame(buildSystemBeam);

  if (!reduce && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.dataset.magnetic = '';
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .08;
        const y = (e.clientY - r.top - r.height/2) * .12;
        btn.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });

    const glow = document.createElement('div');
    glow.className = 'pointer-glow';
    glow.setAttribute('aria-hidden','true');
    document.body.append(glow);
    addEventListener('pointermove', e => {
      glow.style.left = e.clientX+'px';
      glow.style.top = e.clientY+'px';
      glow.classList.add('on');
    }, {passive:true});
  }

  /* Gold rule: the navigation never auto-hides. Orientation beats decorative motion. */
  document.querySelector('[data-header]')?.classList.remove('header-hide');
})();

// === V5 employer-attraction interactions ===
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const switchData = {
    familie: {
      kicker:'FAMILIE',
      title:'Wenn dein Kind nicht gegen deinen Beruf arbeiten muss.',
      text:'Die Betriebskinderkrippe Krabbelkäfer kann berufstätige Eltern unterstützen. Welche Betreuungsplätze aktuell verfügbar sind, besprechen wir persönlich.',
      proof:'Kinderbetreuung bei Auetal kennenlernen',
      image:'https://seniorenheim-auetal.de/wp-content/uploads/2018/11/Auetal_4-e1542806489732.jpg',
      alt:'Kinderbereich in der betriebseigenen Kinderbetreuung des Auetal'
    },
    entwicklung: {
      kicker:'ENTWICKLUNG',
      title:'Wenn ein Wechsel nicht Stillstand bedeutet.',
      text:'Auetal unterstützt Fachkräfte mit Fortbildungen, Seminaren und Entwicklungsmöglichkeiten. Welche zusätzlichen Qualifikationen zu deiner Stelle passen, klären wir im Gespräch.',
      proof:'Fortbildung und berufliche Entwicklung für Pflegefachkräfte',
      image:'https://seniorenheim-auetal.de/wp-content/uploads/2018/11/Auetal_48-3.jpg',
      alt:'Alltag und Mitarbeiterangebote im Seniorenheim Auetal'
    },
    entlastung: {
      kicker:'ENTLASTUNG',
      title:'Wenn weniger Papierkram wieder mehr Pflege bedeutet.',
      text:'Im Haus Clausberg arbeiten Pflege und Service eng zusammen. Elektronische Dokumentation soll den organisatorischen Aufwand reduzieren und Zeit für persönliche Pflege ermöglichen.',
      proof:'Pflege und Service arbeiten zusammen',
      image:'https://seniorenheim-auetal.de/wp-content/uploads/2018/11/Auetal_33.jpg',
      alt:'Alltag im Seniorenheim Auetal'
    },
    sicherheit: {
      kicker:'SICHERHEIT',
      title:'Wenn gute Arbeit auch ein solides Paket braucht.',
      text:'Für examinierte Pflegefachkräfte wurden im Arbeitgeberworkshop 25,50 € pro Stunde und 35 Urlaubstage genannt. Auch Nachtzuschläge und betriebliche Altersvorsorge sind Themen. Alle Konditionen werden vor Veröffentlichung freigegeben.',
      proof:'Stelle, Arbeitszeit und Konditionen offen besprechen',
      image:'https://seniorenheim-auetal.de/wp-content/uploads/2018/11/Auetal_52-1.jpg',
      alt:'Einblicke in das Leben im Seniorenheim Auetal'
    },
    kennenlernen: {
      kicker:'VERTRAUEN',
      title:'Wenn du nicht nach einer Website entscheiden musst.',
      text:'Du musst nicht sofort kündigen oder dich festlegen. Ein Gespräch oder eine Hospitation hilft dir herauszufinden, ob du dich bei uns wohlfühlst.',
      proof:'Hospitation ist auf Wunsch möglich',
      image:'https://seniorenheim-auetal.de/wp-content/uploads/2018/11/Auetal_5.jpg',
      alt:'Einblick in die Einrichtung des Seniorenheims Auetal'
    }
  };

  const stage = document.getElementById('switchStage');
  const pills = [...document.querySelectorAll('[data-switch]')];
  if (stage && pills.length) {
    const img=document.getElementById('switchImage'), kicker=document.getElementById('switchKicker'), title=document.getElementById('switchTitle'), text=document.getElementById('switchText'), proof=document.getElementById('switchProof');
    pills.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
      btn.addEventListener('click', () => {
      const d=switchData[btn.dataset.switch]; if(!d) return;
      pills.forEach(x=>{
        const selected=x===btn;
        x.classList.toggle('active',selected);
        x.setAttribute('aria-pressed',String(selected));
      });
      if (!reduce && stage.animate) {
        stage.animate([{opacity:.78,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
      if (!reduce) img.style.opacity='.2';
      const pre=new Image();
      pre.onload=()=>{img.src=d.image;img.alt=d.alt;img.style.opacity='1'};
      pre.onerror=()=>{img.style.opacity='1'};
      pre.src=d.image;
      kicker.textContent=d.kicker;
      title.textContent=d.title;
      text.textContent=d.text;
      proof.textContent=d.proof;
      });
    });
  }

  const builder=document.getElementById('workplaceBuilder');
  if(builder){
    const answers={}; let step=1;
    const steps=[...builder.querySelectorAll('[data-builder-step]')];
    const progress=document.getElementById('builderProgress');
    const result=builder.querySelector('.builder-result');
    const labels=['Rolle','Umfang','Wichtigster Punkt','Kennenlernen'];
    const render=()=>{
      steps.forEach(x=>{
        const selected=Number(x.dataset.builderStep)===step;
        x.classList.toggle('active',selected);
        x.setAttribute('aria-hidden',String(!selected));
        x.inert=!selected;
      });
      if(progress) progress.textContent=`${Math.min(step,4)} / 4`;
    };
    builder.querySelectorAll('.builder-options button').forEach(btn=>btn.addEventListener('click',()=>{
      const current=btn.closest('[data-builder-step]');
      const idx=Number(current.dataset.builderStep);
      answers[idx]=btn.dataset.value;
      current.querySelectorAll('button').forEach(x=>{const chosen=x===btn;x.classList.toggle('selected',chosen);x.setAttribute('aria-pressed',String(chosen));});
      if(idx<4){
        step=idx+1;
        render();
        steps.find(x=>Number(x.dataset.builderStep)===step)?.querySelector('button')?.focus();
      }else{
        steps.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-hidden','true');x.inert=true;});
        result.hidden=false;
        if(progress) progress.textContent='FERTIG';
        document.getElementById('builderSummary').innerHTML=labels.map((l,i)=>`<span><b>${l}</b><strong>${answers[i+1]||'—'}</strong></span>`).join('');
        const title=document.getElementById('builderTitle');
        if(title) title.textContent=`${answers[1]||'Dein Job'} – aber passend zu deinem Leben.`;
        const resultTitle=result.querySelector('h3');
        if(resultTitle){resultTitle.tabIndex=-1;resultTitle.focus();}
      }
    }));
    document.getElementById('builderRestart')?.addEventListener('click',()=>{
      Object.keys(answers).forEach(k=>delete answers[k]);
      step=1;
      result.hidden=true;
      builder.querySelectorAll('button.selected').forEach(x=>{x.classList.remove('selected');x.setAttribute('aria-pressed','false');});
      render();
      steps[0]?.querySelector('button')?.focus();
    });
    render();
  }
})();
