import { SIGNATURE_LETTERS, SIGNATURE_SWASH, SIGNATURE_VIEWBOX } from '../lib/signature';

// The handwritten "Sai" logo. The letters follow the text colour and the swash uses the accent,
// so it adapts to the light and dark themes on its own.
export default function Signature({ className }: { className?: string }) {
  return <svg className={className} viewBox={SIGNATURE_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={SIGNATURE_LETTERS} fill="currentColor"/>
    <path d={SIGNATURE_SWASH} fill="none" stroke="var(--accent, #2b4acb)" strokeWidth="5" strokeLinecap="round"/>
  </svg>;
}
