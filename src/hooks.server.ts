import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '$lib/config';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
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
