import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <main className="not-found container"><Link className="wordmark" href="/">Sai Tharun Reddy<span>.</span></Link><p>404</p><h1>This page took<br/>a wrong turn.</h1><Link className="button primary" href="/"><ArrowLeft size={17} /> Back to my portfolio</Link></main>;
}
