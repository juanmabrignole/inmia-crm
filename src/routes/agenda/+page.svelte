<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fecha = (f: string) => new Date(f + 'T00:00:00').toLocaleDateString('es-AR');
	const tel = (t: string | null | undefined) => (t ?? '').replace(/\D/g, '');
	const total = $derived(data.vencidos.length + data.proximos30.length + data.proximos90.length);
	const secciones = $derived([
		{ titulo: 'Vencidos', items: data.vencidos, tono: 'off' },
		{ titulo: 'Próximos 30 días', items: data.proximos30, tono: 'warn' },
		{ titulo: 'Entre 31 y 90 días', items: data.proximos90, tono: 'ok' }
	]);
</script>

<svelte:head>
	<title>Agenda · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header>
		<h1>Agenda de vencimientos</h1>
		<p class="muted">Contratos activos que vencen en los próximos 90 días o ya vencieron. {total} en total.</p>
	</header>

	{#if total === 0}
		<p class="card muted">Nada para revisar por ahora. Los contratos próximos a vencer aparecen acá.</p>
	{/if}

	{#each secciones as s (s.titulo)}
		{#if s.items.length}
			<section class="card">
				<h2><span class={`dot ${s.tono}`}></span>{s.titulo} <span class="muted">({s.items.length})</span></h2>
				<ul class="lista">
					{#each s.items as c (c.id)}
						<li>
							<div class="datos">
								<strong>{c.inquilinos?.nombre}</strong>
								<span class="muted small">{c.propiedades?.direccion}</span>
								<span class="muted small">Vence {fecha(c.fecha_vencimiento)}{c.dias < 0 ? ` (hace ${-c.dias} días)` : c.dias === 0 ? ' (hoy)' : ` (en ${c.dias} días)`}</span>
							</div>
							<div class="acciones">
								{#if tel(c.inquilinos?.telefono)}
									<a class="btn" href={`https://wa.me/${tel(c.inquilinos?.telefono)}`} target="_blank" rel="noopener">WhatsApp</a>
								{/if}
								<a class="btn" href="/contratos">Ver contratos</a>
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}
</main>

<style>
	.wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; font-size: 26px; color: var(--text); }
	h2 { margin: 0 0 12px; font-size: 17px; color: var(--text); display: flex; align-items: center; gap: 8px; }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); }
	.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
	.dot.off { background: var(--danger); }
	.dot.warn { background: var(--warn); }
	.dot.ok { background: var(--success); }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
	.lista li { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px; border: 1px solid var(--border); border-radius: 12px; }
	.datos { display: grid; gap: 2px; min-width: 0; }
	.acciones { display: flex; gap: 8px; flex-wrap: wrap; }
	.acciones .btn { min-height: 40px; padding: 8px 14px; }
</style>
