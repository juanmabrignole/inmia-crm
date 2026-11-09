// Lógica de la estimación de valor (tasador orientativo).
// Se usa en el formulario (vista previa) y en el servidor (valor que se guarda).

export const N_COMPARABLES = 5;
export const OPERACIONES_TASACION = ['venta', 'alquiler'] as const;
export const MONEDAS_TASACION = ['USD', 'ARS'] as const;
export const CAMPOS_COMPARABLE = [
  'direccion',
  'precio',
  'superficie_m2',
  'ambientes',
  'antiguedad_anios',
  'distancia_m',
  'ajuste_pct'
] as const;

export type FilaComparable = Record<(typeof CAMPOS_COMPARABLE)[number], string>;

export type ComparableInput = {
  direccion: string;
  precio: number;
  superficie_m2: number | null;
  ambientes: number | null;
  antiguedad_anios: number | null;
  distancia_m: number | null;
  ajuste_pct: number;
};

export type Resultado = {
  promedio_m2: number;
  valor_sugerido: number;
  valor_minimo: number;
  valor_maximo: number;
};

// Convierte texto de formulario a número. Acepta coma decimal y espacios.
function num(v: string | null | undefined): number | null {
  if (v == null) return null;
  const s = String(v).trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const entero = (v: string | null | undefined): number | null => {
  const n = num(v);
  return n == null ? null : Math.round(n);
};

// Una fila sin dirección o sin precio válido se descarta.
export function filaAComparable(f: FilaComparable): ComparableInput | null {
  const precio = num(f.precio);
  const direccion = f.direccion.trim();
  if (!direccion || precio == null || precio <= 0) return null;
  return {
    direccion,
    precio,
    superficie_m2: num(f.superficie_m2),
    ambientes: entero(f.ambientes),
    antiguedad_anios: entero(f.antiguedad_anios),
    distancia_m: num(f.distancia_m),
    ajuste_pct: num(f.ajuste_pct) ?? 0
  };
}

// Precio por m² de cada comparable (ajustado) → promedio × superficie de la propiedad.
// Rango: ±5% alrededor del valor sugerido.
export function calcularValor(comps: ComparableInput[], superficie: number | null): Resultado | null {
  if (!superficie || superficie <= 0) return null;
  const m2 = comps
    .filter((c) => c.superficie_m2 != null && c.superficie_m2 > 0)
    .map((c) => (c.precio * (1 + c.ajuste_pct / 100)) / (c.superficie_m2 as number));
  if (!m2.length) return null;

  const promedio = m2.reduce((a, b) => a + b, 0) / m2.length;
  const sugerido = promedio * superficie;
  return {
    promedio_m2: promedio,
    valor_sugerido: Math.round(sugerido),
    valor_minimo: Math.round(sugerido * 0.95),
    valor_maximo: Math.round(sugerido * 1.05)
  };
}

function texto(form: FormData, key: string): string | null {
  const t = String(form.get(key) ?? '').trim();
  return t || null;
}

export function parseTasacion(form: FormData): {
  data?: {
    operacion: (typeof OPERACIONES_TASACION)[number];
    moneda: (typeof MONEDAS_TASACION)[number];
    tasador: string | null;
    notas: string | null;
    comparables: ComparableInput[];
  };
  error?: string;
} {
  const operacion = OPERACIONES_TASACION.find((o) => o === form.get('operacion'));
  const moneda = MONEDAS_TASACION.find((m) => m === form.get('moneda'));
  if (!operacion) return { error: 'Operación no válida.' };
  if (!moneda) return { error: 'Moneda no válida.' };

  const comparables: ComparableInput[] = [];
  for (let i = 0; i < N_COMPARABLES; i++) {
    const fila = Object.fromEntries(
      CAMPOS_COMPARABLE.map((k) => [k, String(form.get(`comp_${i}_${k}`) ?? '')])
    ) as FilaComparable;
    const c = filaAComparable(fila);
    if (c) comparables.push(c);
  }
  if (!comparables.length) return { error: 'Cargá al menos un comparable con dirección y precio.' };

  return {
    data: {
      operacion,
      moneda,
      tasador: texto(form, 'tasador'),
      notas: texto(form, 'notas'),
      comparables
    }
  };
}
