'use client';
import Link from 'next/link';
import { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, FileUp, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import type { PortfolioContent } from '../../lib/content-schema';
import { createUpload, deleteFile, listFiles, saveContent, signOut } from './actions';

const UploadBusy = createContext<(busy: boolean) => void>(() => {});
type Value = string | boolean | Value[] | { [key: string]: Value };
const labels: Record<string, string> = { copy: 'Page text & SEO', about: 'About paragraphs', profile: 'Profile & contact', sections: 'Section visibility', certifications: 'Certifications', repositories: 'GitHub links', imageAlt: 'Image description', pdf: 'Certificate PDF', verification: 'Verification URL', resume: 'Resume PDF', portrait: 'Profile photo', image: 'Cover image', seoTitle: 'Search title', seoDescription: 'Search description', live: 'Live website URL', github: 'GitHub URL', linkedin: 'LinkedIn URL' };
const label = (key: string) => labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());
const templates: Record<string, Value> = {
  projects: { title: 'New project', category: 'Project', description: '', detail: '', stack: [], github: '', live: '', image: '', imageAlt: '', highlights: [], color: 'blue' },
  skills: { title: 'New skill group', description: '', items: [] },
  experience: { kind: 'Experience', title: 'New experience', organization: '', description: '' },
  certifications: { title: 'New certification', issuer: 'Issuer', date: '', description: '', image: '', pdf: '', verification: '' },
  repositories: { title: 'New repository', description: '', url: '', language: '' },
};

function Fields({ value, onChange, path }: { value: Value; onChange: (value: Value) => void; path: string }) {
  const setUploadBusy = useContext(UploadBusy);
  const [uploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState('');
  const [removing, setRemoving] = useState<number | null>(null);
  const key = path.split('.').at(-1)!;
  if (typeof value === 'boolean') return <label className="admin-check"><input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} />{label(key)}</label>;
  if (typeof value === 'string') {
    const isAsset = ['image', 'portrait', 'pdf', 'resume'].includes(key);
    const multiline = /description|detail|hero$|note|paragraph|about\.\d|highlights\.\d/i.test(path);
    return <div className="admin-field"><label htmlFor={path}>{/^\d+$/.test(key) ? 'Text' : label(key)}</label>{key === 'color' ? <select id={path} value={value} onChange={event => onChange(event.target.value)}>{['blue', 'ice', 'paper', 'cloud'].map(color => <option key={color}>{color}</option>)}</select> : multiline ? <textarea id={path} rows={3} value={value} onChange={event => onChange(event.target.value)} /> : <input id={path} value={value} onChange={event => onChange(event.target.value)} type={key === 'email' ? 'email' : 'text'} />}
      {isAsset && <><label className="upload-control"><FileUp size={16} />{uploading ? 'Uploading…' : 'Upload file'}<input type="file" disabled={uploading} accept={['pdf', 'resume'].includes(key) ? 'application/pdf' : 'image/png,image/jpeg,image/webp'} onChange={event => {
        const file = event.target.files?.[0];
        if (!file) return;
        event.target.value = '';
        setUploadBusy(true); startUpload(async () => { setUploadError(''); try { const form = new FormData(); form.set('file', file); const result = await createUpload(form); if (result.error) setUploadError(result.error); else if (result.url) onChange(result.url); } catch { setUploadError('Upload failed. Please try again.'); } finally { setUploadBusy(false); } });
      }} /></label><small>Up to 3 MB. Uploads become public files. Publish changes to use this file on your page.</small>{value && <a className="text-link" href={value} target="_blank" rel="noreferrer">Open current file <ArrowUpRight size={14}/></a>}{uploadError && <p role="alert" className="admin-error">{uploadError}</p>}</>}
    </div>;
  }
  if (Array.isArray(value)) return <div className="admin-collection"><div className="collection-heading"><p>{value.length} {value.length === 1 ? 'item' : 'items'}</p><button className="button secondary" type="button" onClick={() => onChange([...value, structuredClone(templates[key] || '')])}><Plus size={16}/>Add {label(key).replace(/s$/, '').toLowerCase()}</button></div>{value.length === 0 && <p className="admin-empty">Nothing here yet. Add your first item above.</p>}{value.map((item, index) => <details className="editor-item" key={`${path}-${index}`} open={value.length === 1 || undefined}><summary><span className="item-number">{String(index + 1).padStart(2, '0')}</span><span>{typeof item === 'object' && item !== null && !Array.isArray(item) ? String(item.title || 'Untitled') : String(item || 'New item')}</span></summary><div className="item-body"><div className="item-toolbar"><button type="button" disabled={index === 0} aria-label={`Move item ${index + 1} up`} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}><ArrowUp size={16}/></button><button type="button" disabled={index === value.length - 1} aria-label={`Move item ${index + 1} down`} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}><ArrowDown size={16}/></button>{removing === index ? <><span>Remove this item?</span><button className="danger" type="button" onClick={() => { onChange(value.filter((_, i) => i !== index)); setRemoving(null); }}>Remove</button><button type="button" onClick={() => setRemoving(null)}>Keep</button></> : <button className="danger" type="button" onClick={() => setRemoving(index)}><Trash2 size={15}/>Remove</button>}</div><Fields value={item} path={`${path}.${index}`} onChange={next => onChange(value.map((old, i) => i === index ? next : old))}/></div></details>)}</div>;
  return <div className="admin-fields">{Object.entries(value).map(([key, child]) => <div key={key} className={Array.isArray(child) || typeof child === 'object' ? 'full-field' : ''}>{Array.isArray(child) && <h3>{label(key)}</h3>}<Fields path={`${path}.${key}`} value={child} onChange={next => onChange({ ...value, [key]: next })} /></div>)}</div>;
}

function MediaLibrary() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [message, setMessage] = useState('');
  const [busy, start] = useTransition();
  const [confirm, setConfirm] = useState('');
  const refresh = () => start(async () => { try { const result = await listFiles(); if (result.error) setMessage(result.error); else { setFiles(result.files || []); setMessage(result.files?.length ? '' : 'No uploaded files yet. Upload from a content field.'); } } catch { setMessage('Could not load files. Try again.'); } });
  return <div><p>Manage uploaded images and PDFs. Files used by the published page cannot be deleted here.</p><button type="button" className="button secondary" onClick={refresh} disabled={busy}>Load / refresh files</button><p role="status">{message}</p><div className="media-list">{files.map(file => <div key={file.name}><a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>{confirm === file.name ? <><button type="button" disabled={busy} onClick={() => start(async () => { try { const result = await deleteFile(file.name); if (result.error) setMessage(result.error); else { setFiles(files.filter(item => item.name !== file.name)); setMessage('File deleted.'); } } catch { setMessage('Delete failed. Try again.'); } setConfirm(''); })}>Confirm delete</button><button type="button" onClick={() => setConfirm('')}>Cancel</button></> : <button type="button" onClick={() => setConfirm(file.name)} aria-label={`Delete ${file.name}`}><Trash2 size={16}/></button>}</div>)}</div></div>;
}

export default function Editor({ initial, initialVersion, savedAt }: { initial: PortfolioContent; initialVersion: number; savedAt: string | null }) {
  const [content, setContent] = useState(initial);
  const [version, setVersion] = useState(initialVersion);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [active, setActive] = useState<keyof PortfolioContent | 'media'>('certifications');
  const [status, setStatus] = useState(savedAt ? 'Your published content is loaded.' : 'Publish once to store the current portfolio in your database.');
  const [error, setError] = useState('');
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pending, startSave] = useTransition();
  const dirty = JSON.stringify(content) !== baseline;
  useEffect(() => { if (!dirty) return; const warn = (event: BeforeUnloadEvent) => event.preventDefault(); window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  return <main className="admin-shell"><aside className="admin-sidebar"><Link className="wordmark" href="/">Sai Tharun Reddy<span>.</span></Link><p className="section-label">Portfolio studio</p><nav aria-label="Admin sections">{(['profile', 'copy', 'projects', 'certifications', 'about', 'skills', 'experience', 'repositories', 'sections', 'media'] as const).map(key => <button type="button" key={key} aria-current={active === key ? 'page' : undefined} disabled={uploadBusy || pending} onClick={() => setActive(key)}>{key === 'media' ? 'Media library' : label(key)}{Array.isArray(content[key as keyof PortfolioContent]) && <span>{(content[key as keyof PortfolioContent] as unknown[]).length}</span>}</button>)}</nav><Link className="text-link" href="/" target="_blank" rel="noreferrer">View live portfolio <ArrowUpRight size={16}/></Link><form action={signOut}><button className="text-link" disabled={pending} onClick={event => { if (dirty && !window.confirm('Leave without publishing your changes?')) event.preventDefault(); }}><LogOut size={16}/>Sign out</button></form></aside><section className="admin-workspace"><header className="admin-topbar"><div><p className="section-label">Make it yours</p><h1>{active === 'media' ? 'Media library' : label(active)}</h1><p className="admin-hint">{dirty ? 'You have unpublished changes.' : version ? 'All changes published.' : 'Ready for your first publish.'}</p></div><button className="button primary" disabled={pending || uploadBusy || (!dirty && version > 0)} onClick={() => startSave(async () => { setError(''); try { const result = await saveContent(content, version); if (result.error) setError(result.error); else if (result.version) { setVersion(result.version); setBaseline(JSON.stringify(content)); setStatus('Published. Your changes are now on the live portfolio.'); } } catch { setError('Could not connect. Your changes are still here; try publishing again.'); } })}>{pending ? <Check size={17}/> : <Save size={17}/>} {pending ? 'Publishing…' : 'Publish changes'}</button></header><p role="status" className="admin-status">{status}</p>{error && <p role="alert" className="admin-error">{error}</p>}<UploadBusy.Provider value={setUploadBusy}><fieldset disabled={pending || uploadBusy} className="editor-surface">{active === 'media' ? <MediaLibrary/> : <><p className="editor-intro">Edit below, then publish to update the live page. Remove and reorder items using their controls.</p><Fields key={active} path={active} value={content[active] as Value} onChange={value => setContent(current => ({ ...current, [active]: value }))}/></>}</fieldset></UploadBusy.Provider></section></main>;
}
