import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const sb = locals.supabase!;
  const [{ data: asesores, error: e1 }, { data: propiedades, error: e2 }] = await Promise.all([
    sb.from('asesores').select('id, nombre, email, telefono, activo').order('nombre'),
    sb.from('propiedades').select('asesor_id')
  ]);
  if (e1 || e2) throw error(500, 'No se pudieron cargar los asesores');

  const conteo = new Map<string, number>();
  for (const p of propiedades ?? []) {
    if (p.asesor_id) conteo.set(p.asesor_id, (conteo.get(p.asesor_id) ?? 0) + 1);
  }

  return {
    asesores: (asesores ?? []).map((a) => ({ ...a, propiedades: conteo.get(a.id) ?? 0 }))
  };
};
