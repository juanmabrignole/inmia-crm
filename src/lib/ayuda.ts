export type Modulo = { id: string; titulo: string; rol: 'todos' | 'admin'; resumen: string; pasos: string[] };

export const primerosPasos = [
	'Entrá con el usuario y la contraseña que te pasó el administrador.',
	'Abrí Hoy: ahí ves lo que tenés que hacer en el día (contratos por vencer, últimos mensajes y accesos rápidos).',
	'Usá el menú de arriba para moverte entre módulos. En computadora está a la izquierda.'
];

export const modulos: Modulo[] = [
	{
		id: 'hoy',
		titulo: 'Hoy',
		rol: 'todos',
		resumen: 'Tu pantalla de inicio. Muestra lo urgente del día.',
		pasos: [
			'Revisá primero los contratos que vencen en los próximos 30 días.',
			'Desde los accesos rápidos podés cargar una propiedad, un inquilino o una consulta.',
			'Los últimos mensajes y propiedades cargadas aparecen abajo para retomar lo que dejaste.'
		]
	},
	{
		id: 'panel',
		titulo: 'Panel',
		rol: 'todos',
		resumen: 'Resumen de la cartera con números generales.',
		pasos: [
			'El admin ve los números de toda la inmobiliaria. El asesor ve solo los de sus propiedades.',
			'Sirve para tener una foto rápida antes de una reunión.'
		]
	},
	{
		id: 'agenda',
		titulo: 'Agenda',
		rol: 'todos',
		resumen: 'Vencimientos de contratos ordenados por fecha.',
		pasos: [
			'Vencidos: contratos que ya pasaron su fecha de vencimiento. Hay que contactar al inquilino o al propietario.',
			'Próximos 30 días y próximos 90 días: para planificar renovaciones con tiempo.',
			'Si un contrato no te aparece, revisá que esté a tu nombre o pedile al admin que lo reasigne.'
		]
	},
	{
		id: 'propiedades',
		titulo: 'Propiedades',
		rol: 'todos',
		resumen: 'Cargá y administrá cada propiedad de la cartera.',
		pasos: [
			'Para cargar una propiedad tocá "+ Nueva propiedad". Completá dirección, tipo, operación, precio, superficie y ambientes. Después guardá.',
			'Fotos: en la ficha de la propiedad subí varias fotos. La primera es la portada. Podés borrar las que no sirven.',
			'Compartir: en la ficha hay botones para enviar por WhatsApp o mail, y para copiar el link de la ficha pública.',
			'Solo las propiedades marcadas como publicadas aparecen en la ficha pública y en los portales.',
			'Vista previa para Mercado Libre: muestra qué datos faltan antes de publicar.',
			'Eliminar una propiedad borra también sus fotos y tasaciones, y no se puede deshacer.'
		]
	},
	{
		id: 'tasaciones',
		titulo: 'Tasaciones',
		rol: 'todos',
		resumen: 'Estimación de valor de mercado con comparables.',
		pasos: [
			'Entrá a la propiedad y tocá "+ Nueva tasación" en la sección Tasaciones.',
			'Cargá hasta 5 propiedades parecidas con precio y superficie. El ajuste % sube o baja el precio del comparable si es mejor o peor que la tuya.',
			'La vista previa muestra el valor sugerido y el rango mientras cargás.',
			'Al generar la tasación se abre el informe. Podés imprimirlo o guardarlo como PDF.',
			'Es una estimación orientativa. No reemplaza una tasación oficial, y el informe lo aclara.'
		]
	},
	{
		id: 'consultas',
		titulo: 'Consultas',
		rol: 'todos',
		resumen: 'Leads que llegan de portales, Facebook, landings o cargados a mano.',
		pasos: [
			'Las consultas nuevas aparecen en Pendientes. Cada una muestra hace cuánto llegó.',
			'Asesor: tocá "Tomar consulta" para asignártela. Admin: elegí el asesor y tocá "Asignar".',
			'Si la consulta no corresponde, marcala como borrada. Queda en su pestaña por si hay que recuperarla.',
			'Al cargar una consulta a mano, el sistema avisa si ya existe por email o teléfono. Podés guardarla igual si es otra persona.',
			'Respondé rápido: la primera respuesta es la que más pesa para cerrar.'
		]
	},
	{
		id: 'inquilinos',
		titulo: 'Inquilinos',
		rol: 'todos',
		resumen: 'Inquilinos con sus contratos y el historial de contactos.',
		pasos: [
			'Cargá al inquilino con sus datos de contacto desde "+ Nuevo inquilino".',
			'En su ficha registrá cada contacto (nota, WhatsApp, mail o llamada). Así cualquier asesor sabe qué pasó antes.',
			'Los contratos del inquilino aparecen en su ficha.',
			'Solo el admin puede eliminar un inquilino.'
		]
	},
	{
		id: 'contratos',
		titulo: 'Contratos',
		rol: 'todos',
		resumen: 'Contratos de alquiler con fechas de vencimiento.',
		pasos: [
			'Para cargar un contrato tocá "+ Nuevo contrato" y elegí propiedad e inquilino. Completá fechas, monto y día de pago.',
			'Al guardarlo, la propiedad pasa automáticamente a "alquilada".',
			'El contrato queda a tu nombre si sos asesor. El admin puede asignarle otro asesor.',
			'Los vencimientos se ven en Agenda y en Hoy.'
		]
	},
	{
		id: 'asesores',
		titulo: 'Asesores',
		rol: 'admin',
		resumen: 'El equipo de asesores de la inmobiliaria.',
		pasos: [
			'Cargá cada asesor con su nombre, mail y teléfono. Esos datos se usan en la ficha pública y en los WhatsApp de las propiedades.',
			'Un asesor inactivo no aparece para asignarle nuevas propiedades, consultas o contratos.',
			'Solo el admin puede crear o editar asesores.'
		]
	},
	{
		id: 'equipo',
		titulo: 'Equipo',
		rol: 'admin',
		resumen: 'Quién ve qué dentro del CRM.',
		pasos: [
			'Admin: ve todas las propiedades, consultas y contratos de la inmobiliaria.',
			'Asesor: ve solo lo asignado a su nombre.',
			'Para cada usuario elegí el rol y el asesor vinculado. Sin asesor vinculado, un asesor no puede cargar propiedades ni contratos.',
			'Para sumar a alguien: 1) cargalo en Asesores, 2) pedile a quien administra el CRM que lo invite, 3) asignalo en Equipo.'
		]
	}
];

// Texto de la guía en una sola cadena, para darle contexto al asistente.
export function contextoAyuda(): string {
  const partes = primerosPasos.map((p) => `- ${p}`);
  for (const m of modulos) {
    partes.push(`\n${m.titulo}${m.rol === 'admin' ? ' (solo admin)' : ''}: ${m.resumen}`);
    partes.push(...m.pasos.map((p) => `- ${p}`));
  }
  return partes.join('\n');
}
