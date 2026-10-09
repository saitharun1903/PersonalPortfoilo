import { Mail } from 'lucide-react';
import type { PortfolioContent } from '../lib/content-schema';

export default function SocialLinks({ profile }: { profile: PortfolioContent['profile'] }) {
  return <div className="hero-socials social-icons">
    {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.63 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.11c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z"/></svg></a>}
    {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.96V9.2h2.97v9.55ZM6.44 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.31 10.85h-2.97V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.47V9.2h2.85v1.3h.04c.4-.75 1.37-1.55 2.82-1.55 3.02 0 3.57 1.99 3.57 4.57v5.23Z"/></svg></a>}
    {profile.leetcode && <a href={profile.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode" title="LeetCode"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 2-9 9a4.4 4.4 0 0 0 0 6.2l3.5 3.5a4.4 4.4 0 0 0 6.2 0l2-2"/><path d="m8.5 9 1.5-1.5a4.4 4.4 0 0 1 6.2 0l2 2M10 15h11"/></svg></a>}
    <a href={`mailto:${profile.email}`} aria-label="Email" title="Email"><Mail aria-hidden="true" strokeWidth={1.8}/></a>
  </div>;
}
