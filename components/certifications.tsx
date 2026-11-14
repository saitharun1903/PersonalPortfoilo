import Image from 'next/image';
import type { Certificate } from '../lib/content-schema';
export default function Certifications({ certificates }: { certificates: Certificate[] }) {
  return <ul className="certificate-grid">{certificates.map((certificate, index) => <li className="certificate-card" key={index}>
    <div className="certificate-copy"><h3>{certificate.title}</h3><p className="certificate-issuer">{[certificate.issuer, certificate.date].filter(Boolean).join(' · ')}</p>{certificate.description && <p>{certificate.description}</p>}{(certificate.pdf || certificate.verification) && <p className="certificate-actions">{certificate.pdf && <a className="text-link" href={certificate.pdf} target="_blank" rel="noreferrer">View certificate</a>}{certificate.verification && <a className="text-link" href={certificate.verification} target="_blank" rel="noreferrer">Verify</a>}</p>}</div>
    {certificate.image && <Image className="certificate-image" src={certificate.image} alt={`${certificate.title} certificate`} width={700} height={480} unoptimized={certificate.image.startsWith('https:')} sizes="160px"/>}
  </li>)}</ul>;
}
