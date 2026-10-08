'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Menu, X } from 'lucide-react';
import { profile, projects } from '../data/portfolio';

export function Navigation() {
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
    <a className="wordmark" href="#home" aria-label="Sai Tharun home">sai<span>.</span></a>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? 'nav-links open' : 'nav-links'}>
      {['About', 'Projects', 'Experience', 'Skills'].map((label) => <a key={label} href={`#${label.toLowerCase()}`} aria-current={active === label.toLowerCase() ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
      <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a>
      <a href="#contact" aria-current={active === 'contact' ? 'location' : undefined} onClick={() => setOpen(false)}>Contact</a>
    </nav>
    <ResumeButton compact />
    <button ref={toggle} className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>;
}

export function ResumeButton({ compact = false }: { compact?: boolean }) {
  return <a className={compact ? 'resume-link' : 'button secondary'} href="/resume" download="Sai-Tharun-Reddy-Resume.pdf">{compact ? 'Resume' : 'Download Resume'}<Download size={16} /></a>;
}

export function RevealObserver() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate([{ opacity: .5, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}

export function ProjectDetails({ index }: { index: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const project = projects[index];
  return <>
    <button className="text-link" onClick={() => ref.current?.showModal()}>Explore project <ArrowUpRight size={18} /></button>
    <dialog ref={ref} className="project-dialog" aria-labelledby={`dialog-title-${index}`} onClick={(event) => { if (event.target === ref.current) ref.current.close(); }}>
      <button className="dialog-close" aria-label="Close project" onClick={() => ref.current?.close()}><X /></button>
      <p className="dialog-category">{project.category}</p><h2 id={`dialog-title-${index}`}>{project.title}</h2><p>{project.detail}</p>
      <ul>{project.highlights.map((highlight) => <li key={highlight}><Check size={16} />{highlight}</li>)}</ul>
      <div className="tags">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
      <div className="dialog-actions">
        {project.live && <a className="button primary" href={project.live} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16} /></a>}
        {project.github ? <a className="text-link" href={project.github} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16} /></a> : <a className="text-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(project.title + ' project enquiry')}`}>Ask me about it <ArrowUpRight size={16} /></a>}
      </div>
    </dialog>
  </>;
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  return <button className="copy-email" onClick={async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); if (timeout.current) clearTimeout(timeout.current); timeout.current = setTimeout(() => setCopied(false), 2500); }
    catch { setFailed(true); }
  }}>{copied ? <Check size={16} /> : <Copy size={16} />}<span aria-live="polite">{copied ? 'Copied' : failed ? profile.email : 'Copy email'}</span></button>;
}
