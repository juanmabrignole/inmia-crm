import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    // Sin variables de Supabase la app igual arranca; las rutas que las necesitan avisan.
    event.locals.supabase = null;
    event.locals.getSession = async () => null;
    return resolve(event);
  }

  event.locals.supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) =>
        cookiesToSet.forEach(({ name, value, options }) =>
          event.cookies.set(name, value, { ...options, path: '/' })
        )
    }
  });

  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase!.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-range' || name === 'x-supabase-api-version'
  });
};
