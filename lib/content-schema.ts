import { z } from 'zod';

const text = z.string().trim().max(4000);
const short = z.string().trim().min(1).max(160);
const link = z.string().max(2000).refine(value => {
  if (!value) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}, 'Use a full HTTPS URL, or leave empty.');
const asset = z.string().max(2000).refine(value => !value || /^\/(?!\/)[a-zA-Z0-9/_.-]+$/.test(value) || link.safeParse(value).success, 'Use an uploaded file or HTTPS URL.');
const items = z.array(short).max(30);
export const projectSchema = z.object({
  title: short, category: short, description: text, detail: text, stack: items,
  github: link, live: link, image: asset, imageAlt: text, highlights: items,
  color: z.enum(['blue', 'ice', 'paper', 'cloud']),
});
export const certificateSchema = z.object({ title: short, issuer: short, date: text, description: text, image: asset, pdf: asset, verification: link });
export const contentSchema = z.object({
  profile: z.object({ name: short, brand: short, headline: text.default('Aspiring Backend Developer | Java & Spring Boot | SQL | AI/ML | Cloud | DSA | CSE Student'), email: z.email(), github: link, linkedin: link, portrait: asset, resume: asset, caption: text, note: text, location: text, qualification: text, institution: text, jobTitle: text }),
  copy: z.object({ heroIntro: text.default('Hello, I’m'), projectsLabel: text, projectsTitle: text, projectsAccent: text, projectsDescription: text, aboutLabel: text, aboutTitle: text, aboutAccent: text, skillsTitle: text, skillsAccent: text, skillsDescription: text, experienceTitle: text, experienceAccent: text, certificatesLabel: text, certificatesTitle: text, certificatesAccent: text, certificatesDescription: text, githubTitle: text, githubAccent: text, contactPrompt: text, contactTitle: text, contactAccent: text, seoTitle: short, seoDescription: text }),
  about: z.array(text).max(20),
  projects: z.array(projectSchema).max(40),
  skills: z.array(z.object({ title: short, description: text, items })).max(30),
  experience: z.array(z.object({ kind: short, title: short, organization: text, description: text })).max(40),
  certifications: z.array(certificateSchema).max(60),
  repositories: z.array(z.object({ title: short, description: text, url: link.refine(Boolean, 'Repository URL is required.'), language: text })).max(40),
  sections: z.object({ projects: z.boolean(), about: z.boolean(), skills: z.boolean(), experience: z.boolean(), certifications: z.boolean(), github: z.boolean() }),
});
export type PortfolioContent = z.infer<typeof contentSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
