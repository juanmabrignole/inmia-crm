import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error: dbError } = await locals.supabase!
    .from('contratos')
    .select('id, fecha_inicio, fecha_vencimiento, monto, moneda, activo, propiedades(direccion), inquilinos(nombre)')
    .order('fecha_vencimiento');
  if (dbError) throw error(500, 'No se pudieron cargar los contratos');
  return { contratos: data ?? [] };
};
