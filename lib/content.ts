import 'server-only';
import { cache } from 'react';
import { defaultContent } from '../data/default-content';
import { contentSchema } from './content-schema';
import { backendConfigured, publicDatabase } from './supabase';

export const getContent = cache(async () => {
  if (!backendConfigured()) return defaultContent;
  try {
    const { data, error } = await publicDatabase().from('portfolio_content').select('document').eq('id', 1).maybeSingle();
    if (error) throw error;
    if (!data) return defaultContent;
    const content = contentSchema.parse(data.document);
    // Correct the original seed's technology label without replacing owner edits.
    for (const project of content.projects) {
      if (project.title === 'Gym Nexus' && project.github.endsWith('/Gym-Nexus') && project.stack.join('|') === 'Java|MySQL|REST APIs') project.stack = ['Java', 'MySQL', 'Swing', 'JDBC'];
    }
    for (const repository of content.repositories) {
      if (repository.title === 'Student-CRUD-operations' && repository.description === 'A Java application with RESTful create, read, update, and delete operations.') repository.description = 'Java servlet application for creating, reading, updating, and deleting student records.';
    }
    // Upgrade untouched introductory copy; custom admin text stays as written.
    const originalHeadings = [
      ['projectsTitle', 'projectsAccent', 'A few things I’ve', 'worked on.'],
      ['aboutTitle', 'aboutAccent', 'I like knowing how things', 'work.'],
      ['skillsTitle', 'skillsAccent', 'What I', 'work with.'],
      ['experienceTitle', 'experienceAccent', 'Learning by', 'doing.'],
      ['certificatesTitle', 'certificatesAccent', 'A little more', 'qualified.'],
    ] as const;
    for (const [title, accent, oldTitle, oldAccent] of originalHeadings) {
      if (content.copy[title] === oldTitle && content.copy[accent] === oldAccent) {
        content.copy[title] = defaultContent.copy[title];
        content.copy[accent] = defaultContent.copy[accent];
      }
    }
    // Replace the original sample certificates with the real ones until the owner adds their own.
    const isSample = (certificate: (typeof content.certifications)[number]) => /^sample\b/i.test(certificate.issuer) || /^your certification\b/i.test(certificate.title);
    if (content.certifications.length > 0 && content.certifications.every(isSample)) content.certifications = defaultContent.certifications;
    // The Deloitte certificate is dated June 2025; correct the untouched seed year.
    for (const item of content.experience) {
      if (item.title === 'Technology Job Simulation' && item.kind === '2024' && item.organization.startsWith('Deloitte')) item.kind = '2025';
    }
    return content;
  } catch {
    console.error('Portfolio content could not be loaded; serving the bundled portfolio.');
    return defaultContent;
  }
});
