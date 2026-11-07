<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const max = $derived(Math.max(1, ...data.serie.map((s) => s.count)));

	const money = (n: number | null | undefined, moneda?: string | null) =>
		n == null
			? '—'
			: new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda ?? 'USD', maximumFractionDigits: 0 }).format(n);

	const operacionLabel: Record<string, string> = {
		venta: 'Venta',
		alquiler: 'Alquiler',
		ambas: 'Venta y alquiler'
	};

	const kpis = $derived([
		{ label: 'Propiedades', value: data.stats.total, hint: 'cargadas en total', tone: 'primary' },
		{ label: 'En venta', value: data.stats.enVenta, hint: 'disponibles', tone: 'accent' },
		{ label: 'En alquiler', value: data.stats.enAlquiler, hint: 'disponibles', tone: 'accent' },
		{ label: 'Reservadas', value: data.stats.reservadas, hint: 'en proceso', tone: 'warn' },
		{ label: 'Tasaciones', value: data.stats.tas30, hint: 'últimos 30 días', tone: 'primary' }
	]);
</script>

<svelte:head>
	<title>Panel · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header class="head">
		<div>
			<h1>Panel</h1>
			<p class="muted">Resumen de tu cartera y actividad reciente.</p>
		</div>
	</header>

	<section class="kpis">
		{#each kpis as k (k.label)}
			<article class="card kpi tone-{k.tone}">
				<span class="label">{k.label}</span>
				<strong class="value">{k.value}</strong>
				<span class="hint">{k.hint}</span>
			</article>
		{/each}
	</section>

	<section class="grid">
		<article class="card">
			<div class="card-head">
				<h2>Tasaciones por mes</h2>
				<span class="muted small">últimos 6 meses</span>
			</div>
			<svg viewBox="0 0 360 170" class="chart" role="img" aria-label="Tasaciones por mes">
				<line x1="0" y1="130" x2="360" y2="130" class="axis" />
				{#each data.serie as s, i (s.label)}
					{@const h = (s.count / max) * 110}
					<rect x={i * 60 + 14} y={130 - h} width="32" height={h} rx="6" class="bar" />
					<text x={i * 60 + 30} y={150} text-anchor="middle" class="tick">{s.label}</text>
					<text x={i * 60 + 30} y={126 - h} text-anchor="middle" class="count">{s.count}</text>
				{/each}
			</svg>
		</article>

		<article class="card">
			<div class="card-head">
				<h2>Últimas tasaciones</h2>
			</div>
			{#if data.ultimasTasaciones.length}
				<ul class="list">
					{#each data.ultimasTasaciones as t (t.id)}
						<li>
							<div>
								<strong>{t.propiedades?.direccion ?? 'Propiedad'}</strong>
								<span class="muted small">{new Date(t.fecha).toLocaleDateString('es-AR')}</span>
							</div>
							<span class="amount">{money(t.valor_sugerido, t.moneda)}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">Todavía no hay tasaciones. Cuando cargues una, aparece acá.</p>
			{/if}
		</article>
	</section>

	<section class="card">
		<div class="card-head">
			<h2>Propiedades recientes</h2>
		</div>
		{#if data.recientes.length}
			<div class="props">
				{#each data.recientes as p (p.id)}
					<article class="prop">
						{#if p.foto}
							<img src={p.foto} alt={p.direccion} loading="lazy" />
						{:else}
							<div class="noimg">Sin foto</div>
						{/if}
						<div class="prop-body">
							<strong>{p.direccion}</strong>
							<span class="muted small">{p.tipo ?? 'Propiedad'} · {operacionLabel[p.operacion]}</span>
							<span class="price">
								{#if p.operacion !== 'alquiler'}{money(p.precio_venta, p.moneda_venta)}{/if}
								{#if p.operacion === 'ambas'} · {/if}
								{#if p.operacion !== 'venta'}{money(p.precio_alquiler, p.moneda_alquiler)}/mes{/if}
							</span>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="muted">Todavía no cargaste propiedades. Empezá desde el módulo de propiedades.</p>
		{/if}
	</section>
</main>

<style>
	.wrap { max-width: 1140px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 18px; }
	.head h1 { margin: 0; font-size: 26px; color: var(--text); }
	.head p { margin: 4px 0 0; }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	h2 { margin: 0; font-size: 16px; }

	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 18px;
		box-shadow: var(--shadow);
	}

	.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; }
	.kpi { display: grid; gap: 4px; border-top: 4px solid var(--primary); }
	.kpi.tone-accent { border-top-color: var(--accent); }
	.kpi.tone-warn { border-top-color: var(--warn); }
	.label { font-size: 13px; color: var(--muted); }
	.value { font-size: 30px; line-height: 1.1; }
	.hint { font-size: 12px; color: var(--muted); }

	.grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
	@media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }

	.card-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
	.chart { width: 100%; height: auto; }
	.axis { stroke: var(--border); stroke-width: 1; }
	.bar { fill: var(--accent); }
	.tick { fill: var(--muted); font-size: 12px; }
	.count { fill: var(--text); font-size: 12px; font-weight: 600; }

	.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
	.list li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px; background: var(--surface-2); border-radius: 10px; }
	.list div { display: grid; gap: 2px; }
	.amount { font-weight: 600; white-space: nowrap; }

	.props { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
	.prop { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
	.prop img, .noimg { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; }
	.noimg { display: grid; place-items: center; background: var(--surface-2); color: var(--muted); font-size: 13px; }
	.prop-body { padding: 12px; display: grid; gap: 4px; }
	.price { font-weight: 600; color: var(--accent); }
</style>
