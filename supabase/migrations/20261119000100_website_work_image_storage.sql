insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-work-images',
  'website-work-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "website admins upload work images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'website-work-images'
  and exists (
    select 1 from public.website_admins a
    where a.user_id = (select auth.uid())
  )
);

create policy "website admins delete work images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'website-work-images'
  and exists (
    select 1 from public.website_admins a
    where a.user_id = (select auth.uid())
  )
);
