import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../lib/content-schema';
import { ProjectDetails } from './interactions';

export default function ProjectStack({ projects, email }: { projects: Project[]; email: string }) {
  return <div className="project-stack container">
    {projects.map((project, index) => <article className="project-card" key={project.title} aria-labelledby={`project-${index}`}>
      <div className="project-copy"><p className="project-category">{project.category}</p><h3 id={`project-${index}`}>{project.title}</h3><p className="project-description">{project.detail}</p>
        <p className="project-technologies">{project.stack.join(' · ')}</p>
        <div className="project-actions"><ProjectDetails index={index} project={project} email={email}/>{project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={15}/></a>}{project.live && <a className="text-link" aria-label={`Visit ${project.title} website`} href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={15}/></a>}</div>
      </div>
      {project.image && <a className="project-image-link" href={project.live || project.image} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><Image src={project.image} alt={project.imageAlt || project.title} width={1440} height={1000} unoptimized={project.image.startsWith('https:')} sizes="(max-width: 767px) 90vw, 300px"/></a>}
    </article>)}
  </div>;
}
