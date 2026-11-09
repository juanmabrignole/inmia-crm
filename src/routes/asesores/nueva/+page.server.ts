import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parseAsesor } from '../../../lib/asesores';
import { miPerfil } from '../../../lib/perfil';

export const load: PageServerLoad = async ({ locals }) => {
  const perfil = await miPerfil(locals.supabase!);
  if (perfil.rol !== 'admin') throw redirect(303, '/asesores');
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const parsed = parseAsesor(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const { data, error } = await locals.supabase!
      .from('asesores')
      .insert(parsed.data)
      .select('id')
      .single();

    if (error || !data) return fail(500, { error: error?.message ?? 'No se pudo guardar.' });
    throw redirect(303, `/asesores/${data.id}`);
  }
};
