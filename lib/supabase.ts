import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function backendConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
export function publicDatabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(8000) }) },
  });
}
export async function sessionDatabase() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => { try { values.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* Server component: proxy refreshes the session. */ } },
    },
  });
}
export async function ownerDatabase() {
  if (!backendConfigured()) throw new Error('Supabase has not been connected yet.');
  const db = await sessionDatabase();
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== 'saitharunreddy@writecode.in') throw new Error('Please sign in with your owner account.');
  const { data: allowed, error: permissionError } = await db.rpc('is_portfolio_owner');
  if (permissionError || allowed !== true) throw new Error('This account does not have portfolio editing access.');
  return db;
}
