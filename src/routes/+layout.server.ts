import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { miPerfil } from '../lib/perfil';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const isLogin = url.pathname.startsWith('/login');
  // Páginas públicas: login y la ficha pública de propiedades (/p/...)
  const isPublic = isLogin || url.pathname.startsWith('/p/');

  // Sin Supabase configurado, solo se puede ver la pantalla de login (que muestra el aviso).
  if (!locals.supabase) {
    if (!isPublic) throw redirect(303, '/login');
    return { user: null, perfil: null };
  }

  // getUser valida el token contra Supabase (a diferencia de getSession).
  const { data: { user } } = await locals.supabase.auth.getUser();

  if (!user && !isPublic) throw redirect(303, '/login');
  if (user && isLogin) throw redirect(303, '/');

  const perfil = user ? await miPerfil(locals.supabase) : null;
  return { user, perfil };
};
