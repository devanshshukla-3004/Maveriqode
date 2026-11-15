drop policy if exists "admins manage website content" on public.website_content;
drop policy if exists "published website content is public" on public.website_content;
drop policy if exists "public anonymous read published website content" on public.website_content;
drop policy if exists "admins read website content" on public.website_content;
drop policy if exists "admins insert website content" on public.website_content;
drop policy if exists "admins update website content" on public.website_content;
drop policy if exists "admins delete website content" on public.website_content;

create policy "public anonymous read published website content"
  on public.website_content for select to anon
  using (status = 'published');

create policy "admins read website content"
  on public.website_content for select to authenticated
  using (exists (select 1 from public.website_admins a where a.user_id = (select auth.uid())));

create policy "admins insert website content"
  on public.website_content for insert to authenticated
  with check (exists (select 1 from public.website_admins a where a.user_id = (select auth.uid())));

create policy "admins update website content"
  on public.website_content for update to authenticated
  using (exists (select 1 from public.website_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.website_admins a where a.user_id = (select auth.uid())));

create policy "admins delete website content"
  on public.website_content for delete to authenticated
  using (exists (select 1 from public.website_admins a where a.user_id = (select auth.uid())));

create index if not exists website_audit_logs_actor_id_idx
  on public.website_audit_logs(actor_id);

create index if not exists website_content_updated_by_idx
  on public.website_content(updated_by);
