# Auetal Websystem — Final QA Report

## Status
Send-ready concept build for review. GitHub push authorized on 11 Sep 2026; no deployment authorized.

## Functional checks
- Local asset references: PASS
- Duplicate IDs: PASS (0)
- JavaScript syntax: PASS (`app.js`, `jobmatch.js`, `admin.js`)
- Home audience-router modal: PASS
- Career Job-Match 4 questions -> result: PASS
- Recruiting Quick-Match -> result: PASS
- Admin demo lead simulation: PASS
- Mobile responsive rules: PASS
- Reduced-motion support: PASS
- Noindex/nofollow on prospect demo pages: PASS

## Factual checks against current Auetal public pages (11 Sep 2026)
- Current open care roles: verified
- Pflegeassistenz: 3,700 EUR starting salary: verified for this role
- Pflegeassistenz: 35 vacation days: verified for this role
- Pflegeassistenz: 500 EUR annual bonus: verified for this role
- Employee childcare / company nursery: verified
- Electronic documentation / SIS: verified
- Further training: verified
- Trial work: verified
- Employee relaxation offers: verified
- 2017 family-friendly employer award: verified and explicitly dated

## Visual QA
- Desktop layouts reviewed for Home / Career / Recruiting / Admin: PASS
- Mobile layouts reviewed for same routes: PASS
- Original Auetal image URLs are wired as primary visuals.
- The sandbox cannot fetch the external image binaries, so final live-image loading must be checked once in a real online preview. Branded visual fallbacks prevent broken-image boxes.

## V3 score (excluding live remote-image transport)
- Positioning & offer clarity: 11/12
- Hero / first impression: 9/10
- Conversion architecture: 13/14
- Copy & objection handling: 9/10
- Trust & proof: 9/10
- Visual design & brand consistency: 11/12
- UX & information architecture: 7/8
- Mobile quality: 7/8
- SEO & GEO: 7/8
- Technical quality / performance / accessibility: 7/8
- Total: 90/100

Live preview image transport remains the one final environment-specific verification before calling a deployed preview fully released.