<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const r = $derived(data.resultado);
	const json = $derived(JSON.stringify(r.payload, null, 2));
</script>

<svelte:head>
	<title>Mercado Libre · {data.propiedad.direccion} · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/propiedades/{data.propiedad.id}">← Volver a la propiedad</a>
	<h1>Vista previa para Mercado Libre</h1>
	<p class="muted">
		Así quedaría el aviso con los datos actuales. Todavía no se envía nada: primero hay que resolver lo que figura abajo.
	</p>

	<section class="card">
		<h2>Pendientes</h2>
		{#if r.faltantes.length}
			<ul>
				{#each r.faltantes as f}<li>{f}</li>{/each}
			</ul>
		{:else}
			<p class="ok">No faltan datos para publicar.</p>
		{/if}
		{#if r.advertencias.length}
			<h3>Para revisar</h3>
			<ul>
				{#each r.advertencias as a}<li>{a}</li>{/each}
			</ul>
		{/if}
	</section>

	<section class="card">
		<h2>JSON que se enviaría a POST /items</h2>
		<pre>{json}</pre>
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; color: var(--text); font-size: 24px; }
	h2 { margin: 0 0 12px; font-size: 17px; color: var(--text); }
	h3 { margin: 16px 0 8px; font-size: 15px; color: var(--text); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.muted { color: var(--muted); margin: 0; }
	.ok { color: var(--success); margin: 0; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); margin: 0; }
	ul { margin: 0; padding-left: 20px; color: var(--text); display: grid; gap: 6px; }
	pre { margin: 0; overflow: auto; font-size: 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 12px; color: var(--text); }
</style>
