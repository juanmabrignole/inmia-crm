-- Roles: admin (ve y edita todo) y asesor (solo lo asignado a él)
create table if not exists perfiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  rol text not null default 'asesor' check (rol in ('admin', 'asesor')),
  asesor_id uuid references asesores(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table perfiles enable row level security;

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfiles where user_id = auth.uid() and rol = 'admin');
$$;

create or replace function public.mi_asesor_id() returns uuid
language sql stable security definer set search_path = public as $$
  select asesor_id from perfiles where user_id = auth.uid();
$$;

-- Cada usuario nuevo entra como asesor sin asignar (no ve nada hasta que el admin lo configure)
create or replace function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfiles (user_id, email, rol) values (new.id, new.email, 'asesor')
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_creado on auth.users;
create trigger on_auth_user_creado
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- Usuarios que ya existen (los dueños de la base actual) pasan a admin
insert into perfiles (user_id, email, rol)
select id, email, 'admin' from auth.users
on conflict (user_id) do nothing;

drop policy if exists "perfiles: ver" on perfiles;
create policy "perfiles: ver" on perfiles for select to authenticated
  using (user_id = auth.uid() or es_admin());

drop policy if exists "perfiles: admin edita" on perfiles;
create policy "perfiles: admin edita" on perfiles for update to authenticated
  using (es_admin()) with check (es_admin());

grant select, update on perfiles to authenticated;

-- Propiedades: admin todo; asesor solo las asignadas
drop policy if exists "auth full access propiedades" on propiedades;
drop policy if exists "propiedades: admin" on propiedades;
create policy "propiedades: admin" on propiedades for all to authenticated
  using (es_admin()) with check (es_admin());
drop policy if exists "propiedades: asesor asignadas" on propiedades;
create policy "propiedades: asesor asignadas" on propiedades for all to authenticated
  using (asesor_id = mi_asesor_id()) with check (asesor_id = mi_asesor_id());

-- Fotos y tasaciones siguen a la propiedad
drop policy if exists "auth full access fotos" on fotos;
create policy "fotos: segun propiedad" on fotos for all to authenticated
  using (exists (select 1 from propiedades p where p.id = fotos.propiedad_id))
  with check (exists (select 1 from propiedades p where p.id = fotos.propiedad_id));

drop policy if exists "auth full access tasaciones" on tasaciones;
create policy "tasaciones: segun propiedad" on tasaciones for all to authenticated
  using (exists (select 1 from propiedades p where p.id = tasaciones.propiedad_id))
  with check (exists (select 1 from propiedades p where p.id = tasaciones.propiedad_id));

drop policy if exists "auth full access comparables" on tasacion_comparables;
create policy "comparables: segun tasacion" on tasacion_comparables for all to authenticated
  using (exists (select 1 from tasaciones t where t.id = tasacion_comparables.tasacion_id))
  with check (exists (select 1 from tasaciones t where t.id = tasacion_comparables.tasacion_id));

-- Asesores: todos leen la lista, solo el admin la edita
drop policy if exists "auth full access asesores" on asesores;
drop policy if exists "asesores: todos leen" on asesores;
create policy "asesores: todos leen" on asesores for select to authenticated using (true);
drop policy if exists "asesores: admin escribe" on asesores;
create policy "asesores: admin escribe" on asesores for all to authenticated
  using (es_admin()) with check (es_admin());

-- Inquilinos compartidos: todos pueden leer, cargar y editar; borrar solo admin
drop policy if exists "auth full access inquilinos" on inquilinos;
drop policy if exists "inquilinos: leer" on inquilinos;
create policy "inquilinos: leer" on inquilinos for select to authenticated using (true);
drop policy if exists "inquilinos: cargar" on inquilinos;
create policy "inquilinos: cargar" on inquilinos for insert to authenticated with check (true);
drop policy if exists "inquilinos: editar" on inquilinos;
create policy "inquilinos: editar" on inquilinos for update to authenticated using (true) with check (true);
drop policy if exists "inquilinos: borrar admin" on inquilinos;
create policy "inquilinos: borrar admin" on inquilinos for delete to authenticated using (es_admin());

-- Contratos: admin todo; asesor solo los suyos
drop policy if exists "auth full access contratos" on contratos;
drop policy if exists "contratos: admin" on contratos;
create policy "contratos: admin" on contratos for all to authenticated
  using (es_admin()) with check (es_admin());
drop policy if exists "contratos: asesor propios" on contratos;
create policy "contratos: asesor propios" on contratos for all to authenticated
  using (asesor_id = mi_asesor_id()) with check (asesor_id = mi_asesor_id());

-- Mensajes: todos leen y registran; borrar solo admin
drop policy if exists "auth full access mensajes" on mensajes;
drop policy if exists "mensajes: leer" on mensajes;
create policy "mensajes: leer" on mensajes for select to authenticated using (true);
drop policy if exists "mensajes: cargar" on mensajes;
create policy "mensajes: cargar" on mensajes for insert to authenticated with check (true);
drop policy if exists "mensajes: borrar admin" on mensajes;
create policy "mensajes: borrar admin" on mensajes for delete to authenticated using (es_admin());
