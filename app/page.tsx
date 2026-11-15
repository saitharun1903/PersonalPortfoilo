import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { CopyEmail, Navigation, ResumeButton } from '../components/interactions';
import ProjectStack from '../components/project-stack';
import Certifications from '../components/certifications';
import SocialLinks from '../components/social-links';
import HeroBurst from '../components/hero-burst';
import { getContent } from '../lib/content';

// Served from the cache and rebuilt in the background at most every 5 minutes;
// publishing from the admin refreshes it immediately (see app/admin/actions.ts).
export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getContent();
  return { title: copy.seoTitle, description: copy.seoDescription, openGraph: { title: copy.seoTitle, description: copy.seoDescription, images: ['/opengraph-image'] } };
}

// Section titles read as plain headings, so a trailing full stop from the content is dropped.
const join = (...parts: string[]) => parts.map(part => part.trim()).filter(Boolean).join(' ').replace(/\.$/, '');

export default async function Home() {
  const { profile, copy, sections, about, projects, skills, experience, certifications, repositories } = await getContent();
  // A section appears (on the page and in the menu) only when it is switched on in the admin and has content,
  // so an empty list never leaves a bare heading behind.
  const show = {
    projects: sections.projects && projects.length > 0,
    about: sections.about && about.some(paragraph => paragraph.trim()),
    skills: sections.skills && skills.length > 0,
    experience: sections.experience && experience.length > 0,
    certifications: sections.certifications && certifications.length > 0,
    github: sections.github && (repositories.length > 0 || Boolean(profile.github)),
  };
  return <>
    <a className="skip-link" href="#main">Skip to content</a><Navigation profile={profile} sections={show} />
    <main id="main">
      <section className="hero container" id="home">
        <HeroBurst />
        <div className="hero-copy">
          <p className="hero-introduction">{copy.heroIntro}</p>
          <h1 className="hero-name">{profile.brand}</h1>
          <p className="hero-headline">{profile.headline}</p>
          {about[0] && <p className="hero-summary">{about[0]}</p>}
          <div className="hero-actions">{show.projects && <a className="text-link" href="#projects">See my projects</a>}<ResumeButton href={profile.resume}/></div>
          <SocialLinks profile={profile}/>
        </div>
        {profile.portrait && <figure className="hero-portrait"><Image src={profile.portrait} alt={profile.brand} width={460} height={460} unoptimized={profile.portrait.startsWith('https:')} preload sizes="(max-width: 700px) 120px, 240px" />{profile.caption && <figcaption>{profile.caption}</figcaption>}</figure>}
        {show.projects && <a className="hero-scroll" href="#projects" aria-label="Scroll to projects"><span aria-hidden="true"/></a>}
      </section>

      {show.projects && <section className="section projects-section container" id="projects">
        <header className="section-head"><h2>{join(copy.projectsTitle, copy.projectsAccent)}</h2>{copy.projectsDescription && <p>{copy.projectsDescription}</p>}</header>
        {projects.length > 0 && <ProjectStack projects={projects} email={profile.email}/>}
      </section>}

      {show.about && <section className="section container" id="about">
        <header className="section-head"><h2>{join(copy.aboutTitle, copy.aboutAccent)}</h2></header>
        <div className="section-body prose">{about.slice(1).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{about.length < 2 && about[0] && <p>{about[0]}</p>}<p className="aside">{[profile.qualification, profile.institution, profile.location].filter(Boolean).join(' · ')}</p></div>
      </section>}

      {show.skills && <section className="section container" id="skills">
        <header className="section-head"><h2>{join(copy.skillsTitle, copy.skillsAccent)}</h2>{copy.skillsDescription && <p>{copy.skillsDescription}</p>}</header>
        <dl className="section-body skill-list">{skills.map((skill, index) => <div className="skill-row" key={index}><dt>{skill.title}</dt><dd>{skill.items.join(', ')}</dd></div>)}</dl>
      </section>}

      {show.experience && <section className="section container" id="experience">
        <header className="section-head"><h2>{join(copy.experienceTitle, copy.experienceAccent)}</h2></header>
        <ul className="section-body entry-list">{experience.map((item, index) => <li className="entry" key={index}><span className="entry-when">{item.kind}</span><div><h3>{item.title}</h3><p className="entry-where">{item.organization}</p>{item.description && <p>{item.description}</p>}</div></li>)}</ul>
      </section>}

      {show.certifications && <section className="section wide-section container" id="certifications">
        <header className="section-head"><h2>{join(copy.certificatesTitle, copy.certificatesAccent)}</h2>{copy.certificatesDescription && <p>{copy.certificatesDescription}</p>}</header>
        <Certifications certificates={certifications}/>
      </section>}

      {show.github && <section className="section container" id="github">
        <header className="section-head"><h2>{join(copy.githubTitle, copy.githubAccent)}</h2>{profile.github && <p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer">github.com/{profile.github.split('/').filter(Boolean).pop()}</a></p>}</header>
        <ul className="section-body repo-list">{repositories.map((repository, index) => <li key={index}><a className="repo" href={repository.url} target="_blank" rel="noreferrer"><span className="repo-name">{repository.title}<ArrowUpRight size={15} aria-hidden="true"/></span><span className="repo-description">{repository.description}</span>{repository.language && <span className="repo-language">{repository.language}</span>}</a></li>)}</ul>
      </section>}

      <section className="section container contact" id="contact">
        <header className="section-head"><h2>{join(copy.contactTitle, copy.contactAccent)}</h2></header>
        <div className="section-body">
          <p className="contact-prompt">{copy.contactPrompt} The quickest way to reach me is email.</p>
          <p><a className="email-address" href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <div className="contact-actions"><CopyEmail email={profile.email}/><ResumeButton href={profile.resume}/></div>
        </div>
      </section>
    </main>
    <footer className="container"><span>© {new Date().getFullYear()} {profile.name}</span><div className="footer-links">{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}<a href="#home" aria-label="Back to top"><ArrowUp size={16}/></a></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.jobTitle, sameAs: [profile.github, profile.linkedin].filter(Boolean), alumniOf: { '@type': 'CollegeOrUniversity', name: profile.institution } }).replace(/</g, '\\u003c') }}/>
  </>;
}
