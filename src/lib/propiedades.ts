export const OPERACIONES = [
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'ambas', label: 'Venta y alquiler' }
] as const;

export const ESTADOS_VENTA = ['disponible', 'reservada', 'vendida'] as const;
export const ESTADOS_ALQUILER = ['disponible', 'reservada', 'alquilada'] as const;
export const MONEDAS = ['USD', 'ARS'] as const;

export type Operacion = 'venta' | 'alquiler' | 'ambas';

export type PropiedadInput = {
  direccion: string;
  tipo: string | null;
  operacion: Operacion;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_m2: number | null;
  antiguedad_anios: number | null;
  cochera: boolean;
  descripcion: string | null;
  precio_venta: number | null;
  moneda_venta: string;
  estado_venta: string;
  precio_alquiler: number | null;
  moneda_alquiler: string;
  estado_alquiler: string;
  publicada: boolean;
  asesor_id: string | null;
};

const txt = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? '').trim();
  return v === '' ? null : v;
};
const num = (f: FormData, k: string) => {
  const v = txt(f, k);
  if (v === null) return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};

// Convierte el formulario en datos válidos o devuelve el primer error.
export function parsePropiedad(form: FormData): { data?: PropiedadInput; error?: string } {
  const direccion = txt(form, 'direccion');
  if (!direccion) return { error: 'La dirección es obligatoria.' };

  const operacion = String(form.get('operacion') ?? '') as Operacion;
  if (!['venta', 'alquiler', 'ambas'].includes(operacion)) return { error: 'Elegí una operación válida.' };

  const numeros = ['ambientes', 'dormitorios', 'banos', 'superficie_m2', 'antiguedad_anios', 'precio_venta', 'precio_alquiler'];
  for (const k of numeros) {
    if (Number.isNaN(num(form, k))) return { error: `Revisá el valor de ${k.replace('_', ' ')}.` };
  }

  const precioVenta = num(form, 'precio_venta') as number | null;
  const precioAlquiler = num(form, 'precio_alquiler') as number | null;
  if ((operacion === 'venta' || operacion === 'ambas') && precioVenta === null) {
    return { error: 'Falta el precio de venta.' };
  }
  if ((operacion === 'alquiler' || operacion === 'ambas') && precioAlquiler === null) {
    return { error: 'Falta el precio de alquiler.' };
  }

  return {
    data: {
      direccion,
      tipo: txt(form, 'tipo'),
      operacion,
      ambientes: num(form, 'ambientes') as number | null,
      dormitorios: num(form, 'dormitorios') as number | null,
      banos: num(form, 'banos') as number | null,
      superficie_m2: num(form, 'superficie_m2') as number | null,
      antiguedad_anios: num(form, 'antiguedad_anios') as number | null,
      cochera: form.get('cochera') === 'on',
      descripcion: txt(form, 'descripcion'),
      precio_venta: precioVenta,
      moneda_venta: String(form.get('moneda_venta') ?? 'USD'),
      estado_venta: String(form.get('estado_venta') ?? 'disponible'),
      precio_alquiler: precioAlquiler,
      moneda_alquiler: String(form.get('moneda_alquiler') ?? 'ARS'),
      estado_alquiler: String(form.get('estado_alquiler') ?? 'disponible'),
      publicada: form.get('publicada') === 'on',
      asesor_id: txt(form, 'asesor_id')
    }
  };
}

// Ruta interna de Storage a partir de la URL pública guardada en la tabla fotos.
export function storagePathFromUrl(url: string): string | null {
  const marker = '/object/public/propiedades/';
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}
