import type { SupabaseClient } from '@supabase/supabase-js';

export type Perfil = { rol: 'admin' | 'asesor'; asesor_id: string | null };

// Perfil del usuario logueado. Sin perfil, se trata como asesor sin asignar (no ve nada).
export async function miPerfil(sb: SupabaseClient): Promise<Perfil> {
  const { data } = await sb.from('perfiles').select('rol, asesor_id').single();
  return (data as Perfil | null) ?? { rol: 'asesor', asesor_id: null };
}
