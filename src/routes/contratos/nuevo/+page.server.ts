import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parseContrato } from '../../../lib/inquilinos';
import { miPerfil } from '../../../lib/perfil';

export const load: PageServerLoad = async ({ locals }) => {
  const sb = locals.supabase!;
  const [{ data: propiedades, error: e1 }, { data: inquilinos, error: e2 }, { data: asesores, error: e3 }] = await Promise.all([
    sb.from('propiedades').select('id, direccion').order('direccion'),
    sb.from('inquilinos').select('id, nombre').order('nombre'),
    sb.from('asesores').select('id, nombre').eq('activo', true).order('nombre')
  ]);
  if (e1 || e2 || e3) throw error(500, 'No se pudieron cargar los datos del contrato');
  const perfil = await miPerfil(sb);
  return { propiedades: propiedades ?? [], inquilinos: inquilinos ?? [], asesores: asesores ?? [], perfil };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const parsed = parseContrato(await request.formData());
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const sb = locals.supabase!;
    const perfil = await miPerfil(sb);
    if (perfil.rol !== 'admin') {
      if (!perfil.asesor_id) return fail(400, { error: 'Tu usuario no tiene un asesor asignado. Pedile al administrador que te configure en Equipo.' });
      parsed.data.asesor_id = perfil.asesor_id;
    }
    const { data, error: dbError } = await sb.from('contratos').insert(parsed.data).select('id').single();
    if (dbError || !data) return fail(500, { error: dbError?.message ?? 'No se pudo guardar el contrato.' });

    // Al cargar un contrato activo, la propiedad pasa a alquilada
    await sb.from('propiedades').update({ estado_alquiler: 'alquilada' }).eq('id', parsed.data.propiedad_id as string);
    throw redirect(303, '/contratos');
  }
};
