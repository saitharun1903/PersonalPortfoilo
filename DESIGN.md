# Portfolio design direction

Personal developer portfolio for recruiters and engineers. Warm and natural rather than templated: a paper-toned page with a faint grain, a serif display voice, and a monospace face for the technical details. One dark surface only, the contact panel that closes the page.

Shared CSS tokens in `app/globals.css` keep the public site and admin consistent: paper #f6f1e7, deeper paper #ede5d6, card #fcf9f3, ink #1c231f, muted text #59625a, moss accent #2c5a44, deep moss #1d3f2f, clay highlight #a34a26, and line #dcd3c1. The older token names (`--blue`, `--sky`, `--surface`, ...) are aliases of these so the admin screens follow the same palette.

Typography: Instrument Serif for headings, with its italic in clay for the accent word of each heading; Figtree for body text; JetBrains Mono for labels, tags, and the hero keyword line.

## Layout

- Floating pill navigation with the active section filled in moss.
- Hero: oversized name, mono keyword line, and the portrait in an arch with an offset moss block and a credentials card.
- Projects: alternating two-column rows in normal document flow. Projects with a screenshot show it in a tilted browser window; projects without one get a typographic cover.
- About, skills, experience, certifications, and GitHub share one vertical rhythm, separated by hairlines.
- Certificates show a cover only when an image has been uploaded.

## Motion

One staggered entrance in the hero, soft scroll reveals, and small hover responses. Everything is disabled under `prefers-reduced-motion`.

## Checks

Contrast is checked with axe (WCAG 2.1 AA) alongside keyboard, touch, and responsive browser tests from 320px to 1440px.

## Asset sources

- `public/images/sai-tharun.webp`: profile image returned by https://api.github.com/users/saitharun1903.
- `public/images/writecode.webp`: actual Java workspace at https://writecode.in/?new=java.
- `public/images/elevate.webp`: actual homepage at https://elevatee-pi.vercel.app.
- Mentivox and Gym Nexus use typographic project covers.
