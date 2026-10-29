-- Franxx MD web preview: Supabase Auth stores accounts and bot_config in user_metadata.
-- For production runtime, do NOT trust user_metadata for quotas, roles, or authorization.
-- Add server-owned tables and RLS policies before enabling bot runtime.

create table if not exists public.bot_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Franxx MD',
  status text not null default 'draft' check (status in ('draft','stopped','starting','online','error')),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bot_instances enable row level security;
create policy "Users can view their own bot instances" on public.bot_instances
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can create their own bot instances" on public.bot_instances
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own bot instances" on public.bot_instances
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own bot instances" on public.bot_instances
  for delete to authenticated using (auth.uid() = user_id);

-- Do not store WhatsApp auth/session credentials in this table or in browser storage.
-- Add private server-side quota tables with atomic RPC before connecting the bot runtime.
