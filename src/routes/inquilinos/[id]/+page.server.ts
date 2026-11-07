import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parseInquilino, parseMensaje } from '../../../lib/inquilinos';

export const load: PageServerLoad = async ({ locals, params }) => {
  const sb = locals.supabase!;
  const [{ data: inquilino, error: e1 }, { data: contratos }, { data: mensajes }, { data: propiedades }] = await Promise.all([
    sb.from('inquilinos').select('*').eq('id', params.id).single(),
    sb.from('contratos').select('id, fecha_inicio, fecha_vencimiento, monto, moneda, dia_pago, activo, propiedades(id, direccion)').eq('inquilino_id', params.id).order('fecha_vencimiento'),
    sb.from('mensajes').select('id, canal, contenido, created_at, propiedades(direccion)').eq('inquilino_id', params.id).order('created_at', { ascending: false }).limit(50),
    sb.from('propiedades').select('id, direccion').order('direccion')
  ]);
  if (e1 || !inquilino) throw error(404, 'Inquilino no encontrado');
  return { inquilino, contratos: contratos ?? [], mensajes: mensajes ?? [], propiedades: propiedades ?? [] };
};

export const actions: Actions = {
  guardar: async ({ request, locals, params }) => {
    const parsed = parseInquilino(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });
    const { error: dbError } = await locals.supabase!.from('inquilinos').update(parsed.data).eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    return { ok: 'Cambios guardados.' };
  },

  mensaje: async ({ request, locals, params }) => {
    const parsed = parseMensaje(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { errorMensaje: parsed.error ?? 'Revisá el mensaje.' });
    const { error: dbError } = await locals.supabase!.from('mensajes').insert({ ...parsed.data, inquilino_id: params.id });
    if (dbError) return fail(500, { errorMensaje: dbError.message });
    return { okMensaje: 'Mensaje registrado.' };
  },

  eliminar: async ({ locals, params }) => {
    const { error: dbError } = await locals.supabase!.from('inquilinos').delete().eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    throw redirect(303, '/inquilinos');
  }
};
