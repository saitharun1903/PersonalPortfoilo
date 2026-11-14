import { ImageResponse } from 'next/og';
import { getContent } from '../lib/content';
export const alt = 'Sai Tharun Reddy | Java and Spring Boot developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';
export default async function Image() {
  const { profile, copy } = await getContent();
  return new ImageResponse(<div style={{ background: '#fdfcf9', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 75, color: '#14213d', fontFamily: 'serif', borderBottom: '12px solid #c2300f' }}><div style={{ display: 'flex', fontSize: 25, color: '#566179' }}>{copy.heroIntro}</div><div style={{ fontSize: 94, fontWeight: 500, letterSpacing: -3, marginTop: 60, display: 'flex', color: '#14213d', lineHeight: 1.1 }}>{profile.brand}</div><div style={{ fontSize: 29, lineHeight: 1.7, marginTop: 40, display: 'flex', maxWidth: 1000 }}>{profile.headline}</div><div style={{ fontSize: 21, marginTop: 'auto', display: 'flex', color: '#566179' }}>saitharunreddy.me</div></div>, size);
}
