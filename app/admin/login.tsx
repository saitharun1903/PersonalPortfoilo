'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { signIn } from './actions';
export default function Login() {
  const [state, action, pending] = useActionState(signIn, { error: '' });
  return <main className="admin-login"><Link className="wordmark" href="/">Sai Tharun Reddy<span>.</span></Link><div className="login-card"><LockKeyhole size={30} /><p className="section-label">Your portfolio, your space</p><h1>Welcome <em>back.</em></h1><p>Sign in to update your work and publish changes.</p><form action={action}><label>Email<input type="email" name="email" autoComplete="username" defaultValue="saitharunreddy@writecode.in" required /></label><label>Password<input type="password" name="password" autoComplete="current-password" required maxLength={256} /></label>{state.error && <p role="alert" className="admin-error">{state.error}</p>}<button className="button primary" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}<ArrowRight size={18}/></button></form><p className="admin-hint">Owner access only. Password recovery is available through your Supabase dashboard.</p></div><Link className="text-link" href="/">Back to portfolio</Link></main>;
}
