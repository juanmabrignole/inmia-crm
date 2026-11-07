import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseInquilino } from '../../../lib/inquilinos';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const parsed = parseInquilino(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const { data, error } = await locals.supabase!.from('inquilinos').insert(parsed.data).select('id').single();
    if (error || !data) return fail(500, { error: error?.message ?? 'No se pudo guardar.' });
    throw redirect(303, `/inquilinos/${data.id}`);
  }
};
