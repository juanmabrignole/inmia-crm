import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ESTADOS_LEAD, type EstadoLead } from '../../lib/leads';

export const load: PageServerLoad = async ({ locals, url }) => {
  const sb = locals.supabase!;
  const pedido = url.searchParams.get('estado') ?? 'pendiente';
  const estado: EstadoLead = (ESTADOS_LEAD as readonly string[]).includes(pedido)
    ? (pedido as EstadoLead)
    : 'pendiente';

  const [{ data: leads, error: e1 }, { data: asesores, error: e2 }, ...conteos] = await Promise.all([
    sb
      .from('leads')
      .select('id, created_at, nombre, email, telefono, origen, etiquetas, mensaje, asesor_id')
      .eq('estado', estado)
      .order('created_at', { ascending: false })
      .limit(100),
    sb.from('asesores').select('id, nombre'),
    ...ESTADOS_LEAD.map((e) =>
      sb.from('leads').select('id', { count: 'exact', head: true }).eq('estado', e)
    )
  ]);
  if (e1 || e2) throw error(500, 'No se pudieron cargar las consultas');

  const nombres = Object.fromEntries((asesores ?? []).map((a) => [a.id, a.nombre]));
  const conteo = Object.fromEntries(ESTADOS_LEAD.map((e, i) => [e, conteos[i].count ?? 0]));

  return { estado, leads: leads ?? [], nombres, conteo };
};
