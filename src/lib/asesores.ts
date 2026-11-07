export type AsesorInput = {
  nombre: string;
  email: string | null;
  telefono: string | null;
  activo: boolean;
};

const txt = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? '').trim();
  return v === '' ? null : v;
};

// Convierte el formulario en datos válidos o devuelve el primer error.
export function parseAsesor(form: FormData): { data?: AsesorInput; error?: string } {
  const nombre = txt(form, 'nombre');
  if (!nombre) return { error: 'El nombre es obligatorio.' };

  const email = txt(form, 'email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'El email no parece válido.' };

  return {
    data: {
      nombre,
      email,
      telefono: txt(form, 'telefono'),
      activo: form.get('activo') === 'on'
    }
  };
}
