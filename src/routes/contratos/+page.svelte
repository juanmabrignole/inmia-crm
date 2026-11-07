<script lang="ts">
	import { diasHasta } from '../../lib/inquilinos';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fecha = (f: string) => new Date(f + 'T00:00:00').toLocaleDateString('es-AR');
	const money = (n: number | null, m: string) =>
		n === null ? '—' : `${m} ${new Intl.NumberFormat('es-AR').format(n)}`;
</script>

<svelte:head>
	<title>Contratos · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header class="head">
		<div>
			<h1>Contratos</h1>
			<p class="muted">Ordenados por vencimiento. Lo que vence en 30 días aparece resaltado.</p>
		</div>
		<a class="btn btn-primary" href="/contratos/nuevo">+ Nuevo contrato</a>
	</header>

	{#if data.contratos.length}
		<div class="lista">
			{#each data.contratos as c (c.id)}
				{@const dias = diasHasta(c.fecha_vencimiento)}
				<article class="item">
					<div class="principal">
						<strong>{c.propiedades?.direccion}</strong>
						<span class="muted small">{c.inquilinos?.nombre} · {money(c.monto, c.moneda)} / mes</span>
						<span class="muted small">{fecha(c.fecha_inicio)} → {fecha(c.fecha_vencimiento)}</span>
					</div>
					<span class="pill" class:warn={c.activo && dias >= 0 && dias <= 30} class:off={!c.activo || dias < 0}>
						{!c.activo ? 'Finalizado' : dias < 0 ? 'Vencido' : `Vence en ${dias} días`}
					</span>
				</article>
			{/each}
		</div>
	{:else}
		<p class="card muted">Todavía no hay contratos cargados.</p>
	{/if}
</main>

<style>
	.wrap { max-width: 1140px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 18px; }
	.head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
	h1 { margin: 0; font-size: 26px; color: var(--text); }
	.muted { color: var(--muted); margin: 0; }
	.small { font-size: 13px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
	.lista { display: grid; gap: 10px; }
	.item { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 14px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
	.principal { display: grid; gap: 2px; min-width: 0; }
	.pill { font-size: 12px; padding: 4px 12px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; white-space: nowrap; }
	.pill.warn { background: var(--warn); color: #fff; }
	.pill.off { background: var(--surface-2); color: var(--muted); }
</style>
