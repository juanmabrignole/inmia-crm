-- Asesores inmobiliarios: alta, edición, asignación a propiedades y datos de contacto en el feed
create table if not exists asesores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  telefono text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table asesores enable row level security;

drop policy if exists "auth full access asesores" on asesores;
create policy "auth full access asesores" on asesores
  for all to authenticated using (true) with check (true);

drop policy if exists "anon lee asesores activos" on asesores;
create policy "anon lee asesores activos" on asesores
  for select to anon using (activo = true);

grant select, insert, update, delete on asesores to authenticated;
grant select on asesores to anon;

alter table propiedades
  add column if not exists asesor_id uuid references asesores(id) on delete set null;
