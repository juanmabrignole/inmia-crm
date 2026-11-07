import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Ficha pública: solo propiedades publicadas (RLS lo garantiza también para anon)
export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error: dbError } = await locals.supabase!
    .from('propiedades')
    .select('id, direccion, tipo, operacion, ambientes, dormitorios, banos, superficie_m2, cochera, descripcion, precio_venta, moneda_venta, estado_venta, precio_alquiler, moneda_alquiler, estado_alquiler, fotos(url, orden), asesores(nombre, email, telefono)')
    .eq('id', params.id)
    .eq('publicada', true)
    .single();
  if (dbError || !data) throw error(404, 'Esta propiedad no está disponible');

  const fotos = [...(data.fotos ?? [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  return { propiedad: data, fotos };
};
