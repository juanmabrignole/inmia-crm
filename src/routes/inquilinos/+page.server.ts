import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const sb = locals.supabase!;
  const [{ data: inquilinos, error: e1 }, { data: contratos }] = await Promise.all([
    sb.from('inquilinos').select('id, nombre, email, telefono').order('nombre'),
    sb.from('contratos').select('inquilino_id, activo')
  ]);
  if (e1) throw error(500, 'No se pudieron cargar los inquilinos');

  const activos = new Map<string, number>();
  for (const c of contratos ?? []) {
    if (c.activo) activos.set(c.inquilino_id, (activos.get(c.inquilino_id) ?? 0) + 1);
  }
  return {
    inquilinos: (inquilinos ?? []).map((i) => ({ ...i, contratos: activos.get(i.id) ?? 0 }))
  };
};
