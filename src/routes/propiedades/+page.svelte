<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const money = (n: number | null, m: string | null) =>
		n == null ? null : new Intl.NumberFormat('es-AR', { style: 'currency', currency: m ?? 'USD', maximumFractionDigits: 0 }).format(n);

	const filtros = [
		{ value: '', label: 'Todas' },
		{ value: 'venta', label: 'Venta' },
		{ value: 'alquiler', label: 'Alquiler' },
		{ value: 'ambas', label: 'Venta y alquiler' }
	];
</script>

<svelte:head>
	<title>Propiedades · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header class="head">
		<h1>Propiedades</h1>
		<a class="btn btn-primary" href="/propiedades/nueva">+ Nueva propiedad</a>
	</header>

	<nav class="filtros" aria-label="Filtrar por operación">
		{#each filtros as f (f.value)}
			<a href={f.value ? `/propiedades?operacion=${f.value}` : '/propiedades'} class="chip" class:activo={data.operacion === f.value}>{f.label}</a>
		{/each}
	</nav>

	{#if data.error}
		<p class="error">No se pudieron cargar las propiedades: {data.error}</p>
	{:else if data.propiedades.length}
		<div class="cards">
			{#each data.propiedades as p (p.id)}
				<a class="card" href={`/propiedades/${p.id}`}>
					{#if p.foto}
						<img src={p.foto} alt={p.direccion} loading="lazy" />
					{:else}
						<div class="noimg">Sin foto</div>
					{/if}
					<div class="body">
						<strong>{p.direccion}</strong>
						<span class="muted small">{p.tipo ?? 'Propiedad'}{p.publicada ? '' : ' · No publicada'}</span>
						{#if p.operacion !== 'alquiler' && p.precio_venta}
							<span class="precio">Venta {money(p.precio_venta, p.moneda_venta)}{p.estado_venta !== 'disponible' ? ` · ${p.estado_venta}` : ''}</span>
						{/if}
						{#if p.operacion !== 'venta' && p.precio_alquiler}
							<span class="precio">Alquiler {money(p.precio_alquiler, p.moneda_alquiler)}/mes{p.estado_alquiler !== 'disponible' ? ` · ${p.estado_alquiler}` : ''}</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p class="muted">No hay propiedades con este filtro. Cargá la primera con el botón de arriba.</p>
	{/if}
</main>

<style>
	.wrap { max-width: 1140px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	.head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
	h1 { margin: 0; color: var(--text); font-size: 24px; }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.error { color: var(--danger); }
	.filtros { display: flex; gap: 8px; flex-wrap: wrap; }
	.chip { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border); color: var(--text); text-decoration: none; font-size: 14px; background: var(--surface); }
	.chip.activo { background: var(--primary); color: var(--on-primary); border-color: var(--primary); }
	.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
	.card { display: grid; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; color: var(--text); text-decoration: none; box-shadow: var(--shadow); }
	.card img, .noimg { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; }
	.noimg { display: grid; place-items: center; background: var(--surface-2); color: var(--muted); font-size: 13px; }
	.body { padding: 12px; display: grid; gap: 4px; }
	.precio { color: var(--accent); font-weight: 600; font-size: 14px; }
</style>
