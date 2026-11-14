import type { PortfolioContent } from '../lib/content-schema';

export default function SocialLinks({ profile }: { profile: PortfolioContent['profile'] }) {
  const links = [
    profile.github && { label: 'GitHub', href: profile.github },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin },
    profile.leetcode && { label: 'LeetCode', href: profile.leetcode },
    { label: 'Email', href: `mailto:${profile.email}` },
  ].filter(Boolean) as { label: string; href: string }[];
  return <ul className="hero-socials">{links.map(link => <li key={link.label}><a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">{link.label}</a></li>)}</ul>;
}
