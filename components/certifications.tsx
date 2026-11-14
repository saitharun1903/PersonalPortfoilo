'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Award, Pause, Play, X } from 'lucide-react';
import type { Certificate } from '../lib/content-schema';

const number = (index: number) => String(index + 1).padStart(2, '0');
const shortIssuer = (issuer: string) => issuer.split('·')[0].trim() || issuer;

function Cover({ certificate }: { certificate: Certificate }) {
  // The whole certificate stays visible, framed between the badge and the name panel.
  if (certificate.image) return <div className="cert-cover cert-frame"><Image src={certificate.image} alt={`${certificate.title} certificate`} width={1000} height={760} loading="eager" unoptimized={certificate.image.startsWith('https:')} sizes="(max-width: 700px) 240px, 280px"/></div>;
  return <div className="cert-cover cert-poster" aria-hidden="true"><Award strokeWidth={1.1}/><span>{certificate.title}</span></div>;
}

// One card in the reel. On devices that can hover it widens on hover; elsewhere a tap opens it.
// The details panel keeps a fixed size and is only revealed, so nothing reflows while the card grows.
function ReelCard({ certificate, index, total, open, onToggle, clone }: { certificate: Certificate; index: number; total: string; open: boolean; onToggle: () => void; clone?: boolean }) {
  const focus = clone ? -1 : undefined;
  const id = clone ? undefined : `certificate-${index}`;
  return <div className="cert-reel-card" data-open={open || undefined}>
    <div className="cert-face">
      <Cover certificate={certificate}/>
      <span className="cert-badge">{shortIssuer(certificate.issuer)}</span>
      <div className="cert-panel">
        <h3 id={id}>{certificate.title}</h3>
        {certificate.description && <p>{certificate.description}</p>}
        <div className="cert-panel-foot"><span>{certificate.date || number(index)}</span><span>Details</span></div>
      </div>
      <button className="cert-open" tabIndex={focus} onClick={onToggle} aria-expanded={open} aria-label={`${open ? 'Close' : 'Open'} ${certificate.title}`}/>
    </div>
    <div className="cert-info">
      <button className="cert-close" tabIndex={focus} onClick={onToggle} aria-label={`Close ${certificate.title}`}><X size={18}/></button>
      <p className="cert-kicker">Certificate · {shortIssuer(certificate.issuer)}</p>
      <p className="cert-title">{certificate.title}</p>
      <p className="cert-issuer">{certificate.issuer}</p>
      <dl className="cert-stats"><div><dt>Issued</dt><dd>{certificate.date || 'Not dated'}</dd></div><div><dt>Number</dt><dd>{number(index)} / {total}</dd></div></dl>
      {certificate.description && <p className="cert-description">{certificate.description}</p>}
      {(certificate.pdf || certificate.verification) && <div className="cert-actions">
        {certificate.pdf && <a className="cert-button primary" tabIndex={focus} href={certificate.pdf} target="_blank" rel="noreferrer">View certificate</a>}
        {certificate.verification && <a className="cert-button" tabIndex={focus} href={certificate.verification} target="_blank" rel="noreferrer">Verify <ArrowUpRight size={15}/></a>}
      </div>}
    </div>
  </div>;
}

export default function Certifications({ certificates }: { certificates: Certificate[] }) {
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // The reel only animates while it is on screen.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // A tapped card closes again when the visitor taps elsewhere or presses Escape.
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!(event.target as Element).closest('.cert-reel-card[data-open]')) setOpen(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  if (certificates.length === 0) return null;
  // Enough copies of the set that the reel never shows a gap on wide screens.
  const copies = Math.max(2, Math.ceil(2200 / (certificates.length * 316)) + 1);
  const total = number(certificates.length - 1);
  const card = (certificate: Certificate, index: number, key: string, clone = false) =>
    <ReelCard certificate={certificate} index={index} total={total} clone={clone} open={open === key} onToggle={() => setOpen(current => current === key ? null : key)}/>;

  return <div className="cert-showcase" ref={root}>
    <div className="cert-toolbar"><p>Hover over or tap a certificate to see the details.</p><button className="cert-control" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>}{paused ? 'Play' : 'Pause'}</button></div>
    <div className="cert-viewport" role="region" aria-label="Certificates" tabIndex={0}>
      <ul className="cert-track" data-paused={paused || open || !visible ? true : undefined} style={{ '--count': certificates.length, '--duration': `${certificates.length * 6}s` } as React.CSSProperties}>
        {certificates.map((certificate, index) => <li className="certificate-card" key={index} aria-labelledby={`certificate-${index}`}>{card(certificate, index, `0-${index}`)}</li>)}
        {Array.from({ length: copies - 1 }, (_, copy) => certificates.map((certificate, index) => <li className="cert-clone" aria-hidden="true" key={`${copy + 1}-${index}`}>{card(certificate, index, `${copy + 1}-${index}`, true)}</li>))}
      </ul>
    </div>
  </div>;
}
