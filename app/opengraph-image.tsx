import { ImageResponse } from 'next/og';
import { getContent } from '../lib/content';
import { SIGNATURE_LETTERS, SIGNATURE_SWASH, SIGNATURE_VIEWBOX } from '../lib/signature';
export const alt = 'Sai Tharun Reddy | Java and Spring Boot developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 300;
export default async function Image() {
  const { profile, copy } = await getContent();
  return new ImageResponse(<div style={{ background: '#f8f9fc', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 75, color: '#14213d', fontFamily: 'serif', borderBottom: '12px solid #2b4acb' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <svg width="146" height="92" viewBox={SIGNATURE_VIEWBOX}><path d={SIGNATURE_LETTERS} fill="#14213d"/><path d={SIGNATURE_SWASH} fill="none" stroke="#2b4acb" strokeWidth="5" strokeLinecap="round"/></svg>
      <div style={{ display: 'flex', fontSize: 25, color: '#566179' }}>{copy.heroIntro}</div>
    </div>
    <div style={{ fontSize: 94, fontWeight: 500, letterSpacing: -3, marginTop: 44, display: 'flex', color: '#14213d', lineHeight: 1.1 }}>{profile.brand}</div>
    <div style={{ fontSize: 29, lineHeight: 1.7, marginTop: 32, display: 'flex', maxWidth: 1000 }}>{profile.headline}</div>
    <div style={{ fontSize: 21, marginTop: 'auto', display: 'flex', color: '#566179' }}>saitharunreddy.me</div>
  </div>, size);
}
