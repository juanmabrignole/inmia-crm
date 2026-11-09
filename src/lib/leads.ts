// Lógica de consultas (leads): normalización para detectar duplicados, parseo del formulario y formato de fechas.

export const ESTADOS_LEAD = ['pendiente', 'asignado', 'borrado'] as const;
export type EstadoLead = (typeof ESTADOS_LEAD)[number];

export const ETIQUETAS_ESTADO: Record<EstadoLead, string> = {
	pendiente: 'Pendientes',
	asignado: 'Asignadas',
	borrado: 'Borradas'
};

// "Juan@Mail.com " → "juan@mail.com"
export function normalizarEmail(e: string | null | undefined): string | null {
	const v = (e ?? '').trim().toLowerCase();
	return v || null;
}

// Usa los últimos 8 dígitos para que coincidan +54 11..., 011... y 11... del mismo número.
export function normalizarTelefono(t: string | null | undefined): string | null {
	const d = (t ?? '').replace(/\D/g, '');
	return d.length >= 8 ? d.slice(-8) : null;
}

export type LeadInput = {
	nombre: string | null;
	email: string | null;
	telefono: string | null;
	email_norm: string | null;
	telefono_norm: string | null;
	mensaje: string | null;
	origen: string | null;
	etiquetas: string[];
};

const texto = (f: FormData, k: string) => {
	const v = String(f.get(k) ?? '').trim();
	return v || null;
};

export function parseLead(form: FormData): { data?: LeadInput; error?: string } {
	const email = texto(form, 'email');
	const telefono = texto(form, 'telefono');
	const email_norm = normalizarEmail(email);
	const telefono_norm = normalizarTelefono(telefono);

	if (!email_norm && !telefono_norm) return { error: 'Cargá un email o un teléfono para poder contactar.' };
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'El email no parece válido.' };

	const etiquetas = (texto(form, 'etiquetas') ?? '')
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean);

	return {
		data: {
			nombre: texto(form, 'nombre'),
			email,
			telefono,
			email_norm,
			telefono_norm,
			mensaje: texto(form, 'mensaje'),
			origen: texto(form, 'origen'),
			etiquetas
		}
	};
}

// "hace 2 días", "hace 3 horas", "recién"
const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });
export function hace(fecha: string | Date): string {
	const segundos = (Date.now() - new Date(fecha).getTime()) / 1000;
	const unidades: [Intl.RelativeTimeFormatUnit, number][] = [
		['day', 86400],
		['hour', 3600],
		['minute', 60]
	];
	for (const [unidad, valor] of unidades) {
		if (Math.abs(segundos) >= valor) return rtf.format(-Math.round(segundos / valor), unidad);
	}
	return 'recién';
}
