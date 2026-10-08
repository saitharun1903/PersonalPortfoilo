import Image from 'next/image';
import { ArrowDown, ArrowUpRight, ArrowRight, ArrowUp, Braces, Code2, Database, GraduationCap, Laptop, Mail, MapPin, Wrench } from 'lucide-react';
import { CopyEmail, Navigation, ResumeButton, RevealObserver } from '../components/interactions';
import ProjectStack from '../components/project-stack';
import { profile, repositoryDescriptions, skills } from '../data/portfolio';
import { getRepositories } from '../lib/github';

export default async function Home() {
  const repositories = await getRepositories();
  const fallbackRepositories = [
    { name: 'WriteCodeProof', html_url: profile.github + '/WriteCodeProof', language: 'TypeScript', stargazers_count: 0 },
    { name: 'Elevate', html_url: profile.github + '/Elevate', language: 'TypeScript', stargazers_count: 0 },
    { name: 'Student-CRUD-operations', html_url: profile.github + '/Student-CRUD-operations', language: 'Java', stargazers_count: 0 },
  ];
  return <>
    <a className="skip-link" href="#main">Skip to content</a><Navigation />
    <main id="main">
      <section className="hero container" id="home">
        <div className="hero-copy"><p className="hero-introduction">Koppula Sai Tharun Reddy</p><h1>Hi, I’m <em>Sai.</em><br/>I build software<span className="blue">.</span></h1><p className="hero-description">A Computer Science student focused on Java, Spring Boot, and the backend behind useful web applications.</p>
          <div className="hero-actions"><a className="button primary" href="#projects">View My Work <ArrowDown size={17} /></a><ResumeButton /></div>
          <div className="hero-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href={`mailto:${profile.email}`}>Email <ArrowUpRight size={14} /></a></div>
        </div>
        <div className="hero-portrait"><div className="portrait-backdrop" aria-hidden="true" /><div className="portrait-card"><Image src="/images/sai-tharun.webp" alt="Sai Tharun Reddy" width={460} height={460} preload sizes="(max-width: 767px) 75vw, 350px" /><div className="portrait-caption"><span>Sai Tharun Reddy</span><span>Nice to meet you.</span></div></div><div className="code-stamp" aria-hidden="true"><Code2 size={34} strokeWidth={1.7} /></div><div className="portrait-note">Java &amp;<br/>Spring Boot.</div></div>
      </section>

      <section className="projects" id="projects"><div className="section-heading container reveal"><p className="section-label">Selected projects</p><h2>A few things<br/>I’ve <em>worked on.</em></h2><p>From browser tools to Java applications. Here’s a closer look.</p></div><ProjectStack /></section>

      <section className="about container reveal" id="about"><div className="about-heading"><p className="section-label">A little about me</p><h2>I like knowing<br/>how things <em>work.</em></h2></div><div className="about-content"><p>I’m studying Computer Science & Engineering at Malla Reddy University. I work mainly with Java and Spring Boot, and use React when a project needs a web interface.</p><p>My projects include a browser coding environment, a placement preparation platform, and a gym management application. I’m also exploring Python and data analysis.</p><div className="about-footnotes"><span><MapPin size={16} /> Based in India</span><span><GraduationCap size={18} /> Computer Science & Engineering</span></div></div></section>

      <section className="skills container" id="skills"><div className="section-heading reveal"><h2>What I <em>work with.</em></h2><p>My main focus is Java and backend development.</p></div><div className="skills-grid">{skills.map((skill, index) => { const Icon = [Braces, Database, Laptop, Wrench][index]; return <article className={`skill-card skill-${index} reveal`} key={skill.title}><div className="skill-icon"><Icon size={27} strokeWidth={1.6} /></div><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-items">{skill.items.map((item) => <span key={item}>{item}</span>)}</div>{index === 0 && <Braces className="skill-watermark" aria-hidden="true" />}</article>; })}</div></section>

      <section className="experience container reveal" id="experience"><div className="section-heading"><h2>Learning by <em>doing.</em></h2></div><div className="experience-row"><div className="experience-kind">Education</div><div><h3>Computer Science & Engineering</h3><p>Malla Reddy University, Hyderabad</p></div><GraduationCap size={29} strokeWidth={1.4} /></div><div className="experience-row"><div className="experience-kind">2024</div><div><h3>Technology Job Simulation</h3><p>Deloitte · Virtual learning experience</p><span>Software development, debugging, and problem-solving exercises.</span></div><Code2 size={29} strokeWidth={1.4} /></div></section>

      <section className="github-section container reveal" id="github"><div className="github-heading"><h2>There’s more<br/>on <em>GitHub.</em></h2><a className="text-link" href={profile.github} target="_blank" rel="noreferrer">@saitharun1903 <ArrowUpRight size={18} /></a></div><div className="repo-list">{(repositories.length ? repositories : fallbackRepositories).map((repository) => <a className="repo" key={repository.name} href={repository.html_url} target="_blank" rel="noreferrer"><div><h3>{repository.name}</h3><p>{repositoryDescriptions[repository.name]}</p><span>{repository.language || 'Source code'}{repository.stargazers_count > 0 ? ` · ${repository.stargazers_count} ${repository.stargazers_count === 1 ? 'star' : 'stars'}` : ''}</span></div><ArrowUpRight size={21} /></a>)}</div></section>

      <section className="contact-section" id="contact"><div className="contact container reveal"><div className="contact-top"><Mail size={24} strokeWidth={1.5} /><span>Have a project or an opportunity in mind?</span></div><h2>Let’s <em>talk.</em><ArrowUpRight aria-hidden="true" /></h2><div className="contact-bottom"><div><a className="email-address" href={`mailto:${profile.email}`}>{profile.email}<ArrowRight size={20} /></a><CopyEmail /></div><div className="contact-actions"><a className="button primary" href={`mailto:${profile.email}`}>Email Me <ArrowUpRight size={17} /></a><ResumeButton /></div></div></div></section>
    </main>
    <footer className="container"><div className="footer-name"><a className="wordmark" href="#home">sai<span>.</span></a><span>© {new Date().getFullYear()} {profile.name}</span></div><div className="footer-links"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href="#home" aria-label="Back to top"><ArrowUp size={19} /></a></div></footer>
    <RevealObserver /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: 'Backend Developer', sameAs: [profile.github, profile.linkedin], alumniOf: { '@type': 'CollegeOrUniversity', name: 'Malla Reddy University Hyderabad' } }) }} />
  </>;
}
