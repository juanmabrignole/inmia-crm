import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parsePropiedad } from '../../../lib/propiedades';
import { miPerfil } from '../../../lib/perfil';

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error: dbError } = await locals.supabase!
    .from('asesores')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre');
  if (dbError) throw error(500, 'No se pudieron cargar los asesores');
  return { asesores: data ?? [] };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = parsePropiedad(form);
    if (parsed.error || !parsed.data) {
      return fail(400, { error: parsed.error ?? 'Revisá los datos.' });
    }

    const perfil = await miPerfil(locals.supabase!);
    if (perfil.rol !== 'admin') {
      if (!perfil.asesor_id) return fail(400, { error: 'Tu usuario no tiene un asesor asignado. Pedile al administrador que te configure en Equipo.' });
      parsed.data.asesor_id = perfil.asesor_id;
    }

    const { data, error: dbError } = await locals.supabase!
      .from('propiedades')
      .insert(parsed.data)
      .select('id')
      .single();

    if (dbError || !data) return fail(500, { error: dbError?.message ?? 'No se pudo guardar.' });
    throw redirect(303, `/propiedades/${data.id}`);
  }
};
