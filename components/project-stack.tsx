'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Braces, Dumbbell, MessagesSquare } from 'lucide-react';
import { projects } from '../data/portfolio';
import { ProjectDetails } from './interactions';

export default function ProjectStack() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add('(min-width: 768px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)', () => {
        const element = root.current!;
        const panels = Array.from(element.querySelectorAll<HTMLElement>('.stack-panel'));
        const cards = panels.map((panel) => panel.querySelector<HTMLElement>('.project-card')!);
        panels.forEach((panel, index) => {
          if (index === panels.length - 1) return;
          ScrollTrigger.create({ trigger: panel, start: 'top top', endTrigger: panels[panels.length - 1], end: 'top top', pin: true, pinSpacing: false, anticipatePin: 1, invalidateOnRefresh: true });
          gsap.to(cards[index], {
            scale: .94, y: -18, rotate: index % 2 === 0 ? -1 : 1, ease: 'none',
            scrollTrigger: { trigger: panels[index + 1], start: 'top 85%', end: 'top top', scrub: true, invalidateOnRefresh: true },
          });
        });
        element.dataset.stacking = 'true';
        ScrollTrigger.refresh();
        return () => { delete element.dataset.stacking; };
      });
      media.add('(min-width: 360px) and (max-width: 767px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)', () => {
        const element = root.current!;
        const panels = Array.from(element.querySelectorAll<HTMLElement>('.stack-panel'));
        // Native sticky keeps touch scrolling direct. Only overlap cards that fit in full.
        const updateFit = () => {
          if (panels.every((panel) => panel.offsetHeight < window.innerHeight - 125)) {
            element.dataset.mobileStacking = 'true';
          } else {
            delete element.dataset.mobileStacking;
          }
        };
        const observer = new ResizeObserver(updateFit);
        panels.forEach((panel) => observer.observe(panel));
        window.addEventListener('resize', updateFit);
        updateFit();
        return () => {
          observer.disconnect();
          window.removeEventListener('resize', updateFit);
          delete element.dataset.mobileStacking;
        };
      });
      dispose = () => media.revert();
    }
    setup();
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return <div className="project-stack" ref={root}>
    {projects.map((project, index) => <div className="stack-panel" key={project.title} style={{ zIndex: index + 1 }}>
      <article className={`project-card card-${project.color}`} aria-labelledby={`project-${index}`}>
        <div className="project-card-top"><span>{project.category}</span><span className="project-count">{String(index + 1).padStart(2, '0')} <span>/ 04</span></span></div>
        <div className="project-card-body">
          <div className="project-copy"><h3 id={`project-${index}`}>{project.title}<span>.</span></h3><p className="project-statement">{project.description}</p><p className="project-description">{project.detail}</p>
            <div className="tags">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
            <div className="project-actions"><ProjectDetails index={index} />{project.live && <a className="round-link" aria-label={`Visit ${project.title} website`} href={project.live} target="_blank" rel="noreferrer"><ArrowUpRight size={22} /></a>}</div>
          </div>
          <div className={`project-art art-${project.color}`}>
            {project.image ? <a className="screenshot-link" href={project.live!} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
              <div className="browser-bar"><span aria-hidden="true"><i /><i /><i /></span><span>{project.title === 'WriteCode' ? 'writecode.in' : 'Elevate'}</span><ArrowUpRight size={12} /></div>
              <Image src={project.image} alt={project.imageAlt!} width={1440} height={1000} sizes="(max-width: 767px) 90vw, 55vw" className="project-screenshot" />
            </a> : index === 2 ? <div className="mentivox-cover" aria-label="Mentivox project cover"><MessagesSquare size={72} strokeWidth={1.2} /><p>Let’s<br/><em>talk.</em></p><span>Mentivox</span></div> : <div className="gym-cover" aria-label="Gym Nexus project cover"><div className="gym-type">GYM<br/><span>NEXUS</span></div><Dumbbell size={145} strokeWidth={1.4} /><span className="gym-language"><Braces size={17} /> Built with Java</span></div>}
          </div>
        </div>
      </article>
    </div>)}
  </div>;
}
