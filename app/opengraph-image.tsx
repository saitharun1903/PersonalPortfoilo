import { ImageResponse } from 'next/og';
import { getContent } from '../lib/content';
export const alt = 'Sai Tharun Reddy | Java and Spring Boot developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';
export default async function Image() {
  const { profile, copy } = await getContent();
  return new ImageResponse(<div style={{ background: '#fbfaf7', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 75, color: '#1d1c1a', fontFamily: 'serif', borderBottom: '12px solid #a8401c' }}><div style={{ display: 'flex', fontSize: 25, color: '#66645e' }}>{copy.heroIntro}</div><div style={{ fontSize: 94, fontWeight: 500, letterSpacing: -3, marginTop: 60, display: 'flex', color: '#1d1c1a', lineHeight: 1.1 }}>{profile.brand}</div><div style={{ fontSize: 29, lineHeight: 1.7, marginTop: 40, display: 'flex', maxWidth: 1000 }}>{profile.headline}</div><div style={{ fontSize: 21, marginTop: 'auto', display: 'flex', color: '#66645e' }}>saitharunreddy.me</div></div>, size);
}
