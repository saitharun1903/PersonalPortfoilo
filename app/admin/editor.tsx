'use client';
/* eslint-disable @next/next/no-img-element -- previews show uploaded files from any storage host. */
import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Copy, FileText, FileUp, Images, LogOut, Plus, RotateCcw, Save, Trash2, Wand2, X } from 'lucide-react';
import type { PortfolioContent } from '../../lib/content-schema';
import { createUpload, deleteFile, listFiles, saveContent, signOut } from './actions';
import { MAX_UPLOAD_BYTES, imageToPdf, isImageUrl, isPdfUrl, optimizeImage } from './media';

type Value = string | boolean | Value[] | { [key: string]: Value };
type Section = keyof PortfolioContent | 'media';
type StoredFile = { name: string; url: string };

const UploadBusy = createContext<(busy: boolean) => void>(() => {});

const labels: Record<string, string> = {
  brand: 'Display name', name: 'Full name', headline: 'Headline under your name', heroIntro: 'Greeting above your name', jobTitle: 'Job title',
  copy: 'Page text', about: 'About', profile: 'Profile', sections: 'Sections', certifications: 'Certificates', repositories: 'GitHub repos',
  projects: 'Projects', skills: 'Skills', experience: 'Experience', media: 'Media library',
  imageAlt: 'Image description (for screen readers)', pdf: 'Certificate PDF (download)', verification: 'Verification link', resume: 'Resume (PDF)',
  portrait: 'Profile photo', image: 'Image', seoTitle: 'Search engine title', seoDescription: 'Search engine description', live: 'Live website',
  github: 'GitHub', linkedin: 'LinkedIn', leetcode: 'LeetCode', email: 'Email', caption: 'Caption under your photo', detail: 'Description',
  description: 'Short description', stack: 'Technologies', highlights: 'Highlights (shown in the project popup)', items: 'Skills in this group',
  kind: 'Year or type', organization: 'Organisation', issuer: 'Issuer', date: 'Date', url: 'Link', language: 'Language', category: 'Category',
  qualification: 'Qualification', institution: 'Institution', location: 'Location',
};
const label = (key: string) => labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());

const guides: Record<Section, string> = {
  profile: 'Your name, photo, headline, contact links and resume. These appear in the introduction, navigation and footer.',
  copy: 'Section titles and short descriptions across the page, plus the title and description search engines show.',
  projects: 'Each project is a card in the stacking deck. Drag the order with the arrows; upload a screenshot to replace the title poster.',
  certifications: 'Certificates in the sliding reel and the View all gallery. Upload the certificate image and its PDF; if you only have an image, a PDF is made for you.',
  about: 'The first paragraph appears in the introduction; the rest appear in the About section.',
  skills: 'Each group is a row in the Skills section.',
  experience: 'Education and experience entries, newest first.',
  repositories: 'Repositories listed in the GitHub section.',
  sections: 'Turn whole sections of the page on or off.',
  media: 'Every file you have uploaded. Upload here, copy a link, or delete files the page no longer uses.',
};

const templates: Record<string, Value> = {
  projects: { title: 'New project', category: 'Project', description: '', detail: '', stack: [], github: '', live: '', image: '', imageAlt: '', highlights: [], color: 'blue' },
  skills: { title: 'New skill group', description: '', items: [] },
  experience: { kind: '2026', title: 'New experience', organization: '', description: '' },
  certifications: { title: 'New certificate', issuer: 'Issuer', date: '', description: '', image: '', pdf: '', verification: '' },
  repositories: { title: 'New repository', description: '', url: '', language: '' },
};

// Fields kept in saved content but not shown on the live page, so not worth editing.
const hidden = (path: string) => /(^|\.)color$/.test(path) || path === 'profile.note' || /^skills\.\d+\.description$/.test(path);
const assetKeys = ['image', 'portrait', 'pdf', 'resume'];
// A natural reading order for the profile form; other forms keep their saved order.
const fieldOrder: Record<string, string[]> = {
  profile: ['brand', 'name', 'jobTitle', 'headline', 'portrait', 'caption', 'qualification', 'institution', 'location', 'email', 'github', 'linkedin', 'leetcode', 'resume'],
};

async function uploadFile(file: File) {
  const form = new FormData();
  form.set('file', file);
  const result = await createUpload(form);
  if (result.error || !result.url) throw new Error(result.error || 'Upload failed. Please try again.');
  return result.url;
}

function FilePicker({ accept, onPick, onClose }: { accept: 'image' | 'pdf'; onPick: (url: string) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [files, setFiles] = useState<StoredFile[] | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    dialog.current?.showModal();
    listFiles().then(result => { if (result.error) setMessage(result.error); else setFiles((result.files || []).filter(file => accept === 'pdf' ? isPdfUrl(file.name) : isImageUrl(file.name))); }).catch(() => setMessage('Files could not be loaded.'));
  }, [accept]);
  return <dialog ref={dialog} className="admin-picker" onClose={onClose} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
    <header><h2>Choose {accept === 'pdf' ? 'a PDF' : 'an image'}</h2><button type="button" className="icon-button" onClick={() => dialog.current?.close()} aria-label="Close"><X size={18}/></button></header>
    {message && <p className="admin-error">{message}</p>}
    {!files && !message && <p className="admin-hint">Loading your files…</p>}
    {files && files.length === 0 && <p className="admin-empty">No {accept === 'pdf' ? 'PDFs' : 'images'} uploaded yet.</p>}
    {files && files.length > 0 && <ul className="media-grid">{files.map(file => <li key={file.name}><button type="button" className="media-tile" onClick={() => { onPick(file.url); dialog.current?.close(); }}>{isImageUrl(file.name) ? <img src={file.url} alt="" loading="lazy"/> : <span className="media-pdf"><FileText size={30}/>PDF</span>}<span className="media-name">{file.name}</span></button></li>)}</ul>}
  </dialog>;
}

function AssetField({ path, value, onChange, item, onItemChange }: { path: string; value: string; onChange: (value: string) => void; item?: Record<string, Value>; onItemChange?: (patch: Record<string, string>) => void }) {
  const setUploadBusy = useContext(UploadBusy);
  const [busy, startBusy] = useTransition();
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [picking, setPicking] = useState(false);
  const key = path.split('.').at(-1)!;
  const wantsPdf = key === 'pdf' || key === 'resume';
  const isCertificateImage = /^certifications\.\d+\.image$/.test(path);
  const isCertificatePdf = /^certifications\.\d+\.pdf$/.test(path);

  const run = (task: () => Promise<void>) => { setUploadBusy(true); startBusy(async () => { setError(''); setNote(''); try { await task(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Something went wrong. Please try again.'); } finally { setUploadBusy(false); } }); };

  const upload = (original: File) => run(async () => {
    const file = wantsPdf ? original : await optimizeImage(original);
    if (file.size > MAX_UPLOAD_BYTES) throw new Error(wantsPdf ? 'This PDF is larger than 4 MB. Compress it (for example with your PDF app’s “Reduce file size”) and try again.' : 'This image is still larger than 4 MB after shrinking. Try a smaller image.');
    const url = await uploadFile(file);
    onChange(url);
    const saved = file !== original ? ` Shrunk from ${(original.size / 1e6).toFixed(1)} MB to ${(file.size / 1e6).toFixed(1)} MB.` : '';
    // A certificate with only an image still gets a downloadable PDF.
    if (isCertificateImage && onItemChange && !String(item?.pdf || '')) {
      const pdfUrl = await uploadFile(await imageToPdf(file));
      onItemChange({ image: url, pdf: pdfUrl });
      setNote(`Uploaded, and a PDF was made for the download button.${saved}`);
    } else setNote(`Uploaded.${saved}`);
  });

  const pdfFromImage = () => run(async () => {
    const source = String(item?.image || '');
    if (!source) throw new Error('Upload the certificate image first.');
    const response = await fetch(source);
    if (!response.ok) throw new Error('The certificate image could not be read. Upload it again.');
    onChange(await uploadFile(await imageToPdf(await response.blob())));
    setNote('PDF created from the certificate image.');
  });

  return <div className="admin-field asset-field">
    <label htmlFor={path}>{label(key)}</label>
    <div className="asset-row">
      <div className="asset-preview" aria-hidden="true">{value && isImageUrl(value) ? <img src={value} alt=""/> : value ? <span className="media-pdf"><FileText size={26}/>{isPdfUrl(value) || value === '/resume' ? 'PDF' : 'File'}</span> : <span className="asset-empty">None</span>}</div>
      <div className="asset-actions">
        <label className="admin-button primary"><FileUp size={16}/>{busy ? 'Working…' : value ? 'Replace' : 'Upload'}<input type="file" disabled={busy} accept={wantsPdf ? 'application/pdf' : 'image/png,image/jpeg,image/webp'} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) upload(file); }}/></label>
        <button type="button" className="admin-button" disabled={busy} onClick={() => setPicking(true)}><Images size={16}/>From library</button>
        {isCertificatePdf && <button type="button" className="admin-button" disabled={busy || !item?.image} onClick={pdfFromImage}><Wand2 size={16}/>Make PDF from image</button>}
        {value && <a className="admin-button" href={value} target="_blank" rel="noreferrer"><ArrowUpRight size={16}/>Open</a>}
        {value && <button type="button" className="admin-button danger" disabled={busy} onClick={() => onChange('')}><X size={16}/>Remove</button>}
      </div>
    </div>
    <input id={path} className="asset-url" value={value} onChange={event => onChange(event.target.value)} placeholder="Or paste a link" aria-label={`${label(key)} link`}/>
    <small>{wantsPdf ? 'PDF up to 4 MB.' : 'PNG, JPEG or WebP. Large photos are shrunk automatically.'} Publish to put it on the live page.</small>
    {note && <p role="status" className="admin-note">{note}</p>}
    {error && <p role="alert" className="admin-error">{error}</p>}
    {picking && <FilePicker accept={wantsPdf ? 'pdf' : 'image'} onPick={onChange} onClose={() => setPicking(false)}/>}
  </div>;
}

function Fields({ value, onChange, path }: { value: Value; onChange: (value: Value) => void; path: string }) {
  const [removing, setRemoving] = useState<number | null>(null);
  const key = path.split('.').at(-1)!;
  if (typeof value === 'boolean') return <label className="admin-check"><input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} /><span>Show <strong>{label(key)}</strong></span></label>;
  if (typeof value === 'string') {
    const multiline = /description|detail|paragraph|about\.\d|highlights\.\d|headline/i.test(path);
    return <div className="admin-field"><label htmlFor={path}>{/^\d+$/.test(key) ? (path.startsWith('about') ? `Paragraph ${Number(key) + 1}` : 'Text') : label(key)}</label>{multiline ? <textarea id={path} rows={path.startsWith('about') ? 4 : 3} value={value} onChange={event => onChange(event.target.value)} /> : <input id={path} value={value} onChange={event => onChange(event.target.value)} type={key === 'email' ? 'email' : 'text'} />}</div>;
  }
  if (Array.isArray(value)) {
    const simple = value.every(item => typeof item === 'string');
    const move = (from: number, to: number) => { const next = [...value]; [next[from], next[to]] = [next[to], next[from]]; onChange(next); };
    return <div className="admin-collection">
      <div className="collection-heading"><p>{value.length} {value.length === 1 ? 'item' : 'items'}</p><button className="admin-button primary" type="button" onClick={() => onChange([...value, structuredClone(templates[key] ?? '')])}><Plus size={16}/>Add {simple ? 'item' : label(key).replace(/s$/, '').toLowerCase().replace(/^certificate$/, 'certificate')}</button></div>
      {value.length === 0 && <p className="admin-empty">Nothing here yet. Use “Add” to create the first one.</p>}
      {simple ? <div className="simple-list">{value.map((item, index) => <div className="simple-row" key={`${path}-${index}`}>
        <Fields value={item} path={`${path}.${index}`} onChange={next => onChange(value.map((old, i) => i === index ? next : old))}/>
        <div className="row-tools"><button type="button" className="icon-button" disabled={index === 0} aria-label={`Move ${index + 1} up`} onClick={() => move(index, index - 1)}><ArrowUp size={15}/></button><button type="button" className="icon-button" disabled={index === value.length - 1} aria-label={`Move ${index + 1} down`} onClick={() => move(index, index + 1)}><ArrowDown size={15}/></button><button type="button" className="icon-button danger" aria-label={`Remove ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}><Trash2 size={15}/></button></div>
      </div>)}</div>
      : value.map((item, index) => {
        const record = item as Record<string, Value>;
        const thumbnail = String(record.image || record.portrait || '');
        return <details className="editor-item" key={`${path}-${index}`}>
          <summary><span className="item-number">{String(index + 1).padStart(2, '0')}</span>{thumbnail && isImageUrl(thumbnail) ? <img className="item-thumb" src={thumbnail} alt=""/> : null}<span className="item-title">{String(record.title || 'Untitled')}<small>{String(record.issuer || record.category || record.organization || record.kind || '')}</small></span></summary>
          <div className="item-body">
            <div className="item-toolbar"><button type="button" className="admin-button" disabled={index === 0} onClick={() => move(index, index - 1)}><ArrowUp size={15}/>Up</button><button type="button" className="admin-button" disabled={index === value.length - 1} onClick={() => move(index, index + 1)}><ArrowDown size={15}/>Down</button>{removing === index ? <><span>Remove “{String(record.title || 'this item')}”?</span><button className="admin-button danger" type="button" onClick={() => { onChange(value.filter((_, i) => i !== index)); setRemoving(null); }}>Remove</button><button className="admin-button" type="button" onClick={() => setRemoving(null)}>Keep</button></> : <button className="admin-button danger" type="button" onClick={() => setRemoving(index)}><Trash2 size={15}/>Remove</button>}</div>
            <Fields value={item} path={`${path}.${index}`} onChange={next => onChange(value.map((old, i) => i === index ? next : old))}/>
          </div>
        </details>;
      })}
    </div>;
  }
  const preferred = fieldOrder[path] || [];
  const entries = Object.entries(value).filter(([child]) => !hidden(`${path}.${child}`)).sort(([a], [b]) => (preferred.indexOf(a) + 1 || 99) - (preferred.indexOf(b) + 1 || 99));
  return <div className="admin-fields">{entries.map(([child, childValue]) => {
    const childPath = `${path}.${child}`;
    const update = (next: Value) => onChange({ ...value, [child]: next });
    const full = Array.isArray(childValue) || assetKeys.includes(child) || /description|detail|headline/.test(child);
    return <div key={child} className={full ? 'full-field' : ''}>
      {Array.isArray(childValue) && <h3>{label(child)}</h3>}
      {typeof childValue === 'string' && assetKeys.includes(child)
        ? <AssetField path={childPath} value={childValue} onChange={update} item={value} onItemChange={patch => onChange({ ...value, ...patch })}/>
        : <Fields path={childPath} value={childValue} onChange={update} />}
    </div>;
  })}</div>;
}

function MediaLibrary() {
  const setUploadBusy = useContext(UploadBusy);
  const [files, setFiles] = useState<StoredFile[] | null>(null);
  const [message, setMessage] = useState('');
  const [busy, start] = useTransition();
  const [confirm, setConfirm] = useState('');
  const [copied, setCopied] = useState('');
  const refresh = useCallback(() => start(async () => { try { const result = await listFiles(); if (result.error) setMessage(result.error); else { setFiles(result.files || []); setMessage(''); } } catch { setMessage('Could not load files. Try again.'); } }), []);
  useEffect(() => { refresh(); }, [refresh]);
  const upload = (list: FileList) => { setUploadBusy(true); start(async () => { try { for (const original of Array.from(list)) { const file = original.type === 'application/pdf' ? original : await optimizeImage(original); if (file.size > MAX_UPLOAD_BYTES) { setMessage(`${original.name} is larger than 4 MB.`); continue; } await uploadFile(file); } setMessage('Uploaded. Use “From library” on any field to place it.'); const result = await listFiles(); if (!result.error) setFiles(result.files || []); } catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Upload failed.'); } finally { setUploadBusy(false); } }); };
  return <div className="media-library">
    <div className="collection-heading"><p>{files ? `${files.length} files` : 'Loading…'}</p><div className="media-tools"><label className="admin-button primary"><FileUp size={16}/>Upload files<input type="file" multiple accept="image/png,image/jpeg,image/webp,application/pdf" disabled={busy} onChange={event => { if (event.target.files?.length) upload(event.target.files); event.target.value = ''; }}/></label><button type="button" className="admin-button" onClick={refresh} disabled={busy}><RotateCcw size={16}/>Refresh</button></div></div>
    {message && <p role="status" className="admin-note">{message}</p>}
    {files && files.length === 0 && <p className="admin-empty">No uploaded files yet.</p>}
    {files && files.length > 0 && <ul className="media-grid">{files.map(file => <li key={file.name} className="media-card">
      <a className="media-tile" href={file.url} target="_blank" rel="noreferrer">{isImageUrl(file.name) ? <img src={file.url} alt="" loading="lazy"/> : <span className="media-pdf"><FileText size={30}/>PDF</span>}<span className="media-name">{file.name}</span></a>
      <div className="media-card-tools">
        <button type="button" className="icon-button" aria-label={`Copy link to ${file.name}`} onClick={() => { navigator.clipboard.writeText(file.url).then(() => { setCopied(file.name); setTimeout(() => setCopied(''), 1800); }).catch(() => setMessage('Copy failed. Open the file and copy its address instead.')); }}>{copied === file.name ? <Check size={15}/> : <Copy size={15}/>}</button>
        {confirm === file.name
          ? <><button type="button" className="admin-button danger" disabled={busy} onClick={() => start(async () => { try { const result = await deleteFile(file.name); if (result.error) setMessage(result.error); else { setFiles(current => (current || []).filter(item => item.name !== file.name)); setMessage('File deleted.'); } } catch { setMessage('Delete failed. Try again.'); } setConfirm(''); })}>Delete</button><button type="button" className="admin-button" onClick={() => setConfirm('')}>Keep</button></>
          : <button type="button" className="icon-button danger" onClick={() => setConfirm(file.name)} aria-label={`Delete ${file.name}`}><Trash2 size={15}/></button>}
      </div>
    </li>)}</ul>}
  </div>;
}

const order: Section[] = ['profile', 'projects', 'certifications', 'about', 'skills', 'experience', 'repositories', 'copy', 'sections', 'media'];

export default function Editor({ initial, saved, initialVersion, savedAt }: { initial: PortfolioContent; saved?: PortfolioContent; initialVersion: number; savedAt: string | null }) {
  const [content, setContent] = useState(initial);
  const [version, setVersion] = useState(initialVersion);
  // The baseline is what is stored; if the live page shows more than that, publishing saves it.
  const [baseline, setBaseline] = useState(JSON.stringify(saved ?? initial));
  const [active, setActive] = useState<Section>('profile');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pending, startSave] = useTransition();
  const dirty = JSON.stringify(content) !== baseline;
  const [syncedFromLive, setSyncedFromLive] = useState(() => JSON.stringify(initial) !== JSON.stringify(saved ?? initial));
  const [publishedAt, setPublishedAt] = useState(savedAt);

  const publish = useCallback(() => startSave(async () => {
    setError('');
    try {
      const result = await saveContent(content, version);
      if (result.error) setError(result.error);
      else if (result.version) { setVersion(result.version); setBaseline(JSON.stringify(content)); setSyncedFromLive(false); if (result.savedAt) setPublishedAt(result.savedAt); setStatus('Published. The live page now shows these changes.'); }
    } catch { setError('Could not connect. Your changes are still here; try publishing again.'); }
  }), [content, version]);

  useEffect(() => { if (!dirty) return; const warn = (event: BeforeUnloadEvent) => event.preventDefault(); window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); if (dirty && !pending && !uploadBusy) publish(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, pending, uploadBusy, publish]);

  const count = (key: Section) => key !== 'media' && Array.isArray(content[key]) ? (content[key] as unknown[]).length : null;
  const when = publishedAt ? new Date(publishedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
  const state = pending ? 'Publishing…' : dirty ? 'Unpublished changes' : version ? `Published${when ? ` ${when}` : ''}` : 'Not published yet';

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/" target="_blank" rel="noreferrer"><span className="monogram" aria-hidden="true">{content.profile.brand.trim().charAt(0) || 'S'}</span><span>{content.profile.brand}<small>Portfolio admin</small></span></Link>
      <nav aria-label="Admin sections">{order.map(key => <button type="button" key={key} aria-current={active === key ? 'page' : undefined} disabled={uploadBusy || pending} onClick={() => { setActive(key); window.scrollTo({ top: 0 }); }}>{label(key)}{count(key) !== null && <span>{count(key)}</span>}</button>)}</nav>
      <div className="sidebar-foot"><a className="admin-button" href="/" target="_blank" rel="noreferrer"><ArrowUpRight size={16}/>View live site</a><form action={signOut}><button className="admin-button" disabled={pending} onClick={event => { if (dirty && !window.confirm('Leave without publishing your changes?')) event.preventDefault(); }}><LogOut size={16}/>Sign out</button></form></div>
    </aside>
    <section className="admin-workspace">
      <header className="admin-topbar">
        <div><h1>{label(active)}</h1><p className="admin-guide">{guides[active]}</p></div>
        <div className="publish-bar"><span className="publish-state" data-dirty={dirty || undefined} suppressHydrationWarning>{state}</span>{dirty && <button type="button" className="admin-button" disabled={pending || uploadBusy} onClick={() => { if (window.confirm('Discard all unpublished changes?')) { setContent(JSON.parse(baseline)); setStatus('Changes discarded.'); } }}><RotateCcw size={16}/>Discard</button>}<button type="button" className="admin-button primary" disabled={pending || uploadBusy || !dirty} onClick={publish} title="Publish (Ctrl/Cmd + S)">{pending ? <Check size={17}/> : <Save size={17}/>}{pending ? 'Publishing…' : 'Publish'}</button></div>
      </header>
      {syncedFromLive && <p className="admin-note">This editor shows exactly what is on your live page, including updates that are not yet saved in your database (such as your ten certificates). Publish once to save them.</p>}
      {status && <p role="status" className="admin-status">{status}</p>}
      {error && <p role="alert" className="admin-error">{error}</p>}
      <UploadBusy.Provider value={setUploadBusy}><fieldset disabled={pending} className="editor-surface">
        {active === 'media' ? <MediaLibrary/> : <Fields key={active} path={active} value={content[active] as Value} onChange={value => setContent(current => ({ ...current, [active]: value }))}/>}
      </fieldset></UploadBusy.Provider>
    </section>
  </main>;
}
