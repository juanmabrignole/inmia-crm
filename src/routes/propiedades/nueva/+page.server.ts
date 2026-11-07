import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parsePropiedad } from '../../../lib/propiedades';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = parsePropiedad(form);
    if (parsed.error || !parsed.data) {
      return fail(400, { error: parsed.error ?? 'Revisá los datos.' });
    }

    const { data, error } = await locals.supabase!
      .from('propiedades')
      .insert(parsed.data)
      .select('id')
      .single();

    if (error || !data) return fail(500, { error: error?.message ?? 'No se pudo guardar.' });
    throw redirect(303, `/propiedades/${data.id}`);
  }
};
