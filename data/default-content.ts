import { profile, projects, skills, repositoryDescriptions } from './portfolio';
import type { PortfolioContent } from '../lib/content-schema';

export const defaultContent: PortfolioContent = {
  profile: { ...profile, leetcode: 'https://leetcode.com/u/koppulasaitharunreddy/', brand: 'Sai Tharun Reddy', headline: 'Aspiring Backend Developer | Java & Spring Boot | SQL | AI/ML | Cloud | DSA | CSE Student', portrait: '/images/sai-tharun.webp', resume: '/resume', caption: 'Nice to meet you.', note: 'Java & Spring Boot.', location: 'Based in India', qualification: 'Computer Science & Engineering', institution: 'Malla Reddy University Hyderabad', jobTitle: 'Backend Developer' },
  copy: {
    heroIntro: 'Hello, I’m',
    projectsLabel: 'Project portfolio', projectsTitle: 'Selected', projectsAccent: 'projects.', projectsDescription: 'Working applications, implementation details, and links to explore the work.',
    aboutLabel: 'Background', aboutTitle: 'About', aboutAccent: 'me.',
    skillsTitle: 'Technical', skillsAccent: 'skills.', skillsDescription: 'My main focus is Java and backend development.',
    experienceTitle: 'Education &', experienceAccent: 'experience.',
    certificatesLabel: 'Professional development', certificatesTitle: 'Certifications &', certificatesAccent: 'learning.', certificatesDescription: 'Courses, practical learning, and the credentials behind the work.',
    githubTitle: 'There’s more on', githubAccent: 'GitHub.', contactPrompt: 'Have a project or an opportunity in mind?', contactTitle: 'Let’s', contactAccent: 'talk.',
    seoTitle: 'Koppula Sai Tharun Reddy | Backend Developer', seoDescription: 'Hi, I’m Sai. A Computer Science student and backend developer working with Java and Spring Boot. Explore WriteCode, Elevate, and my other projects.',
  },
  about: ['I’m studying Computer Science & Engineering at Malla Reddy University. I work mainly with Java and Spring Boot, and use React when a project needs a web interface.', 'My projects include a browser coding environment, a placement preparation platform, and a gym management application. I’m also exploring Python and data analysis.'],
  projects: projects.map(project => ({ ...project, github: project.github || '', live: project.live || '', image: project.image || '', imageAlt: project.imageAlt || '', color: project.color as 'blue' | 'ice' | 'paper' | 'cloud' })),
  skills,
  experience: [
    { kind: 'Education', title: 'Computer Science & Engineering', organization: 'Malla Reddy University, Hyderabad', description: '' },
    { kind: '2025', title: 'Technology Job Simulation', organization: 'Deloitte · Virtual learning experience', description: 'Software development, debugging, and problem-solving exercises.' },
  ],
  certifications: [
    { title: 'AWS Academy Cloud Foundations', issuer: 'AWS Academy · Training badge', date: 'March 2026', description: 'Completed the 20-hour AWS Academy Graduate – Cloud Foundations course.', image: '/certificates/aws-cloud-foundations.webp', pdf: '/certificates/aws-cloud-foundations.pdf', verification: 'https://www.credly.com/go/N51PRYpK' },
    { title: 'AWS Academy Cloud Security Foundations', issuer: 'AWS Academy · Trained badge', date: '', description: 'Trained badge for the AWS Academy Cloud Security Foundations course.', image: '/certificates/aws-cloud-security-foundations.webp', pdf: '/certificates/aws-cloud-security-foundations.webp', verification: '' },
    { title: 'Technology Job Simulation', issuer: 'Deloitte · Forage', date: 'June 2025', description: 'Certificate of completion for practical tasks in coding and development during June 2025.', image: '/certificates/deloitte-technology-job-simulation.webp', pdf: '/certificates/deloitte-technology-job-simulation.webp', verification: '' },
    { title: 'Code Sprint', issuer: 'HackWithIndia · Participation', date: '', description: 'Placed among the top 1,000 of 3,000 participating teams in Code Sprint.', image: '/certificates/hackwithindia-code-sprint.webp', pdf: '/certificates/hackwithindia-code-sprint.pdf', verification: '' },
    { title: 'Prompt Engineering Workshop', issuer: 'SMEC NDLI Club · St. Martin’s Engineering College', date: 'December 2025', description: 'Participated in a Prompt Engineering workshop led by Manish Kardas, Data Scientist at Microsoft.', image: '/certificates/prompt-engineering-workshop.webp', pdf: '/certificates/prompt-engineering-workshop.pdf', verification: '' },
    { title: 'MePro Level 10', issuer: 'Pearson · Completion certificate', date: 'April 2026', description: 'Completed Pearson MePro Level 10, an English programme built on the Global Scale of English.', image: '/certificates/pearson-mepro-level-10.webp', pdf: '/certificates/pearson-mepro-level-10.webp', verification: '' },
  ],
  repositories: Object.entries(repositoryDescriptions).map(([title, description]) => ({ title, description, url: `${profile.github}/${title}`, language: title === 'Student-CRUD-operations' ? 'Java' : 'TypeScript' })),
  sections: { projects: true, about: true, skills: true, experience: true, certifications: true, github: true },
};
