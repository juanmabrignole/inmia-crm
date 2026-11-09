import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { calcularValor, parseTasacion } from '../../../../lib/tasacion';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data: propiedad, error: dbError } = await locals.supabase!
    .from('propiedades')
    .select('id, direccion, superficie_m2')
    .eq('id', params.id)
    .single();

  if (dbError || !propiedad) throw error(404, 'Propiedad no encontrada');
  return { propiedad };
};

export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    const sb = locals.supabase!;

    const { data: propiedad } = await sb
      .from('propiedades')
      .select('superficie_m2')
      .eq('id', params.id)
      .single();
    if (!propiedad) return fail(404, { error: 'Propiedad no encontrada.' });
    if (!propiedad.superficie_m2) return fail(400, { error: 'Cargá la superficie de la propiedad antes de tasar.' });

    const parsed = parseTasacion(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const d = parsed.data;
    // El valor se calcula acá, en el servidor; la vista previa del formulario es solo orientativa.
    const resultado = calcularValor(d.comparables, Number(propiedad.superficie_m2));
    if (!resultado) return fail(400, { error: 'Ningún comparable tiene superficie cargada, no se puede calcular el valor.' });

    const { data: tasacion, error: e1 } = await sb
      .from('tasaciones')
      .insert({
        propiedad_id: params.id,
        operacion: d.operacion,
        moneda: d.moneda,
        tasador: d.tasador,
        notas: d.notas,
        valor_sugerido: resultado.valor_sugerido,
        valor_minimo: resultado.valor_minimo,
        valor_maximo: resultado.valor_maximo
      })
      .select('id')
      .single();
    if (e1 || !tasacion) return fail(500, { error: e1?.message ?? 'No se pudo guardar la tasación.' });

    const filas = d.comparables.map((c) => ({
      tasacion_id: tasacion.id,
      direccion: c.direccion,
      precio: c.precio,
      moneda: d.moneda,
      superficie_m2: c.superficie_m2,
      ambientes: c.ambientes,
      antiguedad_anios: c.antiguedad_anios,
      distancia_m: c.distancia_m,
      ajuste_pct: c.ajuste_pct
    }));
    const { error: e2 } = await sb.from('tasacion_comparables').insert(filas);
    if (e2) {
      // Si fallan los comparables, no dejamos una tasación a medio cargar
      await sb.from('tasaciones').delete().eq('id', tasacion.id);
      return fail(500, { error: e2.message });
    }

    throw redirect(303, `/tasaciones/${tasacion.id}/informe`);
  }
};
