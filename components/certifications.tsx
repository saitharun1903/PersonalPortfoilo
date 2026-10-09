import Image from 'next/image';
import { ArrowUpRight, Award, FileText } from 'lucide-react';
import type { Certificate } from '../lib/content-schema';
export default function Certifications({ certificates }: { certificates: Certificate[] }) {
  return <div className="certificate-grid">{certificates.map((certificate, index) => <article className="certificate-card reveal" key={index}>
    <div className="certificate-cover">{certificate.image ? <Image src={certificate.image} alt={`${certificate.title} certificate`} width={700} height={480} unoptimized={certificate.image.startsWith('https:')} sizes="(max-width: 767px) 90vw, 45vw"/> : <div className="certificate-paper"><span>{certificate.issuer}</span><Award size={42} strokeWidth={1.2}/><p>{certificate.title}</p><div className="certificate-rule"/><small>{certificate.date || 'Certificate preview'}</small></div>}<span className="certificate-number">{String(index + 1).padStart(2, '0')}</span></div>
    <div className="certificate-copy"><p className="certificate-issuer">{certificate.issuer}</p><h3>{certificate.title}</h3>{certificate.date && <p className="certificate-date">Issued {certificate.date}</p>}<p>{certificate.description}</p><div className="certificate-actions">{certificate.pdf && <a className="text-link" href={certificate.pdf} target="_blank" rel="noreferrer"><FileText size={17}/>View certificate <ArrowUpRight size={16}/></a>}{certificate.verification && <a className="text-link" href={certificate.verification} target="_blank" rel="noreferrer">Verify credential <ArrowUpRight size={16}/></a>}</div></div>
  </article>)}</div>;
}
