'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Menu, X } from 'lucide-react';
import type { PortfolioContent, Project } from '../lib/content-schema';

export function Navigation({ profile, sections }: { profile: PortfolioContent['profile']; sections: PortfolioContent['sections'] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return <header className="navigation">
    <a className="wordmark" href="#home" aria-label={`${profile.brand} home`}>{profile.brand}<span>.</span></a>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? 'nav-links open' : 'nav-links'}>
      {(['About', 'Projects', 'Experience', 'Skills', 'Certifications'] as const).filter(label => sections[label.toLowerCase() as keyof typeof sections]).map((label) => <a key={label} href={`#${label.toLowerCase()}`} aria-current={active === label.toLowerCase() ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      <a href="#contact" aria-current={active === 'contact' ? 'location' : undefined} onClick={() => setOpen(false)}>Contact</a>
    </nav>
    <ResumeButton compact href={profile.resume} />
    <button ref={toggle} className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>;
}

export function ResumeButton({ compact = false, href = '/resume' }: { compact?: boolean; href?: string }) {
  if (!href) return null;
  return <a className={compact ? 'resume-link' : 'text-link resume-download'} href={href} download="Sai-Tharun-Reddy-Resume.pdf" target={href.startsWith('https:') ? '_blank' : undefined} rel="noreferrer">{compact ? 'Resume' : 'Download Resume'}<Download size={15} aria-hidden="true" /></a>;
}

// Project cards stick near the top one after another; each card shrinks and darkens as the next one covers it.
// Stacking is skipped when a card is taller than the screen or the visitor prefers reduced motion.
export function CardStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const cards = () => Array.from(stack.querySelectorAll<HTMLElement>(':scope > .project-card'));
    const offset = (index: number) => (innerWidth < 700 ? 12 : 24) + index * (innerWidth < 700 ? 10 : 16);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!stack.dataset.stacking) return;
      const list = cards();
      list.forEach((card, index) => {
        const next = list[index + 1];
        if (!next) return;
        const box = card.getBoundingClientRect();
        const cover = Math.min(Math.max((box.top + card.offsetHeight - next.getBoundingClientRect().top) / card.offsetHeight, 0), 1);
        card.style.setProperty('--cover', cover.toFixed(3));
      });
    };
    const layout = () => {
      const list = cards();
      list.forEach((card, index) => card.style.setProperty('--stick', `${offset(index)}px`));
      const fits = !reduce.matches && list.length > 1 && list.every((card, index) => card.offsetHeight + offset(index) + 16 <= innerHeight);
      if (fits) stack.dataset.stacking = 'true';
      else { delete stack.dataset.stacking; list.forEach(card => card.style.removeProperty('--cover')); }
      update();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(layout);
    cards().forEach(card => resize.observe(card));
    layout();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', layout);
    reduce.addEventListener('change', layout);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', layout);
      reduce.removeEventListener('change', layout);
    };
  }, []);
  return <div className="project-stack" ref={ref}>{children}</div>;
}

export function ProjectDetails({ index, project, email }: { index: number; project: Project; email: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return <>
    <button className="text-link" onClick={() => ref.current?.showModal()}>Explore project</button>
    <dialog ref={ref} className="project-dialog" aria-labelledby={`dialog-title-${index}`} onClick={(event) => { if (event.target === ref.current) ref.current.close(); }}>
      <button className="dialog-close" aria-label="Close project" onClick={() => ref.current?.close()}><X /></button>
      <p className="dialog-category">{project.category}</p><h2 id={`dialog-title-${index}`}>{project.title}</h2><p>{project.detail}</p>
      <ul>{project.highlights.map((highlight) => <li key={highlight}><Check size={16} />{highlight}</li>)}</ul>
      <div className="tags">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <div className="dialog-actions">
        {project.live && <a className="button primary" href={project.live} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16} /></a>}
        {project.github ? <a className="text-link" href={project.github} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16} /></a> : <a className="text-link" href={`mailto:${email}?subject=${encodeURIComponent(project.title + ' project enquiry')}`}>Ask me about it <ArrowUpRight size={16} /></a>}
      </div>
    </dialog>
  </>;
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  return <button className="copy-email" onClick={async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); if (timeout.current) clearTimeout(timeout.current); timeout.current = setTimeout(() => setCopied(false), 2500); }
    catch { setFailed(true); }
  }}>{copied ? <Check size={16} /> : <Copy size={16} />}<span aria-live="polite">{copied ? 'Copied' : failed ? email : 'Copy email'}</span></button>;
}
