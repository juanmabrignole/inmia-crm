import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { diasHasta } from '../../lib/inquilinos';

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error: dbError } = await locals.supabase!
    .from('contratos')
    .select('id, fecha_vencimiento, dia_pago, monto, moneda, propiedades(direccion), inquilinos(nombre, telefono)')
    .eq('activo', true)
    .order('fecha_vencimiento');
  if (dbError) throw error(500, 'No se pudo cargar la agenda');

  const items = (data ?? [])
    .map((c) => ({ ...c, dias: diasHasta(c.fecha_vencimiento) }))
    .filter((c) => c.dias <= 90);

  return {
    vencidos: items.filter((c) => c.dias < 0),
    proximos30: items.filter((c) => c.dias >= 0 && c.dias <= 30),
    proximos90: items.filter((c) => c.dias > 30)
  };
};
