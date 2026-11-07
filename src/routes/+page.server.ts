import type { PageServerLoad } from './$types';

type Foto = { url: string; orden: number | null };
type Prop = {
  id: string;
  direccion: string;
  tipo: string | null;
  operacion: 'venta' | 'alquiler' | 'ambas';
  estado_venta: string;
  estado_alquiler: string;
  precio_venta: number | null;
  moneda_venta: string | null;
  precio_alquiler: number | null;
  moneda_alquiler: string | null;
  created_at: string;
  fotos: Foto[];
};
type Tas = {
  id: string;
  fecha: string;
  valor_sugerido: number | null;
  moneda: string;
  propiedades: { direccion: string } | null;
};

export const load: PageServerLoad = async ({ locals }) => {
  const sb = locals.supabase;
  if (!sb) throw new Error('Supabase no configurado');

  const [{ data: propsData, error: propsError }, { data: tasData, error: tasError }] = await Promise.all([
    sb
      .from('propiedades')
      .select(
        'id, direccion, tipo, operacion, estado_venta, estado_alquiler, precio_venta, moneda_venta, precio_alquiler, moneda_alquiler, created_at, fotos(url, orden)'
      )
      .order('created_at', { ascending: false }),
    sb
      .from('tasaciones')
      .select('id, fecha, valor_sugerido, moneda, propiedades(direccion)')
      .order('fecha', { ascending: false })
  ]);

  const props = (propsData ?? []) as unknown as Prop[];
  const tas = (tasData ?? []) as unknown as Tas[];

  const enVenta = props.filter(
    (p) => (p.operacion === 'venta' || p.operacion === 'ambas') && p.estado_venta === 'disponible'
  ).length;
  const enAlquiler = props.filter(
    (p) => (p.operacion === 'alquiler' || p.operacion === 'ambas') && p.estado_alquiler === 'disponible'
  ).length;
  const reservadas = props.filter(
    (p) => p.estado_venta === 'reservada' || p.estado_alquiler === 'reservada'
  ).length;

  const hace30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const tas30 = tas.filter((t) => new Date(t.fecha).getTime() >= hace30).length;

  // Serie de tasaciones de los últimos 6 meses
  const ahora = new Date();
  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', ''),
      count: 0
    };
  });
  for (const t of tas) {
    const d = new Date(t.fecha);
    const m = meses.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (m) m.count++;
  }

  return {
    stats: { total: props.length, enVenta, enAlquiler, reservadas, tas30 },
    serie: meses.map(({ label, count }) => ({ label, count })),
    recientes: props.slice(0, 6).map((p) => ({
      ...p,
      foto:
        [...(p.fotos ?? [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))[0]?.url ?? null
    })),
    ultimasTasaciones: tas.slice(0, 5),
    debug: {
      filasPropiedades: props.length,
      filasTasaciones: tas.length,
      errorPropiedades: propsError?.message ?? null,
      errorTasaciones: tasError?.message ?? null
    }
  };
};
