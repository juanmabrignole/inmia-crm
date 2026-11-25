<script lang="ts">
	import { page } from '$app/state';
	import { primerosPasos, modulos } from '../../lib/ayuda';


</script>

<svelte:head>
	<title>Ayuda · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header>
		<h1>Ayuda</h1>
		<p class="muted">Guía de uso para asesores y administradores. Elegí un módulo o leé los primeros pasos.</p>
	</header>

	<nav class="indice" aria-label="Módulos">
		<a href="#primeros-pasos" class:activa={page.url.hash === '#primeros-pasos'}>Primeros pasos</a>
		{#each modulos as m (m.id)}
			<a href="#{m.id}" class:activa={page.url.hash === `#${m.id}`}>{m.titulo}{m.rol === 'admin' ? ' (admin)' : ''}</a>
		{/each}
	</nav>

	<section class="card" id="primeros-pasos">
		<h2>Primeros pasos</h2>
		<ol>
			{#each primerosPasos as paso}<li>{paso}</li>{/each}
		</ol>
	</section>

	{#each modulos as m (m.id)}
		<section class="card" id={m.id}>
			<div class="cabecera">
				<h2>{m.titulo}</h2>
				<span class="rol" class:admin={m.rol === 'admin'}>{m.rol === 'admin' ? 'Solo admin' : 'Todos'}</span>
			</div>
			<p class="resumen">{m.resumen}</p>
			<ul>
				{#each m.pasos as paso}<li>{paso}</li>{/each}
			</ul>
		</section>
	{/each}
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	h2 { margin: 0; font-size: 18px; color: var(--text); }
	.muted { color: var(--muted); margin: 4px 0 0; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); scroll-margin-top: 16px; }
	.cabecera { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
	.resumen { color: var(--muted); margin: 0 0 10px; }
	.card ul, .card ol { margin: 0; padding-left: 20px; color: var(--text); display: grid; gap: 8px; line-height: 1.5; }
	.rol { font-size: 12px; padding: 3px 10px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }
	.rol.admin { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
	.indice { display: flex; gap: 6px; flex-wrap: wrap; }
	.indice a {
		padding: 7px 14px;
		border-radius: 999px;
		border: 1.5px solid var(--border-strong);
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
		transition: background 0.15s ease, border-color 0.15s ease;
	}
	.indice a:hover,
	.indice a:focus-visible,
	.indice a.activa {
		background: var(--accent);
		color: var(--accent-ink);
		border-color: var(--accent);
	}
</style>
