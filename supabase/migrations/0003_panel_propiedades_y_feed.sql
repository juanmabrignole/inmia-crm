-- Campos nuevos para el panel
alter table propiedades
  add column if not exists descripcion text,
  add column if not exists dormitorios int,
  add column if not exists banos int,
  add column if not exists cochera boolean default false,
  add column if not exists antiguedad_anios int,
  add column if not exists publicada boolean default true;

-- Bucket público para fotos
insert into storage.buckets (id, name, public) values ('propiedades', 'propiedades', true)
  on conflict (id) do nothing;

create policy "fotos: lectura publica" on storage.objects
  for select using (bucket_id = 'propiedades');
create policy "fotos: subida autenticados" on storage.objects
  for insert to authenticated with check (bucket_id = 'propiedades');
create policy "fotos: borrado autenticados" on storage.objects
  for delete to authenticated using (bucket_id = 'propiedades');

-- Lectura pública solo de propiedades publicadas (alimenta el feed para portales)
grant select on propiedades, fotos to anon;
create policy "anon lee publicadas" on propiedades
  for select to anon using (publicada = true);
create policy "anon lee fotos de publicadas" on fotos
  for select to anon using (
    exists (select 1 from propiedades p where p.id = fotos.propiedad_id and p.publicada = true)
  );
