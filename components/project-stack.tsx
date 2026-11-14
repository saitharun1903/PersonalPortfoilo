import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../lib/content-schema';
import { ProjectDetails } from './interactions';

export default function ProjectStack({ projects, email }: { projects: Project[]; email: string }) {
  return <div className="project-stack container">
    {projects.map((project, index) => <article className="project-card spot reveal" key={project.title} aria-labelledby={`project-${index}`}>
      <div className="project-copy"><p className="project-meta"><b>{String(index + 1).padStart(2, '0')}</b><span className="project-category">{project.category}</span></p><h3 id={`project-${index}`}>{project.title}</h3>{project.description && <p className="project-statement">{project.description}</p>}<p className="project-description">{project.detail}</p>
        <div className="tags">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
        <div className="project-actions"><ProjectDetails index={index} project={project} email={email}/>{project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={15}/></a>}{project.live && <a className="text-link" aria-label={`Visit ${project.title} website`} href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={15}/></a>}</div>
      </div>
      {project.image
        ? <a className="project-media" href={project.live || project.image} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><span className="project-window"><span className="window-bar" aria-hidden="true"><i/><i/><i/></span><Image src={project.image} alt={project.imageAlt || project.title} width={1440} height={1000} unoptimized={project.image.startsWith('https:')} sizes="(max-width: 860px) 92vw, 560px"/></span></a>
        : <div className="project-media" aria-hidden="true"><div className="project-cover"><span>{project.category}</span><p>{project.title}</p><small>{project.stack.slice(0, 3).join(' · ')}</small></div></div>}
    </article>)}
  </div>;
}
