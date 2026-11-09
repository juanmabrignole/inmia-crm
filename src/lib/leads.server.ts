import type { SupabaseClient } from '@supabase/supabase-js';

// Consultas que coinciden por email o teléfono con otra consulta que no esté borrada.
export async function buscarDuplicados(
	sb: SupabaseClient,
	email_norm: string | null,
	telefono_norm: string | null,
	excluirId?: string
) {
	const filtros: string[] = [];
	if (email_norm) filtros.push(`email_norm.eq."${email_norm}"`);
	if (telefono_norm) filtros.push(`telefono_norm.eq."${telefono_norm}"`);
	if (!filtros.length) return [];

	let consulta = sb
		.from('leads')
		.select('id, nombre, email, telefono, estado, created_at, asesor_id')
		.neq('estado', 'borrado')
		.or(filtros.join(','));
	if (excluirId) consulta = consulta.neq('id', excluirId);

	const { data } = await consulta.order('created_at', { ascending: false }).limit(10);
	return data ?? [];
}
