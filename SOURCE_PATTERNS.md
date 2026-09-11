# Auetal V4 — Pattern & Source Notes

Diese Version übernimmt keine fremde visuelle Identität. Verwendet werden überprüfte Open-Source-Mechaniken und interne Conversion-Learnings, anschließend auf Auetal neu komponiert.

## Externe GitHub-Quellen

### 1) darkroomengineering/lenis
- Repository: `darkroomengineering/lenis`
- Lizenz: MIT
- Verwendet: Lenis 1.3.26 als optionaler Smooth-Scroll-Runtime, fest gepinnt über jsDelivr.
- Anpassung: Bei `prefers-reduced-motion` oder fehlendem CDN fällt die Seite auf nativen Browser-Scroll zurück.

### 2) codrops/ScrollBasedLayoutAnimations
- Repository: `codrops/ScrollBasedLayoutAnimations`
- Lizenz: MIT
- Verwendetes Pattern: scrollgebundene Layout-/Galerie-Dramaturgie, pinned/sticky Storytelling und progressive Bildwechsel.
- Anpassung: Für Auetal als `workday-story` mit echten Auetal-Motiven umgesetzt. Keine fremde Demo-Optik übernommen.
- Bewusste Abweichung: GSAP/Flip/ScrollTrigger aus der Demo wurden nicht als zusätzliche Runtime eingebaut; die Auetal-Version nutzt IntersectionObserver/CSS, um Gewicht und konkurrierende Motion-Engines zu vermeiden.

### 3) codrops/OnScrollTypographyAnimations
- Repository: `codrops/OnScrollTypographyAnimations`
- Lizenz: MIT
- Verwendetes Pattern: große typografische Statements, die sich beim Scrollen richtungsabhängig bewegen.
- Anpassung: Employer-Branding-Manifesto `Zeit für Menschen / Platz fürs Leben / Ein Team, das trägt / Erst erleben, dann entscheiden`.

### 4) magicuidesign/magicui — Animated Beam
- Repository: `magicuidesign/magicui`
- Komponente: `animated-beam`
- Lizenz: MIT
- Verwendetes Pattern: animierter Verbindungspfad zur Visualisierung eines zusammenhängenden Systems.
- Anpassung: React/Motion-Komponente nicht eingebettet, sondern als leichtes natives SVG/JS für `Social Ad → Karrierewelt → Job-Match → Bewerber-Cockpit` neu umgesetzt.

## Interne Best-of-Learnings
- **CN:** Audience Router, problem-first Narrative, Pflege-Check, niedrige Recruiting-Hürde.
- **Walterhof:** Entscheidungssicherheit, Job-Match, Human Handoff, klar gekennzeichnete Demo-/Symbolinhalte.
- **Reisen & Erleben V5:** eine koordinierte Motion-Layer, Smooth Scroll mit Fallback, keine konkurrierenden Animation-Runtimes.

## Auetal-spezifische Bildquellen
Die Konzeptbilder stammen von der bestehenden Seniorenheim-Auetal-Website:
- `Auetal_50-e1542895953625.jpg`
- `team_img.png`
- `ausbildung_img.png`
- `img_content4.jpg`
- `Auetal_30.jpg`
- `Auetal_33.jpg`
- `Auetal_58-e1542718141382.jpg`
- `Auetal_17.jpg`
- `img2_content3-2.png`

## No-copy rule
Mechanik, Interaction-Prinzipien und Conversion-Muster dürfen übernommen/adaptiert werden. Copy, Bildsprache, Branding, Story und Informationsarchitektur bleiben Auetal-spezifisch.
