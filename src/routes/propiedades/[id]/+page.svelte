<script lang="ts">
	import PropiedadForm from '../../../lib/PropiedadForm.svelte';
	import ShareBar from '../../../lib/ShareBar.svelte';
	import { page } from '$app/state';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const p = $derived(data.propiedad);
	const publicUrl = $derived(`${page.url.origin}/p/${data.propiedad.id}`);

	// Valores del formulario a partir de la propiedad guardada
	const valores = $derived({
		direccion: p.direccion ?? '',
		tipo: p.tipo ?? '',
		operacion: p.operacion ?? 'venta',
		ambientes: p.ambientes?.toString() ?? '',
		dormitorios: p.dormitorios?.toString() ?? '',
		banos: p.banos?.toString() ?? '',
		superficie_m2: p.superficie_m2?.toString() ?? '',
		antiguedad_anios: p.antiguedad_anios?.toString() ?? '',
		cochera: String(p.cochera ?? false),
		descripcion: p.descripcion ?? '',
		precio_venta: p.precio_venta?.toString() ?? '',
		moneda_venta: p.moneda_venta ?? 'USD',
		estado_venta: p.estado_venta ?? 'disponible',
		precio_alquiler: p.precio_alquiler?.toString() ?? '',
		moneda_alquiler: p.moneda_alquiler ?? 'ARS',
		estado_alquiler: p.estado_alquiler ?? 'disponible',
		asesor_id: p.asesor_id ?? '',
		publicada: String(p.publicada ?? true)
	});
</script>

<svelte:head>
	<title>{p.direccion} · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/propiedades">← Volver a propiedades</a>
	<h1>{p.direccion}</h1>

	<section class="card">
		<h2>Compartir</h2>
		<ShareBar url={publicUrl} texto={`${p.direccion}${p.precio_venta ? ` · ${p.moneda_venta} ${p.precio_venta}` : ''}`} />
		<p class="muted small link">Ficha pública: {publicUrl}</p>
	</section>

	<section class="card">
		<h2>Fotos</h2>
		{#if data.fotos.length}
			<div class="fotos">
				{#each data.fotos as f (f.id)}
					<figure>
						<img src={f.url} alt={p.direccion} loading="lazy" />
						<form method="POST" action="?/borrarFoto">
							<input type="hidden" name="id" value={f.id} />
							<input type="hidden" name="url" value={f.url} />
							<button class="btn btn-danger" type="submit">Borrar</button>
						</form>
					</figure>
				{/each}
			</div>
		{:else}
			<p class="muted">Todavía no hay fotos.</p>
		{/if}

		<form method="POST" action="?/subirFotos" enctype="multipart/form-data" class="subir">
			<input type="file" name="fotos" accept="image/*" multiple />
			<button class="btn btn-primary" type="submit">Subir fotos</button>
		</form>
		{#if form?.errorFotos}<p class="error">{form.errorFotos}</p>{/if}
		{#if form?.okFotos}<p class="ok">{form.okFotos}</p>{/if}
	</section>

	<section class="card">
		<h2>Datos de la propiedad</h2>
		<PropiedadForm values={valores} error={form?.error ?? null} submitLabel="Guardar cambios" asesores={data.asesores} />
		{#if form?.ok}<p class="ok">{form.ok}</p>{/if}
	</section>

	<section class="card peligro">
		<h2>Eliminar propiedad</h2>
		<p class="muted small">Borra la propiedad, sus fotos y su historial de tasaciones. No se puede deshacer.</p>
		<form method="POST" action="?/eliminar" onsubmit={(e) => { if (!confirm('¿Eliminar esta propiedad?')) e.preventDefault(); }}>
			<button class="btn btn-danger" type="submit">Eliminar propiedad</button>
		</form>
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; color: var(--text); font-size: 24px; }
	h2 { margin: 0 0 12px; font-size: 17px; color: var(--text); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
	.peligro { border-color: var(--danger); }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.error { color: var(--danger); }
	.ok { color: var(--link); }
	.link { word-break: break-all; margin: 10px 0 0; }
	.fotos { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; margin-bottom: 14px; }
	figure { margin: 0; display: grid; gap: 6px; }
	figure img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 10px; }
	figure form { margin: 0; }
	.subir { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 8px; }
</style>
