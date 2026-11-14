'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Award, Pause, Play } from 'lucide-react';
import type { Certificate } from '../lib/content-schema';

const number = (index: number) => String(index + 1).padStart(2, '0');
const shortIssuer = (issuer: string) => issuer.split('·')[0].trim() || issuer;

function Cover({ certificate, sizes }: { certificate: Certificate; sizes: string }) {
  if (certificate.image) return <Image className="cert-cover" src={certificate.image} alt="" width={700} height={900} unoptimized={certificate.image.startsWith('https:')} sizes={sizes}/>;
  return <div className="cert-cover cert-poster" aria-hidden="true"><Award strokeWidth={1.1}/><span>{certificate.title}</span></div>;
}

// The reel card: a tall black-and-white cover with an issuer badge and a name panel.
function ReelCard({ certificate, index, onOpen }: { certificate: Certificate; index: number; onOpen?: () => void }) {
  return <div className="cert-reel-card">
    <Cover certificate={certificate} sizes="300px"/>
    <span className="cert-badge">{shortIssuer(certificate.issuer)}</span>
    <div className="cert-panel">
      <h3>{certificate.title}</h3>
      {certificate.description && <p>{certificate.description}</p>}
      <div className="cert-panel-foot"><span>{certificate.date || number(index)}</span><span>View details</span></div>
    </div>
    {onOpen && <button className="cert-open" onClick={onOpen} aria-label={`Open ${certificate.title}`}/>}
  </div>;
}

export default function Certifications({ certificates }: { certificates: Certificate[] }) {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  if (certificates.length === 0) return null;
  // Enough copies of the set that the reel never shows a gap on wide screens.
  const copies = Math.max(2, Math.ceil(2200 / (certificates.length * 316)) + 1);
  const total = number(certificates.length - 1);

  if (active !== null) return <div className="cert-showcase" data-mode="focus">
    <div className="cert-toolbar"><button className="cert-control" onClick={() => setActive(null)}><ArrowLeft size={16}/>Back to slideshow</button></div>
    <ul className="cert-accordion">
      {certificates.map((certificate, index) => <li className="certificate-card" data-active={index === active || undefined} key={index}>
        {index === active
          ? <article className="cert-detail" aria-labelledby={`certificate-${index}`}>
              <div className="cert-detail-media"><Cover certificate={certificate} sizes="(max-width: 700px) 80vw, 420px"/></div>
              <div className="cert-detail-copy">
                <p className="cert-kicker">Certificate · {shortIssuer(certificate.issuer)}</p>
                <h3 id={`certificate-${index}`}>{certificate.title}</h3>
                <p className="cert-issuer">{certificate.issuer}</p>
                <dl className="cert-stats"><div><dt>Issued</dt><dd>{certificate.date || 'Not dated'}</dd></div><div><dt>Number</dt><dd>{number(index)} / {total}</dd></div></dl>
                {certificate.description && <p className="cert-description">{certificate.description}</p>}
                {(certificate.pdf || certificate.verification) && <div className="cert-actions">
                  {certificate.pdf && <a className="cert-button primary" href={certificate.pdf} target="_blank" rel="noreferrer">View certificate</a>}
                  {certificate.verification && <a className="cert-button" href={certificate.verification} target="_blank" rel="noreferrer">Verify <ArrowUpRight size={15}/></a>}
                </div>}
              </div>
            </article>
          : <button className="cert-strip" onClick={() => setActive(index)} aria-label={`Show ${certificate.title}`}><Cover certificate={certificate} sizes="80px"/><span>{certificate.title}</span></button>}
      </li>)}
    </ul>
  </div>;

  return <div className="cert-showcase" data-mode="reel">
    <div className="cert-toolbar"><p>Click a certificate to see the details.</p><button className="cert-control" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>}{paused ? 'Play' : 'Pause'}</button></div>
    <div className="cert-viewport" role="region" aria-label="Certificates" tabIndex={0}>
      <ul className="cert-track" data-paused={paused || undefined} style={{ '--copies': copies, '--duration': `${certificates.length * copies * 5}s` } as React.CSSProperties}>
        {certificates.map((certificate, index) => <li className="certificate-card" key={index}><ReelCard certificate={certificate} index={index} onOpen={() => setActive(index)}/></li>)}
        {Array.from({ length: copies - 1 }, (_, copy) => certificates.map((certificate, index) => <li className="cert-clone" aria-hidden="true" key={`${copy}-${index}`}><ReelCard certificate={certificate} index={index}/></li>))}
      </ul>
    </div>
  </div>;
}
