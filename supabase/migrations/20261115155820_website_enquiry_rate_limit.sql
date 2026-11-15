create table if not exists public.website_enquiry_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0 check (attempts >= 0),
  updated_at timestamptz not null default now()
);

alter table public.website_enquiry_rate_limits enable row level security;
revoke all on table public.website_enquiry_rate_limits from anon, authenticated;

create policy "rate limit records are service only"
  on public.website_enquiry_rate_limits
  for all to anon, authenticated
  using (false)
  with check (false);

create index if not exists website_enquiry_rate_limits_updated_at_idx
  on public.website_enquiry_rate_limits(updated_at);

create or replace function public.consume_website_enquiry_rate_limit(p_ip_hash text)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_attempts integer;
begin
  if p_ip_hash is null or length(p_ip_hash) < 32 or length(p_ip_hash) > 64 then
    raise exception 'Invalid rate limit key';
  end if;

  insert into public.website_enquiry_rate_limits(ip_hash, window_started_at, attempts, updated_at)
  values (p_ip_hash, now(), 1, now())
  on conflict (ip_hash) do update
  set window_started_at = case
        when public.website_enquiry_rate_limits.window_started_at <= now() - interval '1 hour' then now()
        else public.website_enquiry_rate_limits.window_started_at
      end,
      attempts = case
        when public.website_enquiry_rate_limits.window_started_at <= now() - interval '1 hour' then 1
        else public.website_enquiry_rate_limits.attempts + 1
      end,
      updated_at = now()
  returning attempts into v_attempts;

  return v_attempts;
end;
$$;

revoke all on function public.consume_website_enquiry_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_website_enquiry_rate_limit(text) to service_role;
