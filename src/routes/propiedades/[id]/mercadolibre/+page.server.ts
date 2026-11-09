import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { propiedadAMercadoLibre } from '../../../../lib/mercadolibre';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data: p, error: dbError } = await locals.supabase!
    .from('propiedades')
    .select('*, fotos(url, orden), asesores(nombre, email, telefono)')
    .eq('id', params.id)
    .single();

  if (dbError || !p) throw error(404, 'Propiedad no encontrada');

  const asesor = Array.isArray(p.asesores) ? (p.asesores[0] ?? null) : (p.asesores ?? null);
  const resultado = propiedadAMercadoLibre(p, p.fotos ?? [], asesor);
  return { propiedad: p, resultado };
};
