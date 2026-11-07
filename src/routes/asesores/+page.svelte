<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const iniciales = (nombre: string) =>
		nombre.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
</script>

<svelte:head>
	<title>Asesores · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header class="head">
		<div>
			<h1>Asesores</h1>
			<p class="muted">Equipo que carga y comparte propiedades.</p>
		</div>
		<a class="btn btn-primary" href="/asesores/nueva">+ Nuevo asesor</a>
	</header>

	{#if data.asesores.length}
		<div class="cards">
			{#each data.asesores as a (a.id)}
				<a class="card" href={`/asesores/${a.id}`}>
					<div class="avatar" aria-hidden="true">{iniciales(a.nombre)}</div>
					<div class="info">
						<strong>{a.nombre}</strong>
						<span class="muted small">{a.email ?? 'Sin email'}</span>
						<span class="muted small">{a.telefono ?? 'Sin teléfono'}</span>
					</div>
					<div class="estado">
						<span class="pill" class:off={!a.activo}>{a.activo ? 'Activo' : 'Inactivo'}</span>
						<span class="muted small">{a.propiedades} propiedad{a.propiedades === 1 ? '' : 'es'}</span>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p class="card muted">Todavía no cargaste asesores. Empezá con el botón de arriba.</p>
	{/if}
</main>

<style>
	.wrap { max-width: 1140px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 18px; }
	.head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
	h1 { margin: 0; font-size: 26px; color: var(--text); }
	.muted { color: var(--muted); margin: 0; }
	.small { font-size: 13px; }
	.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
	.card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 12px;
		padding: 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		color: var(--text);
		text-decoration: none;
	}
	a.card:hover { border-color: var(--border-strong); }
	.avatar {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--accent-ink);
		display: grid;
		place-items: center;
		font-weight: 700;
	}
	.info { display: grid; gap: 2px; min-width: 0; overflow-wrap: anywhere; }
	.estado { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; }
	.pill { font-size: 12px; padding: 3px 10px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; }
	.pill.off { background: var(--surface-2); color: var(--muted); }
</style>
