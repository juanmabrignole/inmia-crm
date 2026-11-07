import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parseAsesor } from '../../../lib/asesores';

export const load: PageServerLoad = async ({ locals, params }) => {
  const sb = locals.supabase!;
  const [{ data: asesor, error: e1 }, { data: propiedades, error: e2 }] = await Promise.all([
    sb.from('asesores').select('*').eq('id', params.id).single(),
    sb.from('propiedades').select('id, direccion, operacion, estado_venta, estado_alquiler').eq('asesor_id', params.id).order('direccion')
  ]);
  if (e1 || !asesor) throw error(404, 'Asesor no encontrado');
  if (e2) throw error(500, 'No se pudieron cargar sus propiedades');

  return { asesor, propiedades: propiedades ?? [] };
};

export const actions: Actions = {
  guardar: async ({ request, locals, params }) => {
    const parsed = parseAsesor(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const { error: dbError } = await locals.supabase!
      .from('asesores')
      .update(parsed.data)
      .eq('id', params.id);

    if (dbError) return fail(500, { error: dbError.message });
    return { ok: 'Cambios guardados.' };
  },

  eliminar: async ({ locals, params }) => {
    // Las propiedades asignadas quedan sin asesor (on delete set null)
    const { error: dbError } = await locals.supabase!.from('asesores').delete().eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    throw redirect(303, '/asesores');
  }
};
