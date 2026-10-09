import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

// Exercise the real migration with Postgres roles, using stand-ins only for
// Supabase's pre-existing auth/storage schemas. No cloud data is mutated.
const db = new PGlite();
await db.exec(`
  create role anon; create role authenticated;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.user_id', true), '')::uuid $$;
  grant usage on schema auth, public, storage to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key, bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant select, insert, update, delete on storage.objects to anon, authenticated;
  insert into auth.users values ('11111111-1111-4111-8111-111111111111', 'saitharunreddy@writecode.in', now());
`);
const migration = await readFile(new URL('../supabase/setup.sql', import.meta.url), 'utf8');
await db.exec(migration);
await db.exec(migration); // Re-running setup preserves content and policies.
const actAs = async (role, id = '') => db.exec(`reset role; set role ${role}; set test.user_id = '${id}';`);
await actAs('anon');
assert.equal((await db.query('select public.is_portfolio_owner() allowed')).rows[0].allowed, false);
await assert.rejects(db.exec(`insert into portfolio_content(id, document) values (1, '{}');`));
await assert.rejects(db.exec(`select * from private.portfolio_owner;`));
await actAs('authenticated', '22222222-2222-4222-8222-222222222222');
await assert.rejects(db.exec(`insert into portfolio_content(id, document) values (1, '{}');`));
await assert.rejects(db.exec(`insert into storage.objects values ('33333333-3333-4333-8333-333333333333', 'portfolio', 'bad.pdf');`));
await actAs('authenticated', '11111111-1111-4111-8111-111111111111');
assert.equal((await db.query('select public.is_portfolio_owner() allowed')).rows[0].allowed, true);
await db.exec(`insert into portfolio_content(id, document) values (1, '{"certifications":[{"title":"Test"}]}');`);
await db.exec(`insert into storage.objects values ('33333333-3333-4333-8333-333333333333', 'portfolio', 'test.pdf');`);
let result = await db.query(`update portfolio_content set document = '{"certifications":[{"title":"Updated"}]}' where id = 1 and version = 1 returning version;`);
assert.equal(result.rows[0].version, 2);
assert.equal((await db.query(`update portfolio_content set document = '{}' where id = 1 and version = 1 returning version`)).rows.length, 0);
await actAs('anon');
assert.equal((await db.query('select document from portfolio_content')).rows[0].document.certifications[0].title, 'Updated');
await assert.rejects(db.exec(`update portfolio_content set document = '{}';`));
await actAs('authenticated', '22222222-2222-4222-8222-222222222222');
assert.equal((await db.query(`update portfolio_content set document = '{}' returning id;`)).rows.length, 0);
assert.equal((await db.query(`delete from storage.objects returning id;`)).rows.length, 0);
await actAs('authenticated', '11111111-1111-4111-8111-111111111111');
await db.exec(`update portfolio_content set document = '{"certifications":[]}' where id = 1 and version = 2; delete from storage.objects;`);
assert.equal((await db.query('select document from portfolio_content')).rows[0].document.certifications.length, 0);
assert.equal((await db.query('select * from storage.objects')).rows.length, 0);
await db.close();
console.log('Passed: owner CRUD, public reads, denied anonymous/non-owner writes, private owner table, storage permissions, and stale-save protection.');
