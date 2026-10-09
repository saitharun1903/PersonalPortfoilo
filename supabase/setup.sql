-- Run in Supabase SQL Editor after creating your owner in Authentication → Users.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.portfolio_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade
);
alter table private.portfolio_owner enable row level security;
insert into private.portfolio_owner(singleton, user_id)
select true, id from auth.users where lower(email) = 'saitharunreddy@writecode.in' and email_confirmed_at is not null
on conflict (singleton) do update set user_id = excluded.user_id;
do $$ begin
  if not exists (select 1 from private.portfolio_owner) then
    raise exception 'Create and confirm saitharunreddy@writecode.in in Authentication → Users first.';
  end if;
end $$;

create or replace function public.is_portfolio_owner() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from private.portfolio_owner where user_id = (select auth.uid())); $$;
revoke all on function public.is_portfolio_owner() from public;
grant execute on function public.is_portfolio_owner() to anon, authenticated;

create table if not exists public.portfolio_content (
  id integer primary key check (id = 1),
  document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 500000),
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update on public.portfolio_content to authenticated;
drop policy if exists "Public portfolio read" on public.portfolio_content;
create policy "Public portfolio read" on public.portfolio_content for select using (true);
drop policy if exists "Owner portfolio insert" on public.portfolio_content;
create policy "Owner portfolio insert" on public.portfolio_content for insert to authenticated with check ((select public.is_portfolio_owner()));
drop policy if exists "Owner portfolio update" on public.portfolio_content;
create policy "Owner portfolio update" on public.portfolio_content for update to authenticated using ((select public.is_portfolio_owner())) with check ((select public.is_portfolio_owner()));

create or replace function private.stamp_portfolio_version() returns trigger
language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then new.version := old.version + 1; else new.version := 1; end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists portfolio_version on public.portfolio_content;
create trigger portfolio_version before insert or update on public.portfolio_content for each row execute function private.stamp_portfolio_version();

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Owner portfolio files read" on storage.objects;
create policy "Owner portfolio files read" on storage.objects for select to authenticated using (bucket_id = 'portfolio' and (select public.is_portfolio_owner()));
drop policy if exists "Owner portfolio files insert" on storage.objects;
create policy "Owner portfolio files insert" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio' and (select public.is_portfolio_owner()));
drop policy if exists "Owner portfolio files delete" on storage.objects;
create policy "Owner portfolio files delete" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and (select public.is_portfolio_owner()));
commit;
