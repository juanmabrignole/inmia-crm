import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { miPerfil } from '../../../lib/perfil';
import { buscarDuplicados } from '../../../lib/leads.server';

export const load: PageServerLoad = async ({ locals, params }) => {
  const sb = locals.supabase!;
  const { data: lead, error: dbError } = await sb.from('leads').select('*').eq('id', params.id).single();
  if (dbError || !lead) throw error(404, 'Consulta no encontrada');

  const [{ data: asesores }, perfil, duplicados] = await Promise.all([
    sb.from('asesores').select('id, nombre').eq('activo', true).order('nombre'),
    miPerfil(sb),
    buscarDuplicados(sb, lead.email_norm, lead.telefono_norm, lead.id)
  ]);

  return { lead, asesores: asesores ?? [], perfil, duplicados };
};

// Admin puede todo. Asesor solo puede tocar consultas suyas o tomar pendientes sin asignar.
function puedeEditar(perfil: { rol: string; asesor_id: string | null }, lead: { asesor_id: string | null; estado: string }) {
  if (perfil.rol === 'admin') return true;
  if (!perfil.asesor_id) return false;
  return lead.asesor_id === perfil.asesor_id || (lead.estado === 'pendiente' && lead.asesor_id === null);
}

export const actions: Actions = {
  // Asigna a un asesor (el admin elige; el asesor se asigna a sí mismo)
  asignar: async ({ request, locals, params }) => {
    const sb = locals.supabase!;
    const perfil = await miPerfil(sb);
    const { data: lead } = await sb.from('leads').select('asesor_id, estado').eq('id', params.id).single();
    if (!lead) return fail(404, { error: 'Consulta no encontrada.' });
    if (!puedeEditar(perfil, lead)) return fail(403, { error: 'Esta consulta está asignada a otro asesor.' });

    const form = await request.formData();
    let asesorId = String(form.get('asesor_id') ?? '') || null;
    if (perfil.rol !== 'admin') asesorId = perfil.asesor_id;
    if (!asesorId) return fail(400, { error: 'Elegí un asesor.' });

    const { error: dbError } = await sb.from('leads').update({ asesor_id: asesorId, estado: 'asignado' }).eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    return { ok: 'Consulta asignada.' };
  },

  // Vuelve a pendientes y saca la asignación
  reabrir: async ({ locals, params }) => {
    const sb = locals.supabase!;
    const perfil = await miPerfil(sb);
    const { data: lead } = await sb.from('leads').select('asesor_id, estado').eq('id', params.id).single();
    if (!lead) return fail(404, { error: 'Consulta no encontrada.' });
    if (!puedeEditar(perfil, lead)) return fail(403, { error: 'No podés cambiar esta consulta.' });

    const { error: dbError } = await sb.from('leads').update({ asesor_id: null, estado: 'pendiente' }).eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    return { ok: 'Consulta devuelta a pendientes.' };
  },

  // Borrado lógico: queda en la pestaña Borradas
  borrar: async ({ locals, params }) => {
    const sb = locals.supabase!;
    const perfil = await miPerfil(sb);
    const { data: lead } = await sb.from('leads').select('asesor_id, estado').eq('id', params.id).single();
    if (!lead) return fail(404, { error: 'Consulta no encontrada.' });
    if (!puedeEditar(perfil, lead)) return fail(403, { error: 'No podés borrar esta consulta.' });

    const { error: dbError } = await sb.from('leads').update({ estado: 'borrado' }).eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    throw redirect(303, '/leads?estado=borrado');
  }
};
