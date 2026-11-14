# Portfolio design direction

Personal developer portfolio for recruiters and engineers. Confident and high-contrast: a warm near-black page with a faint grid and grain, an electric lime accent, a coral spark for small details, and a lime contact panel that ends the page.

Shared CSS tokens in `app/globals.css` keep the public site and admin consistent: night #0d0d0b, raised #151513 and #1c1c19, chalk text #f3f2ea, muted text #a6a59c, lime #d4ff3a, coral #ff7a4d, lines #2b2b27 and #3d3d37. The older token names (`--blue`, `--sky`, `--surface`, ...) are aliases of these so the admin screens follow the same palette.

Typography: Bricolage Grotesque (bold, tight tracking) for headings, Hanken Grotesk for body text, JetBrains Mono for labels, tags, and the hero keyword line.

## Layout

- Floating dark pill navigation; the active section fills with lime.
- Hero: oversized name with the surname in lime, mono keyword line, portrait in a lime-gradient frame with a glow, a "Java & Spring Boot" tag, and a credentials card.
- Facts strip counted from the real content (projects, technologies, repositories) and a scrolling toolkit marquee.
- Projects: full-width cards stacked in document flow, alternating sides. Screenshots sit in a browser window with a slight 3D tilt; projects without one get a large typographic cover.
- Skills as an asymmetric bento grid (first card in lime), experience as a glowing timeline, certificates and repositories as cards.
- Cards marked `.spot` get a soft light that follows the pointer (`PointerGlow` in `components/interactions.tsx`).

## Motion

A staggered hero entrance, the toolkit marquee (pauses on hover), scroll reveals, and the pointer light. Under `prefers-reduced-motion` all of it is off and the marquee becomes a static wrapped list.

## Checks

Contrast is checked with axe (WCAG 2.1 AA) alongside keyboard, touch, and responsive browser tests from 320px to 1440px.

## Asset sources

- `public/images/sai-tharun.webp`: profile image returned by https://api.github.com/users/saitharun1903.
- `public/images/writecode.webp`: actual Java workspace at https://writecode.in/?new=java.
- `public/images/elevate.webp`: actual homepage at https://elevatee-pi.vercel.app.
- Mentivox and Gym Nexus use typographic project covers.
