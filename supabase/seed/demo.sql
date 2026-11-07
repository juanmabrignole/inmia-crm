-- Datos de demo para mostrar la app.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de las migraciones 0001 a 0004.
-- Es re-ejecutable: borra solo los registros de demo (IDs con prefijo 1000... y a000...).

delete from fotos where propiedad_id in (select id from propiedades where id::text like '10000000-%');
delete from propiedades where id::text like '10000000-%';
delete from asesores where id::text like 'a0000000-%';

insert into asesores (id, nombre, email, telefono, activo) values
  ('a0000000-0000-4000-8000-000000000001', 'Valentina Ríos',   'valentina@demo.inmia', '+54 9 11 5555-0101', true),
  ('a0000000-0000-4000-8000-000000000002', 'Martín Pereyra',   'martin@demo.inmia',    '+54 9 11 5555-0102', true),
  ('a0000000-0000-4000-8000-000000000003', 'Lucía Ferreyra',   'lucia@demo.inmia',     '+54 9 11 5555-0103', true),
  ('a0000000-0000-4000-8000-000000000004', 'Diego Salas',      'diego@demo.inmia',     '+54 9 11 5555-0104', false);

insert into propiedades (id, direccion, tipo, operacion, ambientes, dormitorios, banos, superficie_m2, antiguedad_anios, cochera, descripcion,
  precio_venta, moneda_venta, estado_venta, precio_alquiler, moneda_alquiler, estado_alquiler, publicada, asesor_id) values
  ('10000000-0000-4000-8000-000000000001', 'Av. Cazón 1200, Tigre', 'Departamento', 'venta', 3, 2, 1, 68, 12, false,
   'Luminoso, con balcón al frente y vista abierta. Cerca de estación y comercios.',
   115000, 'USD', 'disponible', null, 'ARS', 'disponible', true, 'a0000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000002', 'Av. Liniers 800, Tigre', 'Monoambiente', 'alquiler', 1, 0, 1, 32, 5, false,
   'Monoambiente a estrenar, ideal para estudiantes o profesionales. Amoblado opcional.',
   null, 'USD', 'disponible', 650000, 'ARS', 'disponible', true, 'a0000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000003', 'San Martín 450, San Isidro', 'PH', 'ambas', 3, 2, 2, 90, 25, true,
   'PH con terraza propia y parrilla. Muy buena ubicación, a pasos del tren.',
   180000, 'USD', 'disponible', 900000, 'ARS', 'disponible', true, 'a0000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000004', 'Los Ceibos 300, Nordelta', 'Casa', 'venta', 5, 3, 3, 210, 8, true,
   'Casa en barrio cerrado con jardín, pileta y quincho. Lista para mudarse.',
   240000, 'USD', 'reservada', null, 'ARS', 'disponible', true, 'a0000000-0000-4000-8000-000000000003'),
  ('10000000-0000-4000-8000-000000000005', 'Mitre 2100, Tigre', 'Departamento', 'alquiler', 2, 1, 1, 55, 15, false,
   'Departamento con cochera opcional, buen estado y expensas bajas.',
   null, 'USD', 'disponible', 780000, 'ARS', 'alquilada', true, 'a0000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000006', 'Belgrano 980, Olivos', 'Departamento', 'venta', 4, 3, 2, 120, 3, true,
   'Departamento a estrenar con amenities completos y cochera fija.',
   310000, 'USD', 'disponible', null, 'ARS', 'disponible', true, 'a0000000-0000-4000-8000-000000000003'),
  ('10000000-0000-4000-8000-000000000007', 'Av. Libertador 3300, Vicente López', 'Oficina', 'alquiler', 2, 0, 1, 70, 20, false,
   'Oficina luminosa en edificio corporativo, con recepción y seguridad 24 hs.',
   null, 'USD', 'disponible', 1100000, 'ARS', 'disponible', false, 'a0000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000008', 'Rivadavia 1450, San Fernando', 'Terreno', 'venta', null, null, null, 400, null, false,
   'Lote de 10 x 40 m en zona residencial, apto para construir.',
   95000, 'USD', 'disponible', null, 'ARS', 'disponible', true, 'a0000000-0000-4000-8000-000000000001');

insert into fotos (propiedad_id, url, orden)
select p.id, 'https://picsum.photos/seed/inmia' || substr(p.id::text, 35, 2) || '-' || f.n || '/1200/900', f.n - 1
from propiedades p
cross join generate_series(1, 3) as f(n)
where p.id::text like '10000000-%';
