import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { miPerfil } from '../../lib/perfil';

export const load: PageServerLoad = async ({ locals }) => {
  const sb = locals.supabase!;
  const perfil = await miPerfil(sb);
  if (perfil.rol !== 'admin') throw redirect(303, '/');

  const [{ data: perfiles, error: e1 }, { data: asesores, error: e2 }] = await Promise.all([
    sb.from('perfiles').select('user_id, email, rol, asesor_id').order('email'),
    sb.from('asesores').select('id, nombre').order('nombre')
  ]);
  if (e1 || e2) throw error(500, 'No se pudo cargar el equipo');
  return { perfiles: perfiles ?? [], asesores: asesores ?? [] };
};

export const actions: Actions = {
  actualizar: async ({ request, locals }) => {
    const sb = locals.supabase!;
    const perfil = await miPerfil(sb);
    if (perfil.rol !== 'admin') return fail(403, { error: 'Solo el administrador puede cambiar roles.' });

    const form = await request.formData();
    const userId = String(form.get('user_id') ?? '');
    const rol = String(form.get('rol') ?? 'asesor');
    const asesorId = String(form.get('asesor_id') ?? '') || null;
    if (rol !== 'admin' && rol !== 'asesor') return fail(400, { error: 'Rol no válido.' });
    if (rol === 'asesor' && !asesorId) return fail(400, { error: 'Un asesor necesita estar asignado a un asesor del listado.' });

    const { error: dbError } = await sb
      .from('perfiles')
      .update({ rol, asesor_id: rol === 'admin' ? null : asesorId })
      .eq('user_id', userId);
    if (dbError) return fail(500, { error: dbError.message });
    return { ok: 'Cambios guardados.' };
  }
};
