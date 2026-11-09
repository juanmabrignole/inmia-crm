<script lang="ts">
	import {
		calcularValor,
		filaAComparable,
		N_COMPARABLES,
		type ComparableInput,
		type FilaComparable
	} from '../../../../lib/tasacion';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const vacia = (): FilaComparable => ({
		direccion: '',
		precio: '',
		superficie_m2: '',
		ambientes: '',
		antiguedad_anios: '',
		distancia_m: '',
		ajuste_pct: '0'
	});

	let moneda = $state<'USD' | 'ARS'>('USD');
	let filas = $state<FilaComparable[]>(Array.from({ length: N_COMPARABLES }, vacia));

	const superficie = $derived(data.propiedad.superficie_m2 ?? null);
	const comps = $derived(
		filas.map((f) => filaAComparable(f)).filter((c): c is ComparableInput => c !== null)
	);
	const preview = $derived(calcularValor(comps, superficie));

	const fmt = (n: number) =>
		new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(n);
</script>

<svelte:head>
	<title>Tasar · {data.propiedad.direccion} · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/propiedades/{data.propiedad.id}">← Volver a la propiedad</a>
	<h1>Tasar: {data.propiedad.direccion}</h1>
	<p class="muted">
		Cargá hasta {N_COMPARABLES} propiedades parecidas. El ajuste % sube o baja el precio del comparable
		(por ejemplo, −10 si es mejor que la tuya, +5 si es peor).
	</p>

	{#if !superficie}
		<p class="error card">Esta propiedad no tiene superficie cargada. Completala antes de tasar.</p>
	{/if}

	<section class="card preview">
		<h2>Vista previa</h2>
		{#if preview}
			<p class="valor">Valor sugerido <strong>{fmt(preview.valor_sugerido)}</strong></p>
			<p>Rango {fmt(preview.valor_minimo)} – {fmt(preview.valor_maximo)}</p>
			<p class="muted small">Promedio ajustado: {fmt(preview.promedio_m2)} por m²</p>
		{:else}
			<p class="muted">Completá al menos un comparable con dirección, precio y superficie para ver el cálculo.</p>
		{/if}
		<p class="muted small">Es una vista previa. El valor que se guarda lo calcula el servidor con los mismos datos.</p>
	</section>

	<form method="POST" class="card form">
		{#if form?.error}<p class="error">{form.error}</p>{/if}

		<div class="grid">
			<label>Operación
				<select class="input" name="operacion">
					<option value="venta">Venta</option>
					<option value="alquiler">Alquiler</option>
				</select>
			</label>
			<label>Moneda
				<select class="input" name="moneda" bind:value={moneda}>
					<option value="USD">USD</option>
					<option value="ARS">ARS</option>
				</select>
			</label>
			<label>Tasador
				<input class="input" name="tasador" placeholder="Ej: Juan Pérez" />
			</label>
		</div>

		{#each filas as fila, i (i)}
			<fieldset class="comp">
				<legend>Comparable {i + 1}</legend>
				<div class="grid">
					<label class="full">Dirección
						<input class="input" name="comp_{i}_direccion" bind:value={fila.direccion} />
					</label>
					<label>Precio ({moneda})
						<input class="input" inputmode="decimal" name="comp_{i}_precio" bind:value={fila.precio} />
					</label>
					<label>Superficie (m²)
						<input class="input" inputmode="decimal" name="comp_{i}_superficie_m2" bind:value={fila.superficie_m2} />
					</label>
					<label>Ambientes
						<input class="input" inputmode="numeric" name="comp_{i}_ambientes" bind:value={fila.ambientes} />
					</label>
					<label>Antigüedad (años)
						<input class="input" inputmode="numeric" name="comp_{i}_antiguedad_anios" bind:value={fila.antiguedad_anios} />
					</label>
					<label>Distancia (m)
						<input class="input" inputmode="decimal" name="comp_{i}_distancia_m" bind:value={fila.distancia_m} />
					</label>
					<label>Ajuste (%)
						<input class="input" inputmode="decimal" name="comp_{i}_ajuste_pct" bind:value={fila.ajuste_pct} />
					</label>
				</div>
			</fieldset>
		{/each}

		<label>Observaciones
			<textarea class="input" name="notas" rows="3" placeholder="Estado, luminosidad, detalles que suman o restan"></textarea>
		</label>

		<div class="actions">
			<button class="btn btn-primary" type="submit" disabled={!superficie}>Generar tasación e informe</button>
		</div>
	</form>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 14px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	h2 { margin: 0 0 8px; font-size: 18px; color: var(--text); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.muted { color: var(--muted); margin: 0; }
	.small { font-size: 13px; }
	.error { color: var(--danger); margin: 0; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); margin: 0; }
	.preview p { margin: 4px 0; color: var(--text); }
	.valor strong { font-size: 22px; color: var(--primary); }
	.form { display: grid; gap: 16px; }
	.grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
	label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
	label.full { grid-column: 1 / -1; }
	.comp { border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin: 0; display: grid; gap: 10px; }
	.comp legend { padding: 0 6px; font-weight: 600; color: var(--text); }
	.actions { display: flex; justify-content: flex-end; }
	.actions button:disabled { opacity: 0.5; cursor: not-allowed; }

	@media (min-width: 601px) {
		.grid { grid-template-columns: repeat(3, 1fr); }
		.comp .grid { grid-template-columns: repeat(3, 1fr); }
	}
</style>
