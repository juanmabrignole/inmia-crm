-- Inquilinos, contratos de alquiler con vencimientos e historial de mensajes
create table if not exists inquilinos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  telefono text,
  notas text,
  created_at timestamptz not null default now()
);

create table if not exists contratos (
  id uuid primary key default gen_random_uuid(),
  propiedad_id uuid not null references propiedades(id) on delete cascade,
  inquilino_id uuid not null references inquilinos(id) on delete cascade,
  asesor_id uuid references asesores(id) on delete set null,
  fecha_inicio date not null,
  fecha_vencimiento date not null,
  monto numeric,
  moneda text not null default 'ARS' check (moneda in ('ARS', 'USD')),
  dia_pago int check (dia_pago between 1 and 31),
  activo boolean not null default true,
  notas text,
  created_at timestamptz not null default now(),
  check (fecha_vencimiento > fecha_inicio)
);

create table if not exists mensajes (
  id uuid primary key default gen_random_uuid(),
  inquilino_id uuid not null references inquilinos(id) on delete cascade,
  propiedad_id uuid references propiedades(id) on delete set null,
  canal text not null default 'nota' check (canal in ('nota', 'whatsapp', 'email', 'llamada')),
  contenido text not null,
  created_at timestamptz not null default now()
);

alter table inquilinos enable row level security;
alter table contratos enable row level security;
alter table mensajes enable row level security;

drop policy if exists "auth full access inquilinos" on inquilinos;
create policy "auth full access inquilinos" on inquilinos for all to authenticated using (true) with check (true);

drop policy if exists "auth full access contratos" on contratos;
create policy "auth full access contratos" on contratos for all to authenticated using (true) with check (true);

drop policy if exists "auth full access mensajes" on mensajes;
create policy "auth full access mensajes" on mensajes for all to authenticated using (true) with check (true);

grant select, insert, update, delete on inquilinos, contratos, mensajes to authenticated;
