import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseLead } from '../../../lib/leads';
import { buscarDuplicados } from '../../../lib/leads.server';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = parseLead(form);
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const sb = locals.supabase!;
    const d = parsed.data;

    // Si ya existe por email o teléfono, no se crea otra vez salvo que se confirme
    const duplicados = await buscarDuplicados(sb, d.email_norm, d.telefono_norm);
    const forzar = form.get('forzar') === 'on';
    if (duplicados.length && !forzar) {
      return fail(409, {
        error: 'Ya hay una consulta con ese email o teléfono. Revisá las existentes o confirmá que es otra.',
        duplicados,
        valores: Object.fromEntries(form.entries()) as Record<string, string>
      });
    }

    const { data, error: dbError } = await sb.from('leads').insert(d).select('id').single();
    if (dbError || !data) return fail(500, { error: dbError?.message ?? 'No se pudo guardar la consulta.' });
    throw redirect(303, `/leads/${data.id}`);
  }
};
