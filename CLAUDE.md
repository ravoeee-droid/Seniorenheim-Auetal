# JJ Media Website Agent System — Golden Master V4

This file is binding for all AI-assisted website work in this repository. Treat it as a STOP-SHIP quality gate, not optional guidance.

## Operating model
Use an Everything-Claude-Code-style multi-stage workflow. Never jump directly from request to implementation.

1. RESEARCH
- Inspect the existing site, repository, brand assets, supplied materials and public company facts before writing copy or code.
- Build a Facts Ledger. Never invent company facts, people, numbers, benefits, reviews, vacancies or claims.
- Identify target audiences, pains, objections, anxieties, desires and desired transformation.
- For recruiting projects, understand candidate motivations, employer differentiators, hiring friction and the real application journey.

2. STRATEGY / PLAN
Before implementation establish:
- Positioning Thesis
- Human-First Creative Strategy
- emotional Story Arc
- Art Direction based on the actual brand
- primary conversion journey
- secondary conversion journey
- trust moments
- objections and answers
- at least 3 project-specific Signature Components
- mobile information hierarchy

Walterhof/Auetal quality is a reference level, never a copy-paste template. Every company must feel individually art-directed.

3. IMPLEMENTATION
- Build premium, production-quality Next.js code.
- Preserve and use the client's actual branding, colors, typography direction, imagery and identity where available.
- Avoid generic AI/SaaS layouts, repetitive card grids, meaningless gradients, excessive pills and template-looking sections.
- Use strong hierarchy, intentional whitespace, responsive typography, polished interactions, tasteful motion and high-quality imagery.
- Every section must earn its place through persuasion, trust, story or conversion.

4. RECRUITING WORLD
When employee recruitment matters, a generic Jobs section is insufficient. Build a real Karrierewelt containing, where facts/assets permit:
- employer story and mission
- real people / leadership / team
- authentic everyday-work insights
- candidate benefits and reasons to join
- role/vacancy presentation
- objections / FAQ
- low-friction quick application
- emotional candidate journey
- repeated contextual application CTAs
- long-term employer-brand / applicant-pool thinking

5. CONVERSION
- One unmistakable primary CTA.
- Secondary CTA only when strategically useful.
- Do not rely on a single CTA at the bottom.
- Every major journey should lead naturally to an action.
- Forms must minimize friction and work on mobile.

6. VERIFICATION LOOP
After implementation act as separate reviewers:
- Code Reviewer: correctness, maintainability, regressions.
- Build Reviewer: dependency/security/build failures, current supported Next.js version.
- UX Reviewer: hierarchy, clarity, conversion and interaction.
- Visual Reviewer: premium art direction, consistency, spacing and imagery.
- Accessibility Reviewer: semantic HTML, keyboard use, contrast, labels, focus, reduced motion.
- Mobile Reviewer: rendered mobile layout, tap targets, overflow, sticky UI and forms.
- Recruiting Reviewer: whether a candidate is genuinely persuaded and can apply easily.

Fix discovered issues and repeat verification. Do not merely report obvious defects when they can be fixed.

## STOP-SHIP blockers
A build is NOT ready if any of these are true:
- build/lint/type errors
- broken links, routes, forms or assets
- horizontal mobile overflow or visibly broken responsive layout
- placeholder/lorem/unsupported invented facts
- missing core conversion path
- generic or incomplete Karrierewelt when recruiting is a primary objective
- inaccessible critical interactions
- inconsistent brand system
- obviously low-quality/irrelevant hero imagery
- major console/runtime errors
- existing working functionality was accidentally regressed
- page visually falls below the Golden Master reference quality

## Release protocol
Do not call a project finished merely because code compiles.
Required sequence:
Research → Facts Ledger → Strategy → Plan → Build → Code Review → rendered Desktop QA → rendered Mobile QA → Accessibility/Conversion QA → fix loop → final release review.

Do not deploy/push a final release without explicit approval when approval has been requested as part of the project workflow. Preview deployments may be used for QA when appropriate, but they do not waive the quality gates.

## Definition of done — 15k Quality Gate
The result must feel like a bespoke premium agency website capable of supporting a ~€15k positioning: distinctive strategy, strong copy architecture, credible facts, project-specific art direction, meaningful signature components, complete conversion journeys, polished motion/interactions, excellent mobile execution and verified technical quality.

If a request conflicts with these quality rules, preserve the user's explicit request while still satisfying all non-conflicting quality gates. If essential facts are unknown, mark them for confirmation rather than inventing them.
