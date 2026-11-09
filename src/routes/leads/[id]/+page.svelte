<script lang="ts">
	import { ETIQUETAS_ESTADO, hace } from '../../../lib/leads';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const l = $derived(data.lead);
	const esAdmin = $derived(data.perfil?.rol === 'admin');
	const asignadoA = $derived(data.asesores.find((a) => a.id === l.asesor_id)?.nombre ?? null);
	const puedeTomar = $derived(!esAdmin && l.estado === 'pendiente' && !l.asesor_id);
</script>

<svelte:head>
	<title>{l.nombre ?? 'Consulta'} · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/leads">← Volver a consultas</a>

	<header>
		<h1>{l.nombre ?? 'Sin nombre'}</h1>
		<p class="muted small">
			{ETIQUETAS_ESTADO[l.estado as keyof typeof ETIQUETAS_ESTADO]} · recibida {hace(l.created_at)}
			{#if asignadoA} · Asesor: {asignadoA}{/if}
		</p>
	</header>

	{#if form?.error}<p class="error card">{form.error}</p>{/if}
	{#if form?.ok}<p class="ok card">{form.ok}</p>{/if}

	<section class="card">
		<h2>Contacto</h2>
		<p>{l.email ?? '—'}</p>
		<p>{l.telefono ?? '—'}</p>
		{#if l.origen}<p class="muted small">Origen: {l.origen}</p>{/if}
		{#if l.etiquetas?.length}<p class="muted small">Etiquetas: {l.etiquetas.join(', ')}</p>{/if}
		{#if l.mensaje}
			<h3>Mensaje</h3>
			<p class="mensaje">{l.mensaje}</p>
		{/if}
	</section>

	{#if data.duplicados.length}
		<section class="card">
			<h2>Otras consultas del mismo contacto</h2>
			<ul class="lista">
				{#each data.duplicados as d (d.id)}
					<li>
						<a href="/leads/{d.id}">
							{d.nombre ?? 'Sin nombre'} · {ETIQUETAS_ESTADO[d.estado as keyof typeof ETIQUETAS_ESTADO]} · {hace(d.created_at)}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if l.estado !== 'borrado'}
		<section class="card acciones">
			<h2>Gestión</h2>

			{#if esAdmin}
				<form method="POST" action="?/asignar" class="fila">
					<select class="input" name="asesor_id" aria-label="Asesor">
						<option value="">Elegí un asesor</option>
						{#each data.asesores as a (a.id)}
							<option value={a.id} selected={a.id === l.asesor_id}>{a.nombre}</option>
						{/each}
					</select>
					<button class="btn btn-primary" type="submit">Asignar</button>
				</form>
			{:else if puedeTomar || l.asesor_id === data.perfil?.asesor_id}
				{#if puedeTomar}
					<form method="POST" action="?/asignar">
						<button class="btn btn-primary" type="submit">Tomar consulta</button>
					</form>
				{/if}
			{/if}

			<div class="fila">
				{#if l.estado === 'asignado'}
					<form method="POST" action="?/reabrir">
						<button class="btn" type="submit">Devolver a pendientes</button>
					</form>
				{/if}
				<form method="POST" action="?/borrar">
					<button class="btn btn-danger" type="submit">Marcar como borrada</button>
				</form>
			</div>
		</section>
	{:else}
		<section class="card">
			<form method="POST" action="?/reabrir">
				<button class="btn" type="submit">Restaurar a pendientes</button>
			</form>
		</section>
	{/if}
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 14px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	h2 { margin: 0 0 8px; font-size: 17px; color: var(--text); }
	h3 { margin: 12px 0 4px; font-size: 14px; color: var(--muted); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.error { color: var(--danger); margin: 0; }
	.ok { color: var(--success); margin: 0; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); margin: 0; }
	.card p { margin: 4px 0; color: var(--text); }
	.mensaje { white-space: pre-wrap; }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
	.lista li { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; }
	.lista a { color: var(--text); text-decoration: none; }
	.acciones { display: grid; gap: 12px; }
	.fila { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 0; }
	.fila select { flex: 1; min-width: 200px; }
</style>
