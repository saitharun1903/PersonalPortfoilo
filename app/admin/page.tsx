import Link from 'next/link';
import type { Metadata } from 'next';
import { defaultContent } from '../../data/default-content';
import { contentSchema } from '../../lib/content-schema';
import { backendConfigured, ownerDatabase } from '../../lib/supabase';
import Login from './login';
import Editor from './editor';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Portfolio admin', robots: { index: false, follow: false }, alternates: { canonical: '/admin' } };
export default async function Admin() {
  if (!backendConfigured()) return <main className="admin-login"><Link className="wordmark" href="/">Sai Tharun Reddy<span>.</span></Link><div className="login-card"><p className="section-label">One-time setup</p><h1>Connect your <em>portfolio.</em></h1><p>The admin is ready for Supabase. Connect your project to enable secure login, file uploads, and persistent edits.</p><ol><li>Create your owner account in Supabase Authentication.</li><li>Run the provided <code>supabase/setup.sql</code> in SQL Editor.</li><li>Add the Supabase URL and publishable key in Vercel, then redeploy.</li></ol><p>Follow the complete steps in <code>ADMIN-SETUP.md</code> in your repository.</p><Link className="text-link" href="/">Back to portfolio</Link></div></main>;
  let db;
  try { db = await ownerDatabase(); } catch { return <Login />; }
  const { data, error } = await db.from('portfolio_content').select('document, version, updated_at').eq('id', 1).maybeSingle();
  const parsed = data ? contentSchema.safeParse(data.document) : null;
  if (error || (parsed && !parsed.success)) return <main className="admin-login"><div className="login-card"><h1>Content unavailable</h1><p>We couldn’t safely load your saved portfolio. Check the Supabase setup and reload. Your published content has not been changed.</p><a className="text-link" href="/admin">Try again</a></div></main>;
  return <Editor initial={parsed?.success ? parsed.data : defaultContent} initialVersion={data?.version || 0} savedAt={data?.updated_at || null} />;
}
