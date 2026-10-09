import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowDown, ArrowUpRight, ArrowRight, ArrowUp, Braces, Database, GraduationCap, Laptop, Mail, MapPin, Wrench } from 'lucide-react';
import { CopyEmail, Navigation, ResumeButton } from '../components/interactions';
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
  return <>
    <a className="skip-link" href="#main">Skip to content</a><Navigation profile={profile} sections={sections} />
    <main id="main" className="recruiter-portfolio">
      <section className="hero container" id="home">
        <div className="hero-copy"><p className="hero-introduction">{profile.note} <span>/ {profile.jobTitle}</span></p><h1 className="hero-name">{nameParts.length > 0 && <span>{nameParts.join(' ')}</span>}<em>{surname}.</em></h1><p className="hero-description hero-headline">{profile.headline}</p>
          <div className="hero-actions">{sections.projects && projects.length > 0 && <a className="button primary" href="#projects">View My Work <ArrowDown size={17} /></a>}<ResumeButton href={profile.resume}/></div>
          <SocialLinks profile={profile}/>
        </div>
        <aside className="hero-portrait"><div className="portrait-card">{profile.portrait && <Image src={profile.portrait} alt={profile.brand} width={460} height={460} unoptimized={profile.portrait.startsWith('https:')} preload sizes="(max-width: 767px) 96px, 260px" />}</div><div className="hero-credentials"><p>{profile.qualification}</p><span>{profile.institution}</span><span><MapPin size={13}/>{profile.location}</span></div></aside>
      </section>
      {sections.projects && <section className="projects" id="projects"><div className="section-heading container reveal"><p className="section-label">{copy.projectsLabel}</p><h2>{copy.projectsTitle}<br/><em>{copy.projectsAccent}</em></h2><p>{copy.projectsDescription}</p></div>{projects.length > 0 && <ProjectStack projects={projects} email={profile.email}/>}</section>}
      {sections.about && <section className="about container reveal" id="about"><div className="about-heading"><p className="section-label">{copy.aboutLabel}</p><h2>{copy.aboutTitle} <em>{copy.aboutAccent}</em></h2></div><div className="about-content">{about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="about-footnotes"><span><MapPin size={16} />{profile.location}</span><span><GraduationCap size={18} />{profile.qualification}</span></div></div></section>}
      {sections.skills && <section className="skills container" id="skills"><div className="section-heading reveal"><h2>{copy.skillsTitle} <em>{copy.skillsAccent}</em></h2><p>{copy.skillsDescription}</p></div><div className="skills-grid">{skills.map((skill, index) => { const Icon = [Braces, Database, Laptop, Wrench][index % 4]; return <article className={`skill-card skill-${index % 4} reveal`} key={index}><div className="skill-icon"><Icon size={27} strokeWidth={1.6} /></div><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-items">{skill.items.map((item, i) => <span key={i}>{item}</span>)}</div>{index === 0 && <Braces className="skill-watermark" aria-hidden="true" />}</article>; })}</div></section>}
      {sections.experience && <section className="experience container reveal" id="experience"><div className="section-heading"><h2>{copy.experienceTitle} <em>{copy.experienceAccent}</em></h2></div>{experience.map((item, index) => <div className="experience-row" key={index}><div className="experience-kind">{item.kind}</div><div><h3>{item.title}</h3><p>{item.organization}</p>{item.description && <span>{item.description}</span>}</div><GraduationCap size={29} strokeWidth={1.4}/></div>)}</section>}
      {sections.certifications && <section className="certifications container" id="certifications"><div className="section-heading reveal"><p className="section-label">{copy.certificatesLabel}</p><h2>{copy.certificatesTitle}<br/><em>{copy.certificatesAccent}</em></h2><p>{copy.certificatesDescription}</p></div><Certifications certificates={certifications}/></section>}
      {sections.github && <section className="github-section container reveal" id="github"><div className="github-heading"><h2>{copy.githubTitle}<br/><em>{copy.githubAccent}</em></h2>{profile.github && <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">Explore my GitHub <ArrowUpRight size={18} /></a>}</div><div className="repo-list">{repositories.map((repository, index) => <a className="repo" key={index} href={repository.url} target="_blank" rel="noreferrer"><div><h3>{repository.title}</h3><p>{repository.description}</p><span>{repository.language || 'Source code'}</span></div><ArrowUpRight size={21} /></a>)}</div></section>}
      <section className="contact-section" id="contact"><div className="contact container reveal"><div className="contact-top"><Mail size={24} strokeWidth={1.5}/><span>{copy.contactPrompt}</span></div><h2>{copy.contactTitle} <em>{copy.contactAccent}</em><ArrowUpRight aria-hidden="true" /></h2><div className="contact-bottom"><div><a className="email-address" href={`mailto:${profile.email}`}>{profile.email}<ArrowRight size={20}/></a><CopyEmail email={profile.email}/></div><div className="contact-actions"><a className="button primary" href={`mailto:${profile.email}`}>Email Me <ArrowUpRight size={17}/></a><ResumeButton href={profile.resume}/></div></div></div></section>
    </main>
    <footer className="container"><div className="footer-name"><a className="wordmark" href="#home">{profile.brand}<span>.</span></a><span>© {new Date().getFullYear()} {profile.name}</span></div><div className="footer-links">{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13}/></a>}{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13}/></a>}<a href="#home" aria-label="Back to top"><ArrowUp size={19}/></a></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.jobTitle, sameAs: [profile.github, profile.linkedin].filter(Boolean), alumniOf: { '@type': 'CollegeOrUniversity', name: profile.institution } }).replace(/</g, '\\u003c') }}/>
  </>;
}
