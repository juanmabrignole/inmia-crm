import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parsePropiedad, storagePathFromUrl } from '../../../lib/propiedades';

const BUCKET = 'propiedades';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error: dbError } = await locals.supabase!
    .from('propiedades')
    .select('*, fotos(id, url, orden)')
    .eq('id', params.id)
    .single();

  if (dbError || !data) throw error(404, 'Propiedad no encontrada');

  const fotos = [...(data.fotos ?? [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const { data: asesores } = await locals.supabase!
    .from('asesores')
    .select('id, nombre')
    .or(`activo.eq.true,id.eq.${data.asesor_id ?? '00000000-0000-0000-0000-000000000000'}`)
    .order('nombre');
  return { propiedad: data, fotos, asesores: asesores ?? [] };
};

export const actions: Actions = {
  guardar: async ({ request, locals, params }) => {
    const form = await request.formData();
    const parsed = parsePropiedad(form);
    if (parsed.error || !parsed.data) return fail(400, { error: parsed.error ?? 'Revisá los datos.' });

    const { error: dbError } = await locals.supabase!
      .from('propiedades')
      .update(parsed.data)
      .eq('id', params.id);

    if (dbError) return fail(500, { error: dbError.message });
    return { ok: 'Cambios guardados.' };
  },

  subirFotos: async ({ request, locals, params }) => {
    const sb = locals.supabase!;
    const form = await request.formData();
    const files = form.getAll('fotos').filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) return fail(400, { errorFotos: 'Elegí al menos una foto.' });

    const { count } = await sb
      .from('fotos')
      .select('id', { count: 'exact', head: true })
      .eq('propiedad_id', params.id);
    let orden = count ?? 0;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${params.id}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false
      });
      if (upErr) return fail(500, { errorFotos: upErr.message });

      const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
      const { error: rowErr } = await sb
        .from('fotos')
        .insert({ propiedad_id: params.id, url: pub.publicUrl, orden: orden++ });
      if (rowErr) return fail(500, { errorFotos: rowErr.message });
    }

    return { okFotos: 'Fotos subidas.' };
  },

  borrarFoto: async ({ request, locals }) => {
    const sb = locals.supabase!;
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const url = String(form.get('url') ?? '');
    const path = storagePathFromUrl(url);

    if (path) await sb.storage.from(BUCKET).remove([path]);
    const { error: dbError } = await sb.from('fotos').delete().eq('id', id);
    if (dbError) return fail(500, { errorFotos: dbError.message });
    return { okFotos: 'Foto eliminada.' };
  },

  eliminar: async ({ locals, params }) => {
    const sb = locals.supabase!;

    // Borra también los archivos de la carpeta de la propiedad
    const { data: archivos } = await sb.storage.from(BUCKET).list(params.id);
    if (archivos?.length) {
      await sb.storage.from(BUCKET).remove(archivos.map((a) => `${params.id}/${a.name}`));
    }

    const { error: dbError } = await sb.from('propiedades').delete().eq('id', params.id);
    if (dbError) return fail(500, { error: dbError.message });
    throw redirect(303, '/propiedades');
  }
};
