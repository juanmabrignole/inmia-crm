<script lang="ts">
	import { BRAND } from '../../../lib/brand';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const p = $derived(data.propiedad);
	const money = (n: number | null, m: string | null) =>
		n === null ? null : `${m ?? 'USD'} ${new Intl.NumberFormat('es-AR').format(n)}`;
	const telAsesor = $derived((p.asesores?.telefono ?? '').replace(/\D/g, ''));
	const precioVenta = $derived(p.operacion !== 'alquiler' ? money(p.precio_venta, p.moneda_venta) : null);
	const precioAlquiler = $derived(p.operacion !== 'venta' ? money(p.precio_alquiler, p.moneda_alquiler) : null);
</script>

<svelte:head>
	<title>{p.direccion} · {BRAND.nombre}</title>
	<meta name="description" content={p.descripcion ?? p.direccion} />
</svelte:head>

<main class="ficha">
	<header class="marca">{BRAND.nombre}</header>

	{#if data.fotos.length}
		<div class="galeria">
			{#each data.fotos as f (f.url)}
				<img src={f.url} alt={p.direccion} loading="lazy" />
			{/each}
		</div>
	{/if}

	<section class="contenido">
		<h1>{p.direccion}</h1>
		<p class="meta">{p.tipo ?? 'Propiedad'}{p.ambientes ? ` · ${p.ambientes} amb.` : ''}{p.superficie_m2 ? ` · ${p.superficie_m2} m²` : ''}{p.cochera ? ' · cochera' : ''}</p>

		<div class="precios">
			{#if precioVenta}<div><span>Venta</span><strong>{precioVenta}</strong>{#if p.estado_venta !== 'disponible'}<em>{p.estado_venta}</em>{/if}</div>{/if}
			{#if precioAlquiler}<div><span>Alquiler</span><strong>{precioAlquiler} / mes</strong>{#if p.estado_alquiler !== 'disponible'}<em>{p.estado_alquiler}</em>{/if}</div>{/if}
		</div>

		{#if p.descripcion}<p class="descripcion">{p.descripcion}</p>{/if}

		{#if p.asesores}
			<div class="asesor">
				<div>
					<strong>{p.asesores.nombre}</strong>
					<span>Asesor a cargo</span>
				</div>
				{#if telAsesor}<a class="btn btn-primary" href={`https://wa.me/${telAsesor}`} target="_blank" rel="noopener">Consultar por WhatsApp</a>{/if}
			</div>
		{/if}
	</section>
</main>

<style>
	.ficha { max-width: 760px; margin: 0 auto; padding: 0 0 48px; }
	.marca { padding: 14px 16px; font-weight: 700; color: var(--on-sidebar); background: var(--sidebar); }
	.galeria { display: grid; grid-template-columns: 1fr; gap: 6px; }
	.galeria img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; }
	.contenido { padding: 16px; display: grid; gap: 14px; }
	h1 { margin: 0; font-size: 24px; color: var(--text); }
	.meta { margin: 0; color: var(--muted); }
	.precios { display: grid; gap: 10px; }
	.precios div { display: grid; gap: 2px; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
	.precios span { font-size: 13px; color: var(--muted); }
	.precios strong { font-size: 20px; color: var(--text); }
	.precios em { font-style: normal; font-size: 13px; color: var(--warn); }
	.descripcion { margin: 0; white-space: pre-wrap; color: var(--text); }
	.asesor { display: grid; gap: 12px; padding: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
	.asesor div { display: grid; gap: 2px; }
	.asesor span { font-size: 13px; color: var(--muted); }
	@media (min-width: 601px) {
		.galeria { grid-template-columns: 2fr 1fr; }
		.asesor { grid-template-columns: 1fr auto; align-items: center; }
		.precios { grid-template-columns: 1fr 1fr; }
	}
</style>
