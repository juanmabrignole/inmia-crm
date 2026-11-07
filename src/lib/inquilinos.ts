export const CANALES = ['nota', 'whatsapp', 'email', 'llamada'] as const;
export const MONEDAS_CONTRATO = ['ARS', 'USD'] as const;

const txt = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? '').trim();
  return v === '' ? null : v;
};

// Días entre hoy y una fecha YYYY-MM-DD (negativo si ya venció).
export function diasHasta(fecha: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const f = new Date(fecha + 'T00:00:00');
  return Math.round((f.getTime() - hoy.getTime()) / 86400000);
}

export function parseInquilino(form: FormData): { data?: Record<string, unknown>; error?: string } {
  const nombre = txt(form, 'nombre');
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  const email = txt(form, 'email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'El email no parece válido.' };
  return { data: { nombre, email, telefono: txt(form, 'telefono'), notas: txt(form, 'notas') } };
}

export function parseContrato(form: FormData): { data?: Record<string, unknown>; error?: string } {
  const propiedad_id = txt(form, 'propiedad_id');
  const inquilino_id = txt(form, 'inquilino_id');
  if (!propiedad_id || !inquilino_id) return { error: 'Elegí la propiedad y el inquilino.' };

  const fecha_inicio = txt(form, 'fecha_inicio');
  const fecha_vencimiento = txt(form, 'fecha_vencimiento');
  if (!fecha_inicio || !fecha_vencimiento) return { error: 'Cargá las fechas de inicio y vencimiento.' };
  if (fecha_vencimiento <= fecha_inicio) return { error: 'El vencimiento tiene que ser posterior al inicio.' };

  const montoRaw = txt(form, 'monto');
  const monto = montoRaw === null ? null : Number(montoRaw.replace(',', '.'));
  if (monto !== null && !Number.isFinite(monto)) return { error: 'Revisá el monto.' };

  const diaRaw = txt(form, 'dia_pago');
  const dia_pago = diaRaw === null ? null : Number(diaRaw);
  if (dia_pago !== null && !(Number.isInteger(dia_pago) && dia_pago >= 1 && dia_pago <= 31)) {
    return { error: 'El día de pago tiene que ser entre 1 y 31.' };
  }

  const moneda = String(form.get('moneda') ?? 'ARS');
  if (!(MONEDAS_CONTRATO as readonly string[]).includes(moneda)) return { error: 'Moneda no válida.' };

  return {
    data: {
      propiedad_id,
      inquilino_id,
      asesor_id: txt(form, 'asesor_id'),
      fecha_inicio,
      fecha_vencimiento,
      monto,
      moneda,
      dia_pago,
      activo: true,
      notas: txt(form, 'notas')
    }
  };
}

export function parseMensaje(form: FormData): { data?: Record<string, unknown>; error?: string } {
  const canal = String(form.get('canal') ?? 'nota');
  if (!(CANALES as readonly string[]).includes(canal)) return { error: 'Canal no válido.' };
  const contenido = txt(form, 'contenido');
  if (!contenido) return { error: 'Escribí el mensaje.' };
  return { data: { canal, contenido, propiedad_id: txt(form, 'propiedad_id') } };
}
