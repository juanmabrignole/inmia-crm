-- Consultas (leads) que llegan de portales, Facebook, landings o WhatsApp.
-- Requiere 0006_roles.sql (funciones es_admin() y mi_asesor_id()).

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text,
  email text,
  telefono text,
  -- Versiones normalizadas para detectar duplicados (email en minúsculas, últimos 8 dígitos del teléfono)
  email_norm text,
  telefono_norm text,
  mensaje text,
  origen text,
  etiquetas text[] not null default '{}',
  datos jsonb not null default '{}'::jsonb,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'asignado', 'borrado')),
  asesor_id uuid references asesores(id) on delete set null,
  propiedad_id uuid references propiedades(id) on delete set null,
  constraint leads_tiene_contacto check (email_norm is not null or telefono_norm is not null)
);

create index leads_email_norm_idx on leads (email_norm);
create index leads_telefono_norm_idx on leads (telefono_norm);
create index leads_estado_idx on leads (estado, created_at desc);

alter table leads enable row level security;

-- El equipo ve todas las consultas (así se detectan duplicados entre asesores)
create policy "leads: equipo lee" on leads
  for select to authenticated using (true);

create policy "leads: equipo carga" on leads
  for insert to authenticated with check (true);

-- Admin edita cualquiera
create policy "leads: admin edita" on leads
  for update to authenticated using (es_admin()) with check (es_admin());

-- Asesor edita las suyas o toma una pendiente sin asignar
create policy "leads: asesor toma o edita propias" on leads
  for update to authenticated
  using (asesor_id = mi_asesor_id() or (estado = 'pendiente' and asesor_id is null))
  with check (asesor_id = mi_asesor_id());

create policy "leads: admin borra" on leads
  for delete to authenticated using (es_admin());

grant select, insert, update, delete on leads to authenticated;
grant select, insert, update, delete on leads to service_role;
