# Seniorenheim Auetal — Websystem One‑Shot V3 · Final Review Build

Konzeptentwurf für ein digitales Pflege- und Recruiting-Websystem statt eines reinen Website-Relaunchs.

## Enthalten
- Startseite mit Besucher-Router: Pflege/Angehörige vs. Karriere
- Zwei-Häuser-Story für Herrenwiese und Clausberg
- emotionale Bewohner-/Alltagsmomente mit Originalmotiven der bestehenden Auetal-Website
- eigenständige Karrierewelt mit Employer Branding
- belegte Arbeitgebervorteile statt erfundener Benefits
- Familienfreundlichkeits-/Kinderbetreuungs-Story
- 60-Sekunden-Job-Match ohne Lebenslaufzwang im ersten Schritt
- Social-Recruiting-Landingpage für Pflegeassistenz
- Admin-/Recruiting-Cockpit-Demo mit Pipeline, Funnel und Kampagnen
- Mobile Navigation, Mobile CTA und reduzierte Motion
- Offline-Fallbacks für Originalbilder: Im lokalen Sandbox-Preview werden bei fehlendem Netzwerk gebrandete Flächen gezeigt; online laden die Originalbilder von seniorenheim-auetal.de.

## Originalbilder
Die Bildquellen im Konzept stammen von der bestehenden Seniorenheim-Auetal-Website, u. a.:
- `Auetal_50-e1542895953625.jpg` — gemeinsamer Alltag / Wintergarten
- `team_img.png` — echtes Pflegeteam
- `ausbildung_img.png` — Mitarbeiter/Ausbildung
- `img_content4.jpg` — Kinderkrippe Krabbelkäfer
- `Auetal_30.jpg` — Wohnbereich
- `Auetal_33.jpg` — Bewohner am Balkon
- `Auetal_58-e1542718141382.jpg` — Außenanlage / Bewegung
- `Auetal_17.jpg` — Snoezelen
- `img2_content3-2.png` — Haus Clausberg aus der Luft

## Fakten-Disziplin
Konkrete Stellenkonditionen wie 3.700 € Einstieg, 35 Urlaubstage und 500 € Jahresbonus werden nur im Kontext der dafür öffentlich ausgeschriebenen Pflegeassistenz-Stelle verwendet. Andere Rollen werden nicht mit diesen Konditionen beworben.

## Finaler Feinschliff
- familienfreundliche Arbeitgeberstory mit belegter Auszeichnung von 2017
- präzisere Kinderbetreuungs-Kommunikation (Jobseite: 0–3 Jahre)
- virtueller Rundgang als zusätzlicher Angehörigen-Pfad
- klarer Demo-Hinweis im Recruiting-Cockpit
- OpenGraph/Favicon/Legal-Link-Polish

## QA
- interne Anchor-Links: PASS
- doppelte IDs: 0
- Bilder ohne Alt-Text: 0
- JavaScript Syntax: PASS
- responsive CSS vorhanden
- reduced-motion Support vorhanden
- Remote-Originalbilder im Web verifiziert
- lokaler Sandbox-Renderer hat keinen externen Netzwerkzugriff; deshalb ist Bild-Rendering lokal nur mit Fallback verifizierbar

Vollständiger Prüfbericht: `QA_REPORT.md`

## Release-Status
Push/Commit auf GitHub wurde am 11.09.2026 nach ausdrücklicher Freigabe durchgeführt. Kein Deployment ohne erneute ausdrückliche Freigabe.