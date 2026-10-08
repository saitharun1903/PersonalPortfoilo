# Portfolio design direction

Personal developer portfolio for recruiters and engineers. Light editorial composition, white surfaces and sky blue, with specific project writing and real assets.

Layout variance 7, motion 6, density 3. Native CSS in the existing Next.js application. Manrope for sans-serif text, Lora italic for a limited personal accent. No dark section inversions, AI badges, mock metrics, or simulated product screenshots.

## Audit and changes

- Replaced the particle hero with the owner's public GitHub portrait.
- Replaced promotional headings and repeated labels with a personal introduction and project-specific copy.
- Replaced the WriteCode simulation and Elevate workflow illustration with screenshots from the actual applications.
- Added pinned project cards with scale, slight rotation, and overlap through GSAP ScrollTrigger. Desktop panels pin at `top top`; the incoming panel drives the preceding card's scale. Mobile uses native sticky only when every card fits in the viewport. Short screens and reduced-motion users get the full document flow.
- Preserved email, social links, resume, project dialogs, and server-side GitHub fetching.
- Mobile descriptions remain available in project dialogs.
- Light-theme contrast is checked with axe, alongside keyboard and responsive browser checks.

## References reviewed

- https://brittanychiang.com/ — clear introduction and project descriptions.
- https://rauno.me/ — personal typography and interaction details.
- https://www.awwwards.com/websites/portfolio/ — composition and motion references.
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — pinning, scrubbing, and responsive cleanup.

## Asset sources

- `public/images/sai-tharun.webp`: profile image returned by https://api.github.com/users/saitharun1903.
- `public/images/writecode.webp`: actual Java workspace at https://writecode.in/?new=java.
- `public/images/elevate.webp`: actual homepage at https://elevatee-pi.vercel.app.
- Mentivox and Gym Nexus use typographic project covers.

Reference sites inform the design; their imagery and code are not included in the portfolio.
