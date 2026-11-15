'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Award, ChevronLeft, ChevronRight, Download, LayoutGrid, Pause, Play, X } from 'lucide-react';
import type { Certificate } from '../lib/content-schema';

const number = (index: number) => String(index + 1).padStart(2, '0');
const shortIssuer = (issuer: string) => issuer.split('·')[0].trim() || issuer;
// A readable file name for downloads, e.g. "Sai-Tharun-Reddy-Programming-using-Java.pdf".
const downloadName = (certificate: Certificate) => {
  const extension = certificate.pdf.split('?')[0].split('.').pop()?.toLowerCase() || 'pdf';
  const slug = certificate.title.normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `Sai-Tharun-Reddy-${slug || 'certificate'}.${extension}`;
};
const isPdf = (path: string) => /\.pdf(\?|$)/i.test(path);

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
        {certificate.pdf && <a className="cert-button" tabIndex={focus} href={certificate.pdf} download={downloadName(certificate)} aria-label={`Download ${certificate.title} certificate${isPdf(certificate.pdf) ? ' as PDF' : ''}`}><Download size={15} aria-hidden="true"/>{isPdf(certificate.pdf) ? 'PDF' : 'Download'}</a>}
        {certificate.verification && <a className="cert-button" tabIndex={focus} href={certificate.verification} target="_blank" rel="noreferrer">Verify <ArrowUpRight size={15}/></a>}
      </div>}
    </div>
  </div>;
}

// "View all": a gallery of every certificate in a modal. It is only built when opened,
// so its images load on demand rather than with the page.
function AllCertificates({ certificates }: { certificates: Certificate[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const open = () => { setShown(true); requestAnimationFrame(() => dialog.current?.showModal()); };
  return <>
    <button className="cert-control" onClick={open} aria-haspopup="dialog"><LayoutGrid size={15} aria-hidden="true"/>View all ({certificates.length})</button>
    <dialog ref={dialog} className="cert-dialog" aria-labelledby="all-certificates-title" onClose={() => setShown(false)} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      {shown && <>
        <header className="cert-dialog-head">
          <div><h2 id="all-certificates-title">All certificates</h2><p>{certificates.length} certificates and badges. Open one or download it as a PDF.</p></div>
          <button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close all certificates"><X size={20}/></button>
        </header>
        <ul className="cert-grid">
          {certificates.map((certificate, index) => <li className="cert-grid-item" key={index}>
            <div className="cert-grid-media">{certificate.image
              ? <Image src={certificate.image} alt={`${certificate.title} certificate`} width={1000} height={760} unoptimized={certificate.image.startsWith('https:')} sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 340px"/>
              : <Award size={44} strokeWidth={1.2} aria-hidden="true"/>}</div>
            <div className="cert-grid-copy">
              <p className="cert-grid-issuer">{certificate.issuer}</p>
              <h3>{certificate.title}</h3>
              {certificate.date && <p className="cert-grid-date">{certificate.date}</p>}
              <div className="cert-grid-actions">
                {certificate.pdf && <a className="cert-button primary" href={certificate.pdf} target="_blank" rel="noreferrer">View</a>}
                {certificate.pdf && <a className="cert-button" href={certificate.pdf} download={downloadName(certificate)} aria-label={`Download ${certificate.title} certificate${isPdf(certificate.pdf) ? ' as PDF' : ''}`}><Download size={15} aria-hidden="true"/>{isPdf(certificate.pdf) ? 'PDF' : 'Download'}</a>}
                {certificate.verification && <a className="cert-button" href={certificate.verification} target="_blank" rel="noreferrer" aria-label={`Verify ${certificate.title}`}>Verify <ArrowUpRight size={15}/></a>}
              </div>
            </div>
          </li>)}
        </ul>
      </>}
    </dialog>
  </>;
}

const GAP = 16;
const SPEED = 50; // pixels per second
const RESUME_AFTER = 2500; // ms after the visitor stops scrolling

export default function Certifications({ certificates }: { certificates: Certificate[] }) {
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  // Live values for the animation loop, kept in refs so the loop never restarts.
  const live = useRef({ paused: false, open: false, visible: true, hovering: false, holdUntil: 0 });
  useEffect(() => { live.current.paused = paused; live.current.open = Boolean(open); }, [paused, open]);
  // Wait before resuming; a later, shorter wait never cuts an earlier, longer one short.
  const hold = (ms = RESUME_AFTER) => { live.current.holdUntil = Math.max(live.current.holdUntil, performance.now() + ms); };

  // Auto-scroll by moving the real scroll position, so swiping, trackpads, the wheel, keys and
  // dragging all work at any time. The strip holds three copies of the set and jumps by one set
  // when it nears either end, so it loops forever in both directions.
  useEffect(() => {
    const element = viewport.current;
    const section = root.current;
    if (!element || !section) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const setWidth = () => certificates.length * ((parseFloat(getComputedStyle(element).getPropertyValue('--card-w')) || 300) + GAP);
    let position = 0;
    let frame = 0;
    let last = 0;
    let settle = 0;
    const wrap = () => {
      if (reduce.matches) return;
      const width = setWidth();
      if (element.scrollLeft < width * 0.5) element.scrollLeft += width;
      else if (element.scrollLeft > width * 1.5) element.scrollLeft -= width;
      position = element.scrollLeft;
    };
    const tick = (time: number) => {
      const step = Math.min((time - (last || time)) / 1000, 0.05);
      last = time;
      const state = live.current;
      if (!reduce.matches && state.visible && !state.paused && !state.open && !state.hovering && time > state.holdUntil) {
        position += SPEED * step;
        element.scrollLeft = position;
        if (position > setWidth() * 1.5) wrap();
      }
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      // A scroll the loop did not make is the visitor's: follow it and wait before resuming.
      if (Math.abs(element.scrollLeft - position) > 2) { position = element.scrollLeft; hold(); }
      clearTimeout(settle);
      settle = window.setTimeout(wrap, 140);
    };
    const visibility = new IntersectionObserver(([entry]) => { live.current.visible = entry.isIntersecting; }, { rootMargin: '100px 0px' });
    visibility.observe(section);
    const start = () => { element.scrollLeft = reduce.matches ? 0 : setWidth(); position = element.scrollLeft; };
    start();
    const resize = new ResizeObserver(wrap);
    resize.observe(element);
    element.addEventListener('scroll', onScroll, { passive: true });
    reduce.addEventListener('change', start);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); clearTimeout(settle); visibility.disconnect(); resize.disconnect(); element.removeEventListener('scroll', onScroll); reduce.removeEventListener('change', start); };
  }, [certificates.length]);

  // Mouse users can drag the strip; a drag does not count as a click on a card.
  const dragState = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('a, .cert-info button')) return;
    dragState.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
    hold();
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state) return;
    const distance = event.clientX - state.x;
    if (!state.moved && Math.abs(distance) > 6) { state.moved = true; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }
    if (state.moved) { event.currentTarget.scrollLeft = state.left - distance; hold(); }
  };
  const endDrag = () => { if (dragState.current?.moved) setTimeout(() => setDragging(false), 0); dragState.current = null; };
  const scrollByCards = (direction: 1 | -1) => {
    const element = viewport.current;
    if (!element) return;
    hold(RESUME_AFTER + 800);
    const card = (parseFloat(getComputedStyle(element).getPropertyValue('--card-w')) || 300) + GAP;
    element.scrollBy({ left: direction * card * (element.clientWidth > 900 ? 2 : 1), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

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
  // Three copies of the set (more on very wide screens) so the loop never shows a gap.
  const copies = Math.max(3, Math.ceil(2400 / (certificates.length * 316)) + 2);
  const total = number(certificates.length - 1);
  const card = (certificate: Certificate, index: number, key: string, clone = false) =>
    <ReelCard certificate={certificate} index={index} total={total} clone={clone} open={open === key} onToggle={() => { if (!dragging) setOpen(current => current === key ? null : key); }}/>;

  return <div className="cert-showcase" ref={root}>
    <div className="cert-toolbar"><p>Scroll, swipe or drag to browse. Hover over or tap a certificate for details.</p><div className="cert-controls">
      <button type="button" className="cert-control cert-arrow" onClick={() => scrollByCards(-1)} aria-label="Previous certificates"><ChevronLeft size={18}/></button>
      <button type="button" className="cert-control cert-arrow" onClick={() => scrollByCards(1)} aria-label="Next certificates"><ChevronRight size={18}/></button>
      <AllCertificates certificates={certificates}/>
      <button className="cert-control" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>}{paused ? 'Play' : 'Pause'}</button>
    </div></div>
    <div className="cert-viewport" ref={viewport} role="region" aria-label="Certificates" tabIndex={0} data-dragging={dragging || undefined}
      onPointerEnter={event => { if (event.pointerType === 'mouse') live.current.hovering = true; }}
      onPointerLeave={() => { live.current.hovering = false; hold(600); }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
      onWheel={event => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) hold(); }}
      onTouchStart={() => hold()} onKeyDown={() => hold()} onFocus={() => hold()}>
      <ul className="cert-track">
        {certificates.map((certificate, index) => <li className="certificate-card" key={index} aria-labelledby={`certificate-${index}`}>{card(certificate, index, `0-${index}`)}</li>)}
        {Array.from({ length: copies - 1 }, (_, copy) => certificates.map((certificate, index) => <li className="cert-clone" aria-hidden="true" key={`${copy + 1}-${index}`}>{card(certificate, index, `${copy + 1}-${index}`, true)}</li>))}
      </ul>
    </div>
  </div>;
}
