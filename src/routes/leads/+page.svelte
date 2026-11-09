<script lang="ts">
	import { ETIQUETAS_ESTADO, ESTADOS_LEAD, hace } from '../../lib/leads';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Consultas · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header class="cabecera">
		<div>
			<h1>Consultas</h1>
			<p class="muted">Leads de portales, Facebook, landings y WhatsApp.</p>
		</div>
		<a class="btn btn-primary" href="/leads/nuevo">+ Cargar consulta</a>
	</header>

	<nav class="tabs" aria-label="Estado">
		{#each ESTADOS_LEAD as e}
			<a href="/leads?estado={e}" class:activa={data.estado === e} aria-current={data.estado === e ? 'page' : undefined}>
				{ETIQUETAS_ESTADO[e]} <span class="cant">{data.conteo[e]}</span>
			</a>
		{/each}
	</nav>

	{#if data.leads.length}
		<ul class="lista">
			{#each data.leads as l (l.id)}
				<li>
					<a class="fila" href="/leads/{l.id}">
						<div class="top">
							<strong>{l.nombre ?? 'Sin nombre'}</strong>
							<span class="muted small">{hace(l.created_at)}</span>
						</div>
						<div class="contacto small">
							{[l.email, l.telefono].filter(Boolean).join(' · ')}
						</div>
						{#if l.mensaje}<p class="mensaje">{l.mensaje}</p>{/if}
						<div class="pie">
							{#if l.origen}<span class="etiqueta">{l.origen}</span>{/if}
							{#each l.etiquetas ?? [] as t}<span class="etiqueta">{t}</span>{/each}
							<span class="muted small">{l.asesor_id ? `Asesor: ${data.nombres[l.asesor_id] ?? '—'}` : 'Sin asignar'}</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="muted card">No hay consultas en esta lista.</p>
	{/if}
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	.cabecera { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	.muted { color: var(--muted); margin: 0; }
	.small { font-size: 13px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
	.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
	.tabs a { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--border); color: var(--text); text-decoration: none; font-size: 14px; }
	.tabs a.activa { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }
	.cant { font-weight: 600; margin-left: 4px; }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
	.fila { display: grid; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; color: var(--text); text-decoration: none; box-shadow: var(--shadow); }
	.top { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
	.contacto { color: var(--muted); overflow-wrap: anywhere; }
	.mensaje { margin: 0; color: var(--text); font-size: 14px; }
	.pie { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
	.etiqueta { background: var(--surface-2); border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px; font-size: 12px; color: var(--muted); }
</style>
