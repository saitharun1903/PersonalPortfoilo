import { readFile } from 'node:fs/promises';
import path from 'node:path';
export async function GET(){try{const file=await readFile(path.join(process.cwd(),'public','resume.pdf'));return new Response(file,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Sai-Tharun-Reddy-Resume.pdf"'}});}catch{return new Response('Resume is being updated. Please request a copy by email.',{status:404});}}
export async function HEAD(){try{await readFile(path.join(process.cwd(),'public','resume.pdf'));return new Response(null,{status:200});}catch{return new Response(null,{status:404});}}
