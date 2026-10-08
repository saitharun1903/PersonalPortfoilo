# Sai Tharun Reddy · Portfolio

Next.js App Router, React, TypeScript, native CSS, Lucide, and GSAP. A light portfolio with sky-blue accents, a personal photo, actual product screenshots, and project cards that overlap on scroll. Fonts are self-hosted through Next.js. See `DESIGN.md` for the design rationale and references.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`.

## Checks

```sh
npm run lint
npm run build
npx playwright install chromium
npm test
npm run test:production
```

## Update

- Edit `data/portfolio.ts` for contact details, skills, and project content.
- Replace `public/resume.pdf` to update the downloaded resume. The `/resume` route serves the actual PDF with a download filename. Keep this file present when deploying.
- Canonical metadata, robots, and sitemap default to `https://saitharunreddy.me`. Set `NEXT_PUBLIC_SITE_URL` only to override this domain.
- GitHub data refreshes on the server hourly and falls back to direct repository links on failure. No token required.

## Content sources and remaining assets

The supplied brief, public GitHub repositories, and the existing `koppula-sai-tharun-portfolio/server/seed.ts` supplied the content. No user counts or impact metrics have been copied. Deloitte is presented as a virtual job simulation rather than employment.

WriteCode links to its verified live website at https://writecode.in, with a screenshot from the real Java workspace. Elevate links to its repository and live website, also with a real screenshot. WriteCodeProof is a separate repository in the GitHub section. The portrait is the owner's public GitHub profile photo. Optimized WebP assets are in `public/images`.

Mentivox is supported by the previous portfolio data; a repository link can be added when supplied. Gym Nexus links to the verified Java repository; it is not silently equated with Gym Harmony Hub. Smart Healthcare Monitoring System, Forestry Management System, and Gym Harmony Hub are not published as detailed case studies because their implementation details and repository URLs remain unverified. Add them to the data when those details are available.

Mentivox and Gym Nexus have typographic covers, with no invented product screens. Email uses a mailto action, LinkedIn uses the supplied URL, and the actual provided PDF is included.

## Deploy to Vercel

1. Import `saitharun1903/PersonalPortfoilo` from GitHub into Vercel.
2. Use the Next.js preset, repository root, Node.js 24, and default build/output settings. No secrets are required.
3. Deploy, then test the generated Vercel URL, including `/resume` and the scrolling project cards.
4. In project Settings → Domains, add `saitharunreddy.me` and `www.saitharunreddy.me`. Make the apex domain primary and redirect www to it.
5. In Namecheap → Domain List → Manage → Advanced DNS, use the exact A and CNAME values displayed by Vercel. Replace conflicting parking or redirect records for `@` and `www`; preserve email and unrelated records.
6. Wait for Vercel to show valid DNS and HTTPS, then test the custom domain.

Keep the Next.js server deployment: the resume download uses a server route, with its PDF explicitly included in the function bundle. GitHub Actions runs lint, a production build, and browser tests on pushes to main.

## Motion and accessibility

Desktop project panels pin while the next panel enters; the previous card scales and tilts slightly. The animation is dynamically imported and cleaned up on viewport changes and unmount. Mobile cards use native sticky overlap only if their measured heights fit the viewport. Short screens and reduced-motion settings preserve regular document flow. The entire page is readable without JavaScript.

The browser suite checks six viewport widths, overflow, image loading, desktop overlap and transforms, mobile sticky behavior, reduced motion, navigation, dialogs, clipboard copying, and an actual resume download. It also runs an axe WCAG A/AA accessibility audit.

## Dependency audit

The production dependency audit reports zero known vulnerabilities. The full audit currently reports five related development-tooling findings through ESLint's transitive `braces` dependency; the registry has no patched `braces` version. Avoid forcing the suggested incompatible Next.js ESLint downgrade. Recheck the audit when updating dependencies.
