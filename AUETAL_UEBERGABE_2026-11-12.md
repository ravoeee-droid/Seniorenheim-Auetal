# Auetal – Setup, Abnahme und Schlusszahlung (Stand 12.11.2026)
**Vertrag:** Projekt- und Betreuungsvertrag vom 04.11.2026. **Setup:** 3.500 € netto (50/50). **Schlussrate:** 1.750 € netto / 2.082,50 € brutto nach Fertigstellung der Einrichtungsleistungen und Zugang der Schlussrechnung. **Laufende Leistungen:** 500 € Betreuung + 79 € Hosting netto/Monat; von einmaliger Einrichtung trennen.

## Technisch umgesetzt (Preview)
- Domain karriere.seniorenheim-auetal.de bei Vercel verifiziert; DNS CNAME bei ns1/ns2.antagus.de korrekt. Lokale Windows-DNS-Caches können dennoch NXDOMAIN liefern. Kein unbestätigter DNS-Wechsel.
- Eigenständige Karrierewelt auf Branch `auetal-karriere-freigabe-2026-11-11`. Am 12.11. `karriere.html` aus vier Fragmenten in vollständig serverseitig lieferbares HTML umgebaut; keine JS-Fragment-Ladeabhängigkeit mehr.
- Qualitätssicherung: 32/32 geprüfte HTML-Ressourcen (Bilder/CSS/JS) HTTP 200. Zwei fiktive Teamzitate durch faktische Originaleinblicke ersetzt; unbestätigte Gründungsjahres-, Gehalts- und Urlaubsaussagen aus der Freigabeseite entfernt.
- 60-Sekunden-Job-Match in `assets/jobmatch.js` mit 4 Auswahlfragen, Kontaktformular, Einwilligungscheck und sicherer API `POST /api/bewerbung`.
- Aktueller Build am 12.11.2026: Commit `81d8dec28fc11a09c61df5471d7e93a37be04b71`, Vercel-Preview READY, `karriere.html` HTTP 200 mit vollständigem HTML, `/api/bewerbung` HTTP 200 `ready:true`.
- Vorschau-API getestet: `GET /api/bewerbung` => HTTP 200 `ready:true`; invalider synthetischer POST => HTTP 422 `invalid_fields` (keine Bewerberdaten gespeichert). **Noch KEIN erfolgreicher vollständiger E2E-Eintrag inklusive anschließender Löschung getestet.**
- Bewerber-Dashboard auf geschützter Preview, separate Auetal-Datenbank und Admin-Authentifizierung. Kein produktiver Nachweis der Bewerber-Speichern/Löschen-Kette.
- `marketing@seniorenheim-auetal.de` als geschütztes Postfach im Dashboard; Nutzer hat Abruf als funktionierend bestätigt. SMTP-Versand nicht separat verifiziert.
- Produktionsdomain zeigt noch ältere `main`-Version: `/api/bewerbung` dort 404. **Nicht als fertigen neuen Bewerbungsfunnel kommunizieren.**
- Entwurf-E-Mail an Herr Denecke mit vier konkreten Freigabepunkten in Gmail gespeichert, nicht versendet.
- Drei redaktionelle Karussellkonzepte siehe `AUETAL_SOCIAL_PINNED_POSTS.md`.

## Bis zur faktischen Einrichtung/Abnahme
- [ ] **Karrierewelt:** Herr Denecke bestätigt Texte, Häuser, offene Fachkraftstellen, Vorteile. Gründungsjahr 1985/1986 klären, keine ungeprüften Mitarbeiterzitate/Gehalts-/Urlaubszahlen.
- [ ] **Bewerbungsprozess:** Vollständigen E2E-Test mit synthetischem Datensatz, Dashboard-Eingang, Statusänderung, Follow-up, Löschung und Mail-Benachrichtigung (sofern zugesagt) durchführen.
- [ ] **Datenschutz:** Bewerber-Datenschutzhinweise und Auftragsverarbeitung (Neon, Vercel, ggf. Mail) sowie Aufbewahrung/Löschung und Rollen/Einwilligungen vor realem Datenbetrieb mit Auetal klären. Preview nicht blind öffentlich für echte Bewerber öffnen.
- [ ] **Livegang:** erst nach schriftlicher Freigabe neue Karrierewelt auf Produktionsbranch veröffentlichen; HTTPS, DNS von AU/DE/TH, Mobile, Navigation, CTA, Job-Match, Frontend und API retesten.
- [ ] **Google-Unternehmensprofil:** Manager-Zugang für digitalegewinner@gmail.com freigegeben? Profilfelder, Fotos, lokale Angaben und Bewertungsprozess bearbeiten und dokumentieren. Noch nicht verifiziert.
- [ ] **Meta:** Unternehmenspartner-Zugriff auf Facebook-Seite und Werbekonto vollständig? Neues Instagram-Business-Profil erstellen/verbinden, Profile optimieren und Vorlagen einrichten. Noch nicht verifiziert.
- [ ] **Social:** drei Karussells mit echten und freigegebenen Auetal-Originalbildern gestalten, Text/Bildfreigabe einholen, Beiträge für Facebook/Instagram veröffentlichen bzw. anpinnen.
- [ ] **Übergabe:** Freigabe-Dokument, Zugänge/Rollen, Links, Support, laufenden Monatsplan und Abnahme-Protokoll mit Denecke.
- [ ] **Schlussrechnung:** erst nach Fertigstellung der vertraglich vereinbarten Einrichtungsleistungen ausstellen; Anzahlung 1.750 € netto anrechnen; die 579 € netto/Monat separat handhaben.

## Von Auetal zu bestätigen (minimal)
1. Rollenberechtigung Meta Business inkl. Instagram und Google-Unternehmensprofil.
2. Aktuelle Stellen, Arbeitgeber-Benefits und Aussagen; Nutzungsrechte von Fotos/Zitaten.
3. Datenschutz/AVV, Bewerberbearbeiter (Herr Denecke, Vertretung), Aufbewahrung/Löschung.
4. Freigabe für öffentliche Karrierewelt und 3 Social-Pins.

## Dokumentation
Workshop: https://app.notion.com/p/4124e021cd6c8171a6abeabdec812756
Arbeitgeberstory und Redaktionsregeln: https://app.notion.com/p/4154e021cd6c811a8749ce66afef4b16
Zugriff-Anleitung: https://app.notion.com/p/4134e021cd6c81a888dbc7fa8cefd565
