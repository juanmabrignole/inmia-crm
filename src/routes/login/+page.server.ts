import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => ({
  configured: Boolean(locals.supabase)
});

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.supabase) {
      return fail(503, { error: 'Falta configurar Supabase en el servidor.' });
    }

    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Completá email y contraseña.', email });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return fail(400, { error: 'Email o contraseña incorrectos.', email });
    }

    throw redirect(303, '/');
  }
};
