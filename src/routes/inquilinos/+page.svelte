<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Inquilinos · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header class="head">
		<div>
			<h1>Inquilinos</h1>
			<p class="muted">Personas con contratos de alquiler y su historial de contacto.</p>
		</div>
		<a class="btn btn-primary" href="/inquilinos/nuevo">+ Nuevo inquilino</a>
	</header>

	{#if data.inquilinos.length}
		<div class="cards">
			{#each data.inquilinos as i (i.id)}
				<a class="card" href={`/inquilinos/${i.id}`}>
					<strong>{i.nombre}</strong>
					<span class="muted small">{i.telefono ?? 'Sin teléfono'}</span>
					<span class="muted small">{i.email ?? 'Sin email'}</span>
					<span class="pill">{i.contratos} contrato{i.contratos === 1 ? '' : 's'} activo{i.contratos === 1 ? '' : 's'}</span>
				</a>
			{/each}
		</div>
	{:else}
		<p class="card muted">Todavía no hay inquilinos cargados.</p>
	{/if}
</main>

<style>
	.wrap { max-width: 1140px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 18px; }
	.head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
	h1 { margin: 0; font-size: 26px; color: var(--text); }
	.muted { color: var(--muted); margin: 0; }
	.small { font-size: 13px; }
	.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
	.card { display: grid; gap: 4px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); color: var(--text); text-decoration: none; }
	a.card:hover { border-color: var(--border-strong); }
	.pill { justify-self: start; margin-top: 6px; font-size: 12px; padding: 3px 10px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; }
</style>
