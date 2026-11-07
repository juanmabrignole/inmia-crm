import type { RequestHandler } from './$types';

const escapeXml = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const tag = (name: string, value: unknown) =>
  value === null || value === undefined || value === '' ? '' : `    <${name}>${escapeXml(value)}</${name}>\n`;

export const GET: RequestHandler = async ({ locals }) => {
  const { data, error } = await locals.supabase!
    .from('propiedades')
    .select(
      'id, direccion, tipo, operacion, ambientes, dormitorios, banos, superficie_m2, antiguedad_anios, cochera, descripcion, precio_venta, moneda_venta, estado_venta, precio_alquiler, moneda_alquiler, estado_alquiler, created_at, fotos(url, orden), asesores(nombre, email, telefono)'
    )
    .eq('publicada', true)
    .order('created_at', { ascending: false });

  if (error) return new Response('Error al generar el feed', { status: 500 });

  const items = (data ?? []).map((p) => {
    const fotos = [...(p.fotos ?? [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    const venta = p.operacion !== 'alquiler' && p.estado_venta === 'disponible';
    const alquiler = p.operacion !== 'venta' && p.estado_alquiler === 'disponible';
    if (!venta && !alquiler) return '';

    return (
      `  <propiedad id="${escapeXml(p.id)}">\n` +
      tag('direccion', p.direccion) +
      tag('tipo', p.tipo) +
      tag('operacion', p.operacion) +
      tag('ambientes', p.ambientes) +
      tag('dormitorios', p.dormitorios) +
      tag('banos', p.banos) +
      tag('superficie_m2', p.superficie_m2) +
      tag('antiguedad_anios', p.antiguedad_anios) +
      tag('cochera', p.cochera ? 'si' : 'no') +
      (venta ? tag('precio_venta', p.precio_venta) + tag('moneda_venta', p.moneda_venta) : '') +
      (alquiler ? tag('precio_alquiler', p.precio_alquiler) + tag('moneda_alquiler', p.moneda_alquiler) : '') +
      tag('descripcion', p.descripcion) +
      (fotos.length ? `    <fotos>\n${fotos.map((f) => `      <foto>${escapeXml(f.url)}</foto>\n`).join('')}    </fotos>\n` : '') +
      (p.asesores ? `    <asesor>\n` + tag('nombre', p.asesores.nombre) + tag('email', p.asesores.email) + tag('telefono', p.asesores.telefono) + `    </asesor>\n` : '') +
      tag('actualizado', p.created_at) +
      `  </propiedad>\n`
    );
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<propiedades generado="${new Date().toISOString()}">\n` +
    items.join('') +
    `</propiedades>\n`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300'
    }
  });
};
