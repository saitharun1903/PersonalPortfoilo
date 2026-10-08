import { ImageResponse } from 'next/og';
export const alt = 'Sai Tharun Reddy | Java and Spring Boot developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ background: '#eef8ff', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 75, color: '#183246', fontFamily: 'sans-serif' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 25 }}><span style={{ fontWeight: 700 }}>sai.</span><span>Java · Spring Boot · Web applications</span></div><div style={{ fontSize: 112, fontWeight: 600, letterSpacing: -7, marginTop: 75, display: 'flex' }}>Hi, I’m <span style={{ color: '#126aab', marginLeft: 24 }}>Sai.</span></div><div style={{ fontSize: 95, letterSpacing: -6, display: 'flex' }}>I build software.</div><div style={{ fontSize: 22, marginTop: 55, display: 'flex', color: '#4c6475' }}>Koppula Sai Tharun Reddy</div></div>, size);
}
