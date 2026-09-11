# Auetal Websystem V5 – QA Report

## Status
**Local build ready for review. Not pushed. Not deployed.**

## V5 employer-attraction upgrade
- Candidate-first Wechselgrund-Lab: Familie, Entwicklung, Entlastung, Sicherheit, Kennenlernen
- Benefits rebuilt as lived situations instead of icon/card list
- Role-specific fact block for Pflegeassistenz: 3.700 € entry pay, 35 vacation days, 500 € annual bonus
- Interactive Wunsch-Arbeitsplatz builder; explicitly framed as preference capture, not contractual promise
- Trust section: belegbare Aussagen vs. bewusst nicht versprochene Recruiting-Floskeln
- Stronger social recruiting landing page with everyday benefit translation
- Admin cockpit now includes an Employer Attractiveness layer with strengths, content opportunities and items that must be clarified in conversation
- Existing Job-Match, Social Recruiting, Admin Pipeline, Care Compass and premium scroll layer retained

## Source discipline
Only employer claims already published by Seniorenheim Auetal are presented as facts. Role-specific conditions are labeled as role-specific. No invented employee quote, shift promise, hiring guarantee or fake employer claim has been added.

## Static QA
- HTML parser: PASS on index.html, karriere.html, recruiting.html, admin.html
- Duplicate IDs: PASS (none)
- Internal anchor/file-link audit: PASS
- JavaScript syntax: PASS for app.js, jobmatch.js, carematch.js, admin.js, premium.js
- Lenis dependency pinned to 1.3.26 with native-scroll fallback
- prefers-reduced-motion handling retained

## Visual QA limitation
A container Chromium screenshot attempt did not complete in the sandbox environment. Therefore the V5 visual/motion layer is **not claimed as fully browser-render verified** here. Final live-preview review is still required before customer delivery.
