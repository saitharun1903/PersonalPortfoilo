export const profile = {
  name: 'Koppula Sai Tharun Reddy',
  email: 'saitharunreddy@writecode.in',
  github: 'https://github.com/saitharun1903',
  linkedin: 'https://www.linkedin.com/in/koppulasaitharunreddy/',
};

export const projects = [
  {
    title: 'WriteCode', category: 'Browser-based development environment',
    description: 'Open a browser. Write some code.',
    detail: 'Write, run, and debug programs without setting up a local environment. WriteCode brings the editor, files, terminal, and debugger into one browser workspace.',
    stack: ['Java', 'Code execution', 'Sandboxing'], github: null, live: 'https://writecode.in',
    image: '/images/writecode.webp', imageAlt: 'The real WriteCode Java editor, showing Main.java and its console',
    highlights: ['Run code with real compilers', 'Debug with breakpoints and inspect variables', 'Keep files and projects together in the browser'], color: 'blue',
  },
  {
    title: 'Elevate', category: 'Browser extension & web application',
    description: 'Know what to prepare for your next interview.',
    detail: 'Elevate reads a job posting, extracts the role and required skills, and helps you prepare. It also brings saved jobs, resume comparisons, and application tracking into one place.',
    stack: ['TypeScript', 'Browser Extension', 'React'], github: `${profile.github}/Elevate`, live: 'https://elevatee-pi.vercel.app',
    image: '/images/elevate.webp', imageAlt: 'The actual Elevate website showing job analysis and interview preparation',
    highlights: ['Extract requirements from a job posting', 'Compare your resume with the role', 'Prepare for interviews and track applications'], color: 'ice',
  },
  {
    title: 'Mentivox', category: 'Placement preparation platform',
    description: 'A place to practise before the real interview.',
    detail: 'A placement preparation platform with mock interviews and resume analysis, built with React, Node.js, and MongoDB.',
    stack: ['React', 'Node.js', 'MongoDB', 'JWT'], github: null, live: null, image: null, imageAlt: null,
    highlights: ['Practise with mock interviews', 'Review your resume', 'Prepare for placement interviews'], color: 'paper',
  },
  {
    title: 'Gym Nexus', category: 'Java management application',
    description: 'Keep the records. Lose the paperwork.',
    detail: 'A gym management application for member and staff records. Java handles the application logic, with database operations and role-based access for different users.',
    stack: ['Java', 'MySQL', 'REST APIs'], github: `${profile.github}/Gym-Nexus`, live: null, image: null, imageAlt: null,
    highlights: ['Manage member and staff records', 'Control access by user role', 'Store and update records in a database'], color: 'cloud',
  },
];

export const skills = [
  { title: 'Backend', description: 'The part I spend the most time on.', items: ['Java', 'Spring Boot', 'REST APIs', 'JDBC', 'Maven'] },
  { title: 'Databases', description: 'Storing, querying, and connecting the data.', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL'] },
  { title: 'Frontend', description: 'Taking a project all the way to the screen.', items: ['React', 'Next.js', 'TypeScript', 'HTML & CSS'] },
  { title: 'Along the way', description: 'Tools I use and subjects I’m exploring.', items: ['Git', 'Docker', 'Python', 'Pandas', 'Scikit-learn'] },
];

export const repositoryDescriptions: Record<string, string> = {
  WriteCodeProof: 'Sandboxed tests, security checks, and behaviour diffs for pull requests.',
  Elevate: 'Job analysis, resume comparison, and interview preparation.',
  'Student-CRUD-operations': 'A Java application with RESTful create, read, update, and delete operations.',
};
