import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.getSession();
  if (!session) throw redirect(303, '/');

  const { data: tasacion, error: dbError } = await locals.supabase
    .from('tasaciones')
    .select('*, propiedades(*, fotos(url, orden)), tasacion_comparables(*)')
    .eq('id', params.id)
    .single();

  if (dbError || !tasacion) throw error(404, 'Informe no encontrado');
  return { tasacion };
};
