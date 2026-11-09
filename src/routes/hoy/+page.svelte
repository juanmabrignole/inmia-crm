<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fechaHoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
	const fecha = (f: string) => new Date(f + 'T00:00:00').toLocaleDateString('es-AR');
	const tel = (t: string | null | undefined) => (t ?? '').replace(/\D/g, '');
	const pendientes = $derived(data.vencidos.length + data.hoy.length);
</script>

<svelte:head>
	<title>Hoy · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header>
		<p class="fecha">{fechaHoy}</p>
		<h1>Buen día</h1>
		<p class="muted">{pendientes ? `Tenés ${pendientes} vencimiento${pendientes === 1 ? '' : 's'} para atender esta semana.` : 'Sin vencimientos urgentes esta semana.'}</p>
	</header>

	<nav class="rapidas" aria-label="Acciones rápidas">
		<a class="btn btn-primary" href="/propiedades/nueva">+ Propiedad</a>
		<a class="btn" href="/contratos/nuevo">+ Contrato</a>
		<a class="btn" href="/inquilinos/nuevo">+ Inquilino</a>
		<a class="btn" href="/agenda">Ver agenda</a>
	</nav>

	<section class="card">
		<h2>Vencimientos</h2>
		{#if data.vencidos.length + data.hoy.length + data.proximos.length === 0}
			<p class="muted">No hay contratos que venzan en los próximos 30 días.</p>
		{:else}
			<ul class="lista">
				{#each [...data.vencidos, ...data.hoy, ...data.proximos] as c (c.id)}
					<li class:urgente={c.dias < 0} class:pronto={c.dias >= 0 && c.dias <= 7}>
						<div class="datos">
							<strong>{c.inquilinos?.nombre}</strong>
							<span class="muted small">{c.propiedades?.direccion} · vence {fecha(c.fecha_vencimiento)}</span>
						</div>
						<div class="acciones">
							<span class="pill">{c.dias < 0 ? `Vencido hace ${-c.dias} d` : c.dias === 0 ? 'Vence hoy' : `En ${c.dias} días`}</span>
							{#if tel(c.inquilinos?.telefono)}
								<a class="btn" href={`https://wa.me/${tel(c.inquilinos?.telefono)}`} target="_blank" rel="noopener">WhatsApp</a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<div class="dos">
		<section class="card">
			<h2>Últimas propiedades</h2>
			{#if data.propiedades.length}
				<ul class="simple">
					{#each data.propiedades as p (p.id)}
						<li><a href={`/propiedades/${p.id}`}>{p.direccion}</a></li>
					{/each}
				</ul>
			{:else}
				<p class="muted">Todavía no hay propiedades cargadas.</p>
			{/if}
		</section>

		<section class="card">
			<h2>Último contacto</h2>
			{#if data.mensajes.length}
				<ul class="simple">
					{#each data.mensajes as m (m.id)}
						<li>
							<strong>{m.inquilinos?.nombre ?? 'Sin inquilino'}</strong>
							<span class="muted small">{m.canal} · {new Date(m.created_at).toLocaleDateString('es-AR')}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">Todavía no hay contactos registrados.</p>
			{/if}
		</section>
	</div>
</main>

<style>
	.wrap { max-width: 960px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 18px; }
	.fecha { margin: 0; text-transform: capitalize; color: var(--muted); font-size: 14px; }
	h1 { margin: 0; font-size: 28px; color: var(--text); }
	h2 { margin: 0 0 12px; font-size: 17px; color: var(--text); }
	.muted { color: var(--muted); margin: 0; }
	.small { font-size: 13px; }
	.rapidas { display: flex; gap: 10px; flex-wrap: wrap; }
	.rapidas .btn { flex: 1 1 140px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); }
	.lista, .simple { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
	.lista li { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px; border: 1px solid var(--border); border-radius: 12px; }
	.lista li.urgente { border-color: var(--danger); }
	.lista li.pronto { border-color: var(--warn); }
	.datos { display: grid; gap: 2px; min-width: 0; }
	.acciones { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
	.acciones .btn { min-height: 40px; padding: 8px 14px; }
	.simple li { display: grid; gap: 2px; padding: 8px 0; border-bottom: 1px solid var(--border); }
	.simple li:last-child { border-bottom: none; }
	.simple a { color: var(--link); }
	.pill { font-size: 12px; padding: 4px 12px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; white-space: nowrap; }
	.dos { display: grid; gap: 18px; }
	@media (min-width: 761px) {
		.dos { grid-template-columns: 1fr 1fr; }
	}
</style>
