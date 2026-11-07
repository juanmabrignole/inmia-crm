import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const op = url.searchParams.get('operacion') ?? '';
  let query = locals.supabase!
    .from('propiedades')
    .select('id, direccion, tipo, operacion, estado_venta, estado_alquiler, precio_venta, moneda_venta, precio_alquiler, moneda_alquiler, publicada, fotos(url, orden)')
    .order('created_at', { ascending: false });

  if (op === 'venta' || op === 'alquiler' || op === 'ambas') query = query.eq('operacion', op);

  const { data, error } = await query;
  return {
    operacion: op,
    error: error?.message ?? null,
    propiedades: (data ?? []).map((p) => ({
      ...p,
      foto: [...(p.fotos ?? [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))[0]?.url ?? null
    }))
  };
};
