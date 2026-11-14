import { Fragment } from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowDown, ArrowUpRight, ArrowRight, ArrowUp, Braces, Database, GraduationCap, Laptop, Mail, MapPin, Wrench } from 'lucide-react';
import { CopyEmail, Navigation, PointerGlow, ResumeButton, RevealObserver } from '../components/interactions';
import ProjectStack from '../components/project-stack';
import Certifications from '../components/certifications';
import SocialLinks from '../components/social-links';
import { getContent } from '../lib/content';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getContent();
  return { title: copy.seoTitle, description: copy.seoDescription, openGraph: { title: copy.seoTitle, description: copy.seoDescription, images: ['/opengraph-image'] } };
}
export default async function Home() {
  const { profile, copy, sections, about, projects, skills, experience, certifications, repositories } = await getContent();
  const nameParts = profile.brand.trim().split(/\s+/);
  const surname = nameParts.pop();
  const headlineParts = profile.headline.split('|').map(part => part.trim()).filter(Boolean);
  const technologies = [...new Set(skills.flatMap(skill => skill.items))];
  const facts = [
    sections.projects && projects.length > 0 && { value: projects.length, label: projects.length === 1 ? 'Project shipped' : 'Projects built' },
    sections.skills && technologies.length > 0 && { value: technologies.length, label: 'Technologies used' },
    sections.github && repositories.length > 0 && { value: repositories.length, label: repositories.length === 1 ? 'Public repository' : 'Public repositories' },
  ].filter(Boolean) as { value: number; label: string }[];
  return <>
    <a className="skip-link" href="#main">Skip to content</a><Navigation profile={profile} sections={sections} />
    <RevealObserver /><PointerGlow />
    <main id="main">
      <section className="hero container" id="home">
        <div className="hero-copy">
          <p className="hero-introduction"><i aria-hidden="true"/>{profile.jobTitle}{profile.location && <><b aria-hidden="true">·</b>{profile.location}</>}</p>
          <h1 className="hero-name">{nameParts.length > 0 && <span>{nameParts.join(' ')}</span>}<em>{surname}<i aria-hidden="true">.</i></em></h1>
          <p className="hero-headline">{headlineParts.map((part, index) => <Fragment key={index}>{index > 0 && ' '}<span>{part}{index < headlineParts.length - 1 && <span className="separator" aria-hidden="true"> |</span>}</span></Fragment>)}</p>
          <div className="hero-actions">{sections.projects && projects.length > 0 && <a className="button primary" href="#projects">See my work <ArrowDown size={18} /></a>}<ResumeButton href={profile.resume}/></div>
          <SocialLinks profile={profile}/>
        </div>
        <aside className="hero-portrait">
          <div className="portrait-frame spot"><div className="portrait-card">{profile.portrait && <Image src={profile.portrait} alt={profile.brand} width={460} height={460} unoptimized={profile.portrait.startsWith('https:')} preload sizes="(max-width: 860px) 320px, 400px" />}</div>{profile.note && <p className="portrait-note">{profile.note.replace(/\.$/, '')}</p>}</div>
          <div className="hero-credentials"><GraduationCap size={22} strokeWidth={1.6}/><div><p>{profile.qualification}</p><span>{profile.institution}</span></div></div>
        </aside>
      </section>
      {(facts.length > 0 || technologies.length > 0) && <div className="hero-strip">
        {facts.length > 0 && <dl className="facts container">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{String(fact.value).padStart(2, '0')}</dd></div>)}</dl>}
        {technologies.length > 0 && <div className="marquee" aria-hidden="true"><div className="marquee-track">{[0, 1].map(copyIndex => <div className="marquee-group" key={copyIndex}>{technologies.map(item => <span key={item}>{item}<i>✦</i></span>)}</div>)}</div></div>}
      </div>}
      {sections.projects && <section className="projects container" id="projects"><div className="section-heading reveal"><p className="section-label">{copy.projectsLabel}</p><h2>{copy.projectsTitle} <em>{copy.projectsAccent}</em></h2><p>{copy.projectsDescription}</p></div>{projects.length > 0 && <ProjectStack projects={projects} email={profile.email}/>}</section>}
      {sections.about && <section className="about container" id="about"><div className="about-heading reveal"><p className="section-label">{copy.aboutLabel}</p><h2>{copy.aboutTitle} <em>{copy.aboutAccent}</em></h2></div><div className="about-content reveal">{about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="about-footnotes"><span><MapPin size={17} />{profile.location}</span><span><GraduationCap size={18} />{profile.qualification}</span></div></div></section>}
      {sections.skills && <section className="skills container" id="skills"><div className="section-heading reveal"><p className="section-label">Toolkit</p><h2>{copy.skillsTitle} <em>{copy.skillsAccent}</em></h2><p>{copy.skillsDescription}</p></div><div className="skills-grid">{skills.map((skill, index) => { const Icon = [Braces, Database, Laptop, Wrench][index % 4]; return <article className="skill-card spot reveal" key={index}><div className="skill-top"><span className="skill-icon"><Icon size={24} strokeWidth={1.6} /></span><span className="skill-index">{String(index + 1).padStart(2, '0')}</span></div><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-items">{skill.items.map((item, i) => <span key={i}>{item}</span>)}</div></article>; })}</div></section>}
      {sections.experience && <section className="experience container" id="experience"><div className="section-heading reveal"><p className="section-label">Journey</p><h2>{copy.experienceTitle} <em>{copy.experienceAccent}</em></h2></div><ol className="timeline">{experience.map((item, index) => <li className="experience-row reveal" key={index}><div className="experience-kind">{item.kind}</div><div><h3>{item.title}</h3><p>{item.organization}</p>{item.description && <span>{item.description}</span>}</div></li>)}</ol></section>}
      {sections.certifications && <section className="certifications container" id="certifications"><div className="section-heading reveal"><p className="section-label">{copy.certificatesLabel}</p><h2>{copy.certificatesTitle} <em>{copy.certificatesAccent}</em></h2><p>{copy.certificatesDescription}</p></div><Certifications certificates={certifications}/></section>}
      {sections.github && <section className="github-section container" id="github"><div className="github-heading reveal"><p className="section-label">Open source</p><h2>{copy.githubTitle} <em>{copy.githubAccent}</em></h2>{profile.github && <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">Explore my GitHub <ArrowUpRight size={18} /></a>}</div><div className="repo-list reveal">{repositories.map((repository, index) => <a className="repo spot" key={index} href={repository.url} target="_blank" rel="noreferrer"><div><h3>{repository.title}</h3><p>{repository.description}</p><span>{repository.language || 'Source code'}</span></div><ArrowUpRight size={22} /></a>)}</div></section>}
      <section className="contact-section container" id="contact"><div className="contact reveal"><div className="contact-top"><Mail size={22} strokeWidth={1.6}/><span>{copy.contactPrompt}</span></div><h2>{copy.contactTitle} <em>{copy.contactAccent}</em></h2><div className="contact-bottom"><div><a className="email-address" href={`mailto:${profile.email}`}>{profile.email}<ArrowRight size={24}/></a><CopyEmail email={profile.email}/></div><div className="contact-actions"><a className="button primary" href={`mailto:${profile.email}`}>Email me <ArrowUpRight size={18}/></a><ResumeButton href={profile.resume}/></div></div></div></section>
    </main>
    <footer className="container"><div className="footer-name"><a className="wordmark" href="#home">{profile.brand}<span>.</span></a><span>© {new Date().getFullYear()} {profile.name}</span></div><div className="footer-links">{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13}/></a>}{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13}/></a>}<a href="#home" aria-label="Back to top"><ArrowUp size={19}/></a></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.jobTitle, sameAs: [profile.github, profile.linkedin].filter(Boolean), alumniOf: { '@type': 'CollegeOrUniversity', name: profile.institution } }).replace(/</g, '\\u003c') }}/>
  </>;
}
