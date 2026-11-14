import Image from 'next/image';
import type { Project } from '../lib/content-schema';
import { ProjectDetails } from './interactions';

export default function ProjectStack({ projects, email }: { projects: Project[]; email: string }) {
  return <div className="project-stack">
    {projects.map((project, index) => <article className="project-card" key={project.title} aria-labelledby={`project-${index}`}>
      <div className="project-head"><h3 id={`project-${index}`}>{project.title}</h3><span className="project-category">{project.category}</span></div>
      {project.description && <p className="project-statement">{project.description}</p>}
      <p className="project-description">{project.detail}</p>
      {project.stack.length > 0 && <p className="project-technologies">{project.stack.join(', ')}</p>}
      <div className="project-actions"><ProjectDetails index={index} project={project} email={email}/>{project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">Source code</a>}{project.live && <a className="text-link" aria-label={`Visit ${project.title} website`} href={project.live} target="_blank" rel="noreferrer">Live site</a>}</div>
      {project.image && <a className="project-image" href={project.live || project.image} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><Image src={project.image} alt={project.imageAlt || project.title} width={1440} height={1000} unoptimized={project.image.startsWith('https:')} sizes="(max-width: 860px) 92vw, 720px"/></a>}
    </article>)}
  </div>;
}
