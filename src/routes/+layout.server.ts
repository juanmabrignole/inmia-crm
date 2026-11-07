import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const isPublic = url.pathname.startsWith('/login');

  // Sin Supabase configurado, solo se puede ver la pantalla de login (que muestra el aviso).
  if (!locals.supabase) {
    if (!isPublic) throw redirect(303, '/login');
    return { user: null };
  }

  // getUser valida el token contra Supabase (a diferencia de getSession).
  const { data: { user } } = await locals.supabase.auth.getUser();

  if (!user && !isPublic) throw redirect(303, '/login');
  if (user && isPublic) throw redirect(303, '/');

  return { user };
};
