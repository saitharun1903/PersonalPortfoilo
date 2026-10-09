import { profile, projects, skills, repositoryDescriptions } from './portfolio';
import type { PortfolioContent } from '../lib/content-schema';

export const defaultContent: PortfolioContent = {
  profile: { ...profile, brand: 'Sai Tharun Reddy', firstName: 'Sai', portrait: '/images/sai-tharun.webp', resume: '/resume', caption: 'Nice to meet you.', note: 'Java & Spring Boot.', location: 'Based in India', qualification: 'Computer Science & Engineering', institution: 'Malla Reddy University Hyderabad', jobTitle: 'Backend Developer' },
  copy: {
    hero: 'I build software', heroDescription: 'A Computer Science student focused on Java, Spring Boot, and the backend behind useful web applications.',
    projectsLabel: 'Selected projects', projectsTitle: 'A few things I’ve', projectsAccent: 'worked on.', projectsDescription: 'From browser tools to Java applications. Here’s a closer look.',
    aboutLabel: 'A little about me', aboutTitle: 'I like knowing how things', aboutAccent: 'work.',
    skillsTitle: 'What I', skillsAccent: 'work with.', skillsDescription: 'My main focus is Java and backend development.',
    experienceTitle: 'Learning by', experienceAccent: 'doing.',
    certificatesLabel: 'Learning, recognised', certificatesTitle: 'A little more', certificatesAccent: 'qualified.', certificatesDescription: 'Courses, practical learning, and the credentials behind the work.',
    githubTitle: 'There’s more on', githubAccent: 'GitHub.', contactPrompt: 'Have a project or an opportunity in mind?', contactTitle: 'Let’s', contactAccent: 'talk.',
    seoTitle: 'Koppula Sai Tharun Reddy | Backend Developer', seoDescription: 'Hi, I’m Sai. A Computer Science student and backend developer working with Java and Spring Boot. Explore WriteCode, Elevate, and my other projects.',
  },
  about: ['I’m studying Computer Science & Engineering at Malla Reddy University. I work mainly with Java and Spring Boot, and use React when a project needs a web interface.', 'My projects include a browser coding environment, a placement preparation platform, and a gym management application. I’m also exploring Python and data analysis.'],
  projects: projects.map(project => ({ ...project, github: project.github || '', live: project.live || '', image: project.image || '', imageAlt: project.imageAlt || '', color: project.color as 'blue' | 'ice' | 'paper' | 'cloud' })),
  skills,
  experience: [
    { kind: 'Education', title: 'Computer Science & Engineering', organization: 'Malla Reddy University, Hyderabad', description: '' },
    { kind: '2024', title: 'Technology Job Simulation', organization: 'Deloitte · Virtual learning experience', description: 'Software development, debugging, and problem-solving exercises.' },
  ],
  certifications: Array.from({ length: 4 }, (_, index) => ({ title: `Your certification ${index + 1}`, issuer: 'Sample · replace with your issuer', date: '', description: 'Sample card — replace with your own certificate details in the admin.', image: '', pdf: '', verification: '' })),
  repositories: Object.entries(repositoryDescriptions).map(([title, description]) => ({ title, description, url: `${profile.github}/${title}`, language: title === 'Student-CRUD-operations' ? 'Java' : 'TypeScript' })),
  sections: { projects: true, about: true, skills: true, experience: true, certifications: true, github: true },
};
