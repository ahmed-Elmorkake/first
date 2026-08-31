-- Run this after 20260831_admin_properties.sql if the first migration was already applied.
-- It makes property listings public and enables live updates on the homepage.

drop policy if exists "Admins can read properties" on public.properties;
drop policy if exists "Anyone can view properties" on public.properties;
create policy "Anyone can view properties" on public.properties for select to anon, authenticated using (true);

alter table public.properties replica identity full;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'properties'
    ) then
    alter publication supabase_realtime add table public.properties;
  end if;
end;
$$;
