import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { diasHasta } from '../../lib/inquilinos';

export const load: PageServerLoad = async ({ locals }) => {
  const sb = locals.supabase!;
  const [{ data: contratos, error: e1 }, { data: mensajes }, { data: propiedades }] = await Promise.all([
    sb.from('contratos')
      .select('id, fecha_vencimiento, monto, moneda, propiedades(direccion), inquilinos(nombre, telefono)')
      .eq('activo', true)
      .order('fecha_vencimiento'),
    sb.from('mensajes')
      .select('id, canal, contenido, created_at, inquilinos(nombre)')
      .order('created_at', { ascending: false })
      .limit(5),
    sb.from('propiedades')
      .select('id, direccion, operacion, estado_venta, estado_alquiler')
      .order('created_at', { ascending: false })
      .limit(4)
  ]);
  if (e1) throw error(500, 'No se pudo cargar el inicio');

  const vencimientos = (contratos ?? [])
    .map((c) => ({ ...c, dias: diasHasta(c.fecha_vencimiento) }))
    .filter((c) => c.dias <= 30);

  return {
    vencidos: vencimientos.filter((c) => c.dias < 0),
    hoy: vencimientos.filter((c) => c.dias >= 0 && c.dias <= 7),
    proximos: vencimientos.filter((c) => c.dias > 7),
    mensajes: mensajes ?? [],
    propiedades: propiedades ?? []
  };
};
