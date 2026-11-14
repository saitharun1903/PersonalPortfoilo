# Portfolio design direction

A plain personal site, written and laid out the way a developer would make their own page: readable text, real screenshots, and links that look like links. It deliberately avoids the visual habits of template and AI-generated portfolios: no gradients or glows, no pill badges, no stat counters, no scrolling skill strips, no cursor effects, no tilted mock-ups, and no card grids. The project deck, certificate reel, and click burst are the deliberate flourishes.

Shared CSS tokens in `app/globals.css` keep the public site and admin consistent: page #fdfcf9 with a soft peach and sky glow at the top, navy ink #14213d, muted text #566179, faint text #6b7488, lines #e4e7ee, wash #f1f4f9, and a tomato accent #c2300f for links and highlights, with cobalt #2846c9 and emerald #12805c as supporting colours. Project cards use pastel tints (peach, sky, mint, butter); certificate covers cycle through cobalt, tomato, emerald, and navy with white info panels. The older token names (`--blue`, `--sky`, `--surface`, ...) are aliases of these so the admin screens follow the same palette.

Typography: Newsreader (serif) for headings and reading text; Public Sans for navigation, links, and small meta text.

## Layout

- Plain header: name on the left, text navigation on the right, a small resume link.
- Introduction: "Hello, I'm", the name, the headline, the first About paragraph, then text links. The photo sits to the right with its caption (a small round photo above the name on phones).
- Every section uses the same two-column layout: the title on the left and the content on the right, separated by hairlines. It becomes one column on narrow screens.
- Projects are a deck of cards, each in its own soft tint (sand, sage, blush, slate) with a large title, the one-line statement, description, technologies, and links. The real screenshot sits on the right; projects without one get a dark or rust poster with the title in italic.
- While scrolling, each card sticks near the top and the next card slides up over it; covered cards shrink slightly and darken, so the edges of the stack show (`CardStack` in `components/interactions.tsx`). Stacking only turns on when every card fits on screen and motion is allowed; otherwise the cards scroll normally.
- On phones the project description is left to the project dialog so each card fits the screen.
- Skills, experience, and repositories are simple lists.
- Certifications are a full-width reel of tall dark cards that slides on its own: black-and-white cover (or a typographic poster when there is no image), an issuer badge, and a name panel. It pauses on hover, on keyboard focus, and with the Pause button. Hovering a card (after a short delay, so a passing cursor does not trigger it) widens it in place to show its details and links beside the cover. The details panel has a fixed size and is only revealed, so nothing reflows while the card grows, and the reel moves by a fixed pixel distance so a widening card never makes it jump. On touch screens and with the keyboard a tap or Enter opens a card; on phones the details slide up over the cover instead (`components/certifications.tsx`).
- Clicking in the introduction sends out a ring of rust pixel squares from the click point (`components/hero-burst.tsx`). It is one canvas that only draws while pixels are alive.
- Section titles drop a trailing full stop from the content so they read as headings.

## Motion

The project card stack, the certificate reel, and the click burst are the moving parts. Elsewhere only colour and underline change on hover. Nothing animates on load. Under `prefers-reduced-motion` the project cards do not stack, the certificate reel becomes a normal horizontal scroll, and clicks make no burst.

## Checks

Contrast is checked with axe (WCAG 2.1 AA) alongside keyboard, touch, and responsive browser tests from 320px to 1440px.

## Asset sources

- `public/images/sai-tharun.webp`: profile image returned by https://api.github.com/users/saitharun1903.
- `public/images/writecode.webp`: actual Java workspace at https://writecode.in/?new=java.
- `public/images/elevate.webp`: actual homepage at https://elevatee-pi.vercel.app.
- Mentivox and Gym Nexus have no screenshot yet, so they are shown as text only.
