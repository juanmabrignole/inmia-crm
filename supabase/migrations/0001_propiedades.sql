create type operacion_tipo as enum ('venta', 'alquiler', 'ambas');
create type estado_venta as enum ('disponible', 'reservada', 'vendida');
create type estado_alquiler as enum ('disponible', 'reservada', 'alquilada');

create table propiedades (
  id uuid primary key default gen_random_uuid(),
  direccion text not null,
  tipo text,
  ambientes int,
  superficie_m2 numeric,
  operacion operacion_tipo not null default 'venta',
  precio_venta numeric,
  moneda_venta text default 'USD',
  precio_alquiler numeric,
  moneda_alquiler text default 'ARS',
  estado_venta estado_venta default 'disponible',
  estado_alquiler estado_alquiler default 'disponible',
  created_at timestamptz default now()
);

create table fotos (
  id uuid primary key default gen_random_uuid(),
  propiedad_id uuid not null references propiedades(id) on delete cascade,
  url text not null,
  orden int default 0,
  created_at timestamptz default now()
);

alter table propiedades enable row level security;
alter table fotos enable row level security;

-- MVP: cualquier usuario autenticado puede operar. Se ajusta con roles más adelante.
create policy "auth full access propiedades" on propiedades
  for all to authenticated using (true) with check (true);
create policy "auth full access fotos" on fotos
  for all to authenticated using (true) with check (true);
