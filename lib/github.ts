export type Repository = { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number };
export async function getRepositories(): Promise<Repository[]> {
  try { const response=await fetch('https://api.github.com/users/saitharun1903/repos?per_page=100',{next:{revalidate:3600},signal:AbortSignal.timeout(5000),headers:{Accept:'application/vnd.github+json'}}); if(!response.ok)return [];const all:Repository[]=await response.json();return ['WriteCodeProof','Elevate','Student-CRUD-operations'].map(n=>all.find(r=>r.name===n)).filter((r):r is Repository=>Boolean(r)); }catch{return [];}
}
