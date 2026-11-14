# Portfolio design direction

A plain personal site, written and laid out the way a developer would make their own page: readable text, real screenshots, and links that look like links. It deliberately avoids the visual habits of template and AI-generated portfolios: no gradients or glows, no pill badges, no stat counters, no scrolling skill strips, no cursor effects, no tilted mock-ups, and no card grids. The project deck, certificate reel, and click burst are the deliberate flourishes.

Shared CSS tokens in `app/globals.css` keep the public site and admin consistent: a cool off-white page #f8f9fc with a soft blue and peach glow at the top, navy ink #14213d, muted text #566179, faint text #6b7488, lines #e2e6ef, wash #eef2fa, and a royal-blue accent #2b4acb for links, buttons, and highlights. Cards use the same palette: project cards are white with a soft border and shadow, and project posters and certificate covers share one navy-to-blue gradient (the same as the navigation monogram), with blue links and details. The older token names (`--blue`, `--sky`, `--surface`, ...) are aliases of these so the admin screens follow the same palette.

Typography: Newsreader (serif) for headings and reading text; Public Sans for navigation, links, and small meta text.

## Layout

- Navigation: a floating frosted bar that stays at the top while scrolling, with a round monogram, the name, a navy pill that slides behind the current section, a blue Resume button, and a thin line along the bottom showing reading progress. On narrow screens the links move into a solid drop-down panel. Project cards stop just below the bar.
- Introduction: fills the window below the navigation, with the content centred vertically, so the next section appears only on scroll; a small animated scroll hint sits at the bottom. On very short windows (under 520px tall) it sizes to its content instead. "Hello, I'm", the name, the headline, the first About paragraph, then text links. The photo sits to the right with its caption (a small round photo above the name on phones).
- Every section uses the same two-column layout: the title on the left and the content on the right, separated by hairlines. It becomes one column on narrow screens.
- Projects are a deck of white cards with a large title, the one-line statement, description, technologies, and links. The real screenshot sits on the right; projects without one get a navy-to-blue poster with the title in italic.
- While scrolling, each card sticks near the top and the next card slides up over it; covered cards shrink slightly and dim a little, so the edges of the stack show (`CardStack` in `components/interactions.tsx`). Stacking only turns on when every card fits on screen and motion is allowed; otherwise the cards scroll normally.
- Project cards stay two columns down to 700px wide (tablets in portrait, phones held sideways) and become one column below that. On phones the project description is left to the project dialog so each card fits the screen.
- Phones and tablets: touch targets are at least 44px on coarse pointers, the phone menu includes a Resume button below 400px wide, the navigation drops its blur under 860px to keep scrolling cheap, the certificate reel only animates while on screen, and the browser bar is tinted to the page colour.
- Skills, experience, and repositories are simple lists.
- Certifications are a full-width reel of tall cards that slides on its own: the whole certificate image framed on the blue gradient (or a typographic poster when there is no image), an issuer badge, and a name panel. If the database still holds only the original sample certificates, the bundled real ones are shown instead (`lib/content.ts`). It pauses on hover, on keyboard focus, and with the Pause button. A View all button beside Pause opens a gallery of every certificate in a modal grid, each with View, PDF, and Verify where available; the gallery is only built when opened, so its images do not load with the page. Each card's details have View certificate, a PDF download with a readable file name, and Verify where a verification link exists. Hovering a card (after a short delay, so a passing cursor does not trigger it) widens it in place to show its details and links beside the cover. The details panel has a fixed size and is only revealed, so nothing reflows while the card grows, and the reel moves by a fixed pixel distance so a widening card never makes it jump. On touch screens and with the keyboard a tap or Enter opens a card; on phones the details slide up over the cover instead (`components/certifications.tsx`).
- Clicking in the introduction sends out a ring of blue pixel squares from the click point (`components/hero-burst.tsx`). It is one canvas that only draws while pixels are alive.
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
- `public/certificates/`: the owner's ten certificates, each with a WebP card image (at most 1000px wide) and a PDF. The AWS Academy Cloud Foundations, HackWithIndia Code Sprint, and SMEC Prompt Engineering PDFs are the original files; the other PDFs were made from images upscaled 3× (Lanczos), sharpened, and with near-white backgrounds cleaned to white, embedded as high-quality JPEG at 288 dpi (the AWS Academy Cloud Security Foundations badge, and the Deloitte, Pearson, Scaler, Infosys Springboard, and HP LIFE certificates cropped from phone and LinkedIn screenshots, with LinkedIn's overlay icon removed from the Scaler one).
