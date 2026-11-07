create type tasacion_operacion as enum ('venta', 'alquiler');

create table tasaciones (
  id uuid primary key default gen_random_uuid(),
  propiedad_id uuid not null references propiedades(id) on delete cascade,
  fecha date not null default current_date,
  operacion tasacion_operacion not null default 'venta',
  valor_sugerido numeric,
  valor_minimo numeric,
  valor_maximo numeric,
  moneda text not null default 'USD',
  tasador text,
  notas text,
  created_at timestamptz default now()
);

create table tasacion_comparables (
  id uuid primary key default gen_random_uuid(),
  tasacion_id uuid not null references tasaciones(id) on delete cascade,
  direccion text not null,
  precio numeric not null,
  moneda text not null default 'USD',
  superficie_m2 numeric,
  ambientes int,
  antiguedad_anios int,
  distancia_m numeric,
  ajuste_pct numeric default 0,
  created_at timestamptz default now()
);

alter table tasaciones enable row level security;
alter table tasacion_comparables enable row level security;

create policy "auth full access tasaciones" on tasaciones
  for all to authenticated using (true) with check (true);
create policy "auth full access comparables" on tasacion_comparables
  for all to authenticated using (true) with check (true);
