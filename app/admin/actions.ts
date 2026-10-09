'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { contentSchema } from '../../lib/content-schema';
import { backendConfigured, ownerDatabase, sessionDatabase } from '../../lib/supabase';

export async function signIn(_previous: { error: string }, form: FormData) {
  if (!backendConfigured()) return { error: 'Connect Supabase before signing in.' };
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  if (email !== 'saitharunreddy@writecode.in' || !password || password.length > 256) return { error: 'Unable to sign in. Check your owner email and password.' };
  const db = await sessionDatabase();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Unable to sign in. Check your credentials or try again later.' };
  try { await ownerDatabase(); } catch {
    await db.auth.signOut();
    return { error: 'This account is not authorised. Complete the owner setup in Supabase.' };
  }
  redirect('/admin');
}
export async function signOut() {
  const db = await sessionDatabase();
  await db.auth.signOut();
  redirect('/admin');
}
export async function saveContent(input: unknown, version: number) {
  try {
    const db = await ownerDatabase();
    const parsed = contentSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues.map(issue => `${issue.path.join(' → ')}: ${issue.message}`).slice(0, 5).join('\n') };
    if (!Number.isSafeInteger(version) || version < 0 || JSON.stringify(parsed.data).length > 400000) return { error: 'Invalid content size or version.' };
    const query = version === 0
      ? db.from('portfolio_content').insert({ id: 1, document: parsed.data })
      : db.from('portfolio_content').update({ document: parsed.data }).eq('id', 1).eq('version', version);
    const { data, error } = await query.select('version, updated_at').maybeSingle();
    if (error || !data) return { error: 'Save was not applied. Another tab may have updated the portfolio, or the connection failed. Keep your edits, then reload to get the current version.' };
    revalidatePath('/');
    revalidatePath('/admin');
    return { version: data.version as number, savedAt: data.updated_at as string };
  } catch (error) { return { error: error instanceof Error ? error.message : 'Unable to save. Your edits remain in this window.' }; }
}

export async function createUpload(form: FormData) {
  try {
    const db = await ownerDatabase();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0 || file.size > 3 * 1024 * 1024) return { error: 'Choose a PNG, JPEG, WebP, or PDF up to 3 MB.' };
    const bytes = Buffer.from(await file.arrayBuffer());
    const extension = bytes.subarray(0, 5).toString() === '%PDF-' ? 'pdf'
      : bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png'
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'jpg'
      : bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP' ? 'webp' : '';
    if (!extension) return { error: 'This file format is not supported.' };
    const contentType = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' }[extension]!;
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await db.storage.from('portfolio').upload(path, bytes, { contentType, upsert: false });
    if (error) return { error: 'Upload failed. Check your storage setup and try again.' };
    return { url: db.storage.from('portfolio').getPublicUrl(path).data.publicUrl, path };
  } catch { return { error: 'Sign in as the owner to upload files.' }; }
}

export async function listFiles() {
  try {
    const db = await ownerDatabase();
    const { data, error } = await db.storage.from('portfolio').list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) return { error: 'Files could not be loaded.' };
    return { files: data.map(file => ({ name: file.name, url: db.storage.from('portfolio').getPublicUrl(file.name).data.publicUrl })) };
  } catch { return { error: 'Sign in to view your files.' }; }
}
export async function deleteFile(name: string) {
  try {
    const db = await ownerDatabase();
    if (!/^[a-f0-9-]+\.(pdf|png|jpg|webp)$/.test(name)) return { error: 'Invalid file.' };
    const { data, error: readError } = await db.from('portfolio_content').select('document').eq('id', 1).maybeSingle();
    if (readError) return { error: 'Could not check published content. Try again.' };
    if (data && JSON.stringify(data.document).includes(name)) return { error: 'This file is used on the live page. Remove or replace its link and publish before deleting it.' };
    const { error } = await db.storage.from('portfolio').remove([name]);
    if (error) return { error: 'File could not be deleted.' };
    return { success: true };
  } catch { return { error: 'Sign in to manage files.' }; }
}
