import type { Metadata, Viewport } from 'next';
import { Newsreader, Public_Sans } from 'next/font/google';
import './globals.css';
import { siteUrl } from '../lib/site';
const sans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });
const serif = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Koppula Sai Tharun Reddy | Backend Developer',
  description: 'Hi, I’m Sai. A Computer Science student and backend developer working with Java and Spring Boot. Explore WriteCode, Elevate, and my other projects.',
  alternates: { canonical: siteUrl },
  openGraph: { title: 'Sai Tharun Reddy | Developer', description: 'Java, Spring Boot, and useful web applications. Get to know me and my work.', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image' },
};
// Colours the phone browser bar to match the page.
export const viewport: Viewport = { themeColor: '#f8f9fc' };
// Runs before first paint so the page never flashes the wrong theme. The admin always stays light.
const themeScript = `(function(){try{if(location.pathname.indexOf('/admin')===0)return;var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;if(t==='dark'){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#0c111d')}}catch(e){}})()`;
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning><body><script dangerouslySetInnerHTML={{ __html: themeScript }}/>{children}</body></html>;
}
