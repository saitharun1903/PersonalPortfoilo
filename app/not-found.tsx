import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Signature from '../components/signature';
export default function NotFound() {
  return <main className="not-found container"><Link className="wordmark" href="/" aria-label="Sai Tharun Reddy home"><Signature className="signature-logo"/><span className="wordmark-name">Sai Tharun Reddy</span></Link><p>404</p><h1>This page took<br/>a wrong turn.</h1><Link className="button primary" href="/"><ArrowLeft size={17} /> Back to my portfolio</Link></main>;
}
