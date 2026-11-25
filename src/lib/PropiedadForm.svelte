<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { OPERACIONES, ESTADOS_VENTA, ESTADOS_ALQUILER, MONEDAS } from './propiedades';

	let {
		values = {},
		error = null,
		campo = null,
		submitLabel = 'Guardar',
		asesores = []
	}: {
		values?: Record<string, string>;
		error?: string | null;
		campo?: string | null;
		submitLabel?: string;
		asesores?: { id: string; nombre: string }[];
	} = $props();

	const v = (k: string, d = '') => values[k] ?? d;

	// La operación elegida decide qué precios son obligatorios
	let operacion = $state(untrack(() => v('operacion', 'venta')));
	const necesitaVenta = $derived(operacion === 'venta' || operacion === 'ambas');
	const necesitaAlquiler = $derived(operacion === 'alquiler' || operacion === 'ambas');

	// Errores por campo: los que devuelve el servidor y los de validación en el navegador
	let errores = $state<Record<string, string>>({});
	let formEl = $state<HTMLFormElement>();

	$effect(() => {
		if (error && campo) errores = { [campo]: error };
	});

	// Un error se muestra solo si el campo sigue siendo necesario para la operación elegida
	const falla = (n: string) =>
		Boolean(errores[n]) &&
		(n === 'precio_venta' ? necesitaVenta : n === 'precio_alquiler' ? necesitaAlquiler : true);

	const cantidadErrores = $derived(Object.keys(errores).filter(falla).length);

	function validar(fd: FormData): Record<string, string> {
		const nuevos: Record<string, string> = {};
		if (!String(fd.get('direccion') ?? '').trim()) nuevos.direccion = 'Falta la dirección.';
		if (necesitaVenta && !String(fd.get('precio_venta') ?? '').trim()) {
			nuevos.precio_venta = 'Falta el precio de venta.';
		}
		if (necesitaAlquiler && !String(fd.get('precio_alquiler') ?? '').trim()) {
			nuevos.precio_alquiler = 'Falta el precio mensual de alquiler.';
		}
		return nuevos;
	}

	async function alEnviar(e: SubmitEvent) {
		if (!formEl) return;
		const nuevos = validar(new FormData(formEl));
		const nombres = Object.keys(nuevos);
		if (!nombres.length) return; // sin faltantes: sigue el envío al servidor
		e.preventDefault();
		errores = nuevos;
		await tick();
		(formEl.elements.namedItem(nombres[0]) as HTMLElement | null)?.focus();
	}

	function limpiar(n: string) {
		if (errores[n]) {
			const { [n]: _quitado, ...resto } = errores;
			errores = resto;
		}
	}
</script>

{#snippet aviso(nombre: string)}
	{#if falla(nombre)}
		<span class="campo-error" id="err-{nombre}">{errores[nombre]}</span>
	{/if}
{/snippet}

<form bind:this={formEl} method="POST" class="form" novalidate onsubmit={alEnviar}>
	{#if cantidadErrores}
		<p class="resumen" role="alert">Faltan datos. Revisá los campos marcados en rojo.</p>
	{:else if error && !campo}
		<p class="error" role="alert">{error}</p>
	{/if}

	<div class="grid">
		<label class="full">
			<span>Dirección <span class="req" aria-hidden="true">*</span></span>
			<input
				class="input"
				name="direccion"
				value={v('direccion')}
				aria-invalid={falla('direccion')}
				aria-describedby={falla('direccion') ? 'err-direccion' : undefined}
				oninput={() => limpiar('direccion')}
			/>
			{@render aviso('direccion')}
		</label>
		<label>Tipo
			<input class="input" name="tipo" value={v('tipo')} placeholder="Departamento, Casa, PH…" />
		</label>
		<label>
			<span>Operación <span class="req" aria-hidden="true">*</span></span>
			<select class="input" name="operacion" bind:value={operacion} aria-invalid={falla('operacion')}>
				{#each OPERACIONES as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</select>
			{@render aviso('operacion')}
		</label>
		<label>Asesor responsable
			<select class="input" name="asesor_id">
				<option value="" selected={!v('asesor_id')}>Sin asignar</option>
				{#each asesores as a (a.id)}
					<option value={a.id} selected={v('asesor_id') === a.id}>{a.nombre}</option>
				{/each}
			</select>
		</label>
		<label>Ambientes
			<input class="input" type="number" min="0" name="ambientes" value={v('ambientes')} aria-invalid={falla('ambientes')} oninput={() => limpiar('ambientes')} />
			{@render aviso('ambientes')}
		</label>
		<label>Dormitorios
			<input class="input" type="number" min="0" name="dormitorios" value={v('dormitorios')} aria-invalid={falla('dormitorios')} oninput={() => limpiar('dormitorios')} />
			{@render aviso('dormitorios')}
		</label>
		<label>Baños
			<input class="input" type="number" min="0" name="banos" value={v('banos')} aria-invalid={falla('banos')} oninput={() => limpiar('banos')} />
			{@render aviso('banos')}
		</label>
		<label>Superficie (m²)
			<input class="input" type="number" min="0" step="0.01" name="superficie_m2" value={v('superficie_m2')} aria-invalid={falla('superficie_m2')} oninput={() => limpiar('superficie_m2')} />
			{@render aviso('superficie_m2')}
		</label>
		<label>Antigüedad (años)
			<input class="input" type="number" min="0" name="antiguedad_anios" value={v('antiguedad_anios')} aria-invalid={falla('antiguedad_anios')} oninput={() => limpiar('antiguedad_anios')} />
			{@render aviso('antiguedad_anios')}
		</label>
		<label class="check">
			<input type="checkbox" name="cochera" checked={v('cochera') === 'true'} /> Tiene cochera
		</label>
	</div>

	<fieldset class="block" class:inactivo={!necesitaVenta}>
		<legend>Venta {#if !necesitaVenta}<span class="hint">· no aplica a esta operación</span>{/if}</legend>
		<div class="grid">
			<label>
				<span>Precio {#if necesitaVenta}<span class="req" aria-hidden="true">*</span>{/if}</span>
				<input class="input" type="number" min="0" step="1" name="precio_venta" value={v('precio_venta')} aria-invalid={falla('precio_venta')} oninput={() => limpiar('precio_venta')} />
				{@render aviso('precio_venta')}
			</label>
			<label>Moneda
				<select class="input" name="moneda_venta">
					{#each MONEDAS as m (m)}
						<option value={m} selected={v('moneda_venta', 'USD') === m}>{m}</option>
					{/each}
				</select>
			</label>
			<label>Estado
				<select class="input" name="estado_venta">
					{#each ESTADOS_VENTA as e (e)}
						<option value={e} selected={v('estado_venta', 'disponible') === e}>{e}</option>
					{/each}
				</select>
			</label>
		</div>
	</fieldset>

	<fieldset class="block" class:inactivo={!necesitaAlquiler}>
		<legend>Alquiler {#if !necesitaAlquiler}<span class="hint">· no aplica a esta operación</span>{/if}</legend>
		<div class="grid">
			<label>
				<span>Precio mensual {#if necesitaAlquiler}<span class="req" aria-hidden="true">*</span>{/if}</span>
				<input class="input" type="number" min="0" step="1" name="precio_alquiler" value={v('precio_alquiler')} aria-invalid={falla('precio_alquiler')} oninput={() => limpiar('precio_alquiler')} />
				{@render aviso('precio_alquiler')}
			</label>
			<label>Moneda
				<select class="input" name="moneda_alquiler">
					{#each MONEDAS as m (m)}
						<option value={m} selected={v('moneda_alquiler', 'ARS') === m}>{m}</option>
					{/each}
				</select>
			</label>
			<label>Estado
				<select class="input" name="estado_alquiler">
					{#each ESTADOS_ALQUILER as e (e)}
						<option value={e} selected={v('estado_alquiler', 'disponible') === e}>{e}</option>
					{/each}
				</select>
			</label>
		</div>
	</fieldset>

	<label class="full">Descripción
		<textarea class="input" name="descripcion" rows="5">{v('descripcion')}</textarea>
	</label>

	<label class="check">
		<input type="checkbox" name="publicada" checked={v('publicada', 'true') === 'true'} />
		Publicada (aparece en el feed para portales)
	</label>

	<div class="actions">
		<button class="btn btn-primary" type="submit">{submitLabel}</button>
	</div>
</form>

<style>
	.form { display: grid; gap: 16px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
	label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
	label.full { grid-column: 1 / -1; }
	label.check { display: flex; align-items: center; gap: 8px; color: var(--text); }
	.block { border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin: 0; transition: opacity 0.2s; }
	.block.inactivo { opacity: 0.55; }
	legend { padding: 0 6px; color: var(--muted); font-size: 13px; }
	.hint { font-size: 12px; font-style: italic; }
	.req { color: var(--danger); }
	.campo-error { color: var(--danger); font-size: 13px; }
	.input[aria-invalid='true'] { border-color: var(--danger); box-shadow: 0 0 0 1px var(--danger); }
	.resumen { color: var(--danger); margin: 0; font-weight: 600; }
	.error { color: var(--danger); margin: 0; }
	.actions { display: flex; justify-content: flex-end; }
</style>
