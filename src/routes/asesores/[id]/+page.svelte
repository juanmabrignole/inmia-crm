<script lang="ts">
	import AsesorForm from '../../../lib/AsesorForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const a = $derived(data.asesor);
	const valores = $derived({
		nombre: a.nombre ?? '',
		email: a.email ?? '',
		telefono: a.telefono ?? '',
		activo: String(a.activo ?? true)
	});
	const etiquetaOperacion = { venta: 'Venta', alquiler: 'Alquiler', ambas: 'Venta y alquiler' } as const;
</script>

<svelte:head>
	<title>{a.nombre} · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/asesores">← Volver a asesores</a>
	<h1>{a.nombre}</h1>

	<section class="card">
		<h2>Datos de contacto</h2>
		<AsesorForm values={valores} error={form?.error ?? null} submitLabel="Guardar cambios" />
		{#if form?.ok}<p class="ok">{form.ok}</p>{/if}
	</section>

	<section class="card">
		<h2>Propiedades asignadas ({data.propiedades.length})</h2>
		{#if data.propiedades.length}
			<ul class="lista">
				{#each data.propiedades as p (p.id)}
					<li>
						<a href={`/propiedades/${p.id}`}>{p.direccion}</a>
						<span class="muted small">{etiquetaOperacion[p.operacion as keyof typeof etiquetaOperacion] ?? p.operacion}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="muted">Todavía no tiene propiedades. Podés asignarlo desde el formulario de cada propiedad.</p>
		{/if}
	</section>

	<section class="card peligro">
		<h2>Eliminar asesor</h2>
		<p class="muted small">Sus propiedades quedan sin asesor asignado. No se puede deshacer.</p>
		<form method="POST" action="?/eliminar" onsubmit={(e) => { if (!confirm('¿Eliminar este asesor?')) e.preventDefault(); }}>
			<button class="btn btn-danger" type="submit">Eliminar asesor</button>
		</form>
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	h2 { margin: 0 0 12px; font-size: 17px; color: var(--text); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
	.peligro { border-color: var(--danger); }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.ok { color: var(--success); }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
	.lista li { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; }
	.lista a { color: var(--link); }
	form { margin: 0; }
</style>
