# Portfolio design direction

A plain personal site, written and laid out the way a developer would make their own page: readable text, real screenshots, and links that look like links. It deliberately avoids the visual habits of template and AI-generated portfolios: no gradients or glows, no pill badges, no stat counters, no scrolling skill strips, no cursor effects, no tilted mock-ups, and no card grids. The project deck is the single deliberate flourish.

Shared CSS tokens in `app/globals.css` keep the public site and admin consistent: page #fbfaf7, ink #1d1c1a, muted text #66645e, faint text #74716a, lines #e4e1d9, wash #f2efe8, and one accent, rust #a8401c, used only for links. The older token names (`--blue`, `--sky`, `--surface`, ...) are aliases of these so the admin screens follow the same palette.

Typography: Newsreader (serif) for headings and reading text; Public Sans for navigation, links, and small meta text.

## Layout

- Plain header: name on the left, text navigation on the right, a small resume link.
- Introduction: "Hello, I'm", the name, the headline, the first About paragraph, then text links. The photo sits to the right with its caption (a small round photo above the name on phones).
- Every section uses the same two-column layout: the title on the left and the content on the right, separated by hairlines. It becomes one column on narrow screens.
- Projects are a deck of cards, each in its own soft tint (sand, sage, blush, slate) with a large title, the one-line statement, description, technologies, and links. The real screenshot sits on the right; projects without one get a dark or rust poster with the title in italic.
- While scrolling, each card sticks near the top and the next card slides up over it; covered cards shrink slightly and darken, so the edges of the stack show (`CardStack` in `components/interactions.tsx`). Stacking only turns on when every card fits on screen and motion is allowed; otherwise the cards scroll normally.
- On phones the project description is left to the project dialog so each card fits the screen.
- Skills, experience, certifications, and repositories are simple lists.
- Section titles drop a trailing full stop from the content so they read as headings.

## Motion

The project card stack is the one scroll effect. Elsewhere only colour and underline change on hover. Nothing animates on load, and under `prefers-reduced-motion` the cards do not stack.

## Checks

Contrast is checked with axe (WCAG 2.1 AA) alongside keyboard, touch, and responsive browser tests from 320px to 1440px.

## Asset sources

- `public/images/sai-tharun.webp`: profile image returned by https://api.github.com/users/saitharun1903.
- `public/images/writecode.webp`: actual Java workspace at https://writecode.in/?new=java.
- `public/images/elevate.webp`: actual homepage at https://elevatee-pi.vercel.app.
- Mentivox and Gym Nexus have no screenshot yet, so they are shown as text only.
