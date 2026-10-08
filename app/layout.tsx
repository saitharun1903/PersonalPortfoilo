import type { Metadata } from 'next';
import { Manrope, Lora } from 'next/font/google';
import './globals.css';
import { siteUrl } from '../lib/site';
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const serif = Lora({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Koppula Sai Tharun Reddy | Backend Developer',
  description: 'Hi, I’m Sai. A Computer Science student and backend developer working with Java and Spring Boot. Explore WriteCode, Elevate, and my other projects.',
  alternates: { canonical: siteUrl },
  openGraph: { title: 'Sai Tharun Reddy | Developer', description: 'Java, Spring Boot, and useful web applications. Get to know me and my work.', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image' },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body>{children}</body></html>;
}
