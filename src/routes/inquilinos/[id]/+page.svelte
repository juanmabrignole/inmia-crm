<script lang="ts">
	import InquilinoForm from '../../../lib/InquilinoForm.svelte';
	import { CANALES, diasHasta } from '../../../lib/inquilinos';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const i = $derived(data.inquilino);
	const valores = $derived({
		nombre: i.nombre ?? '',
		email: i.email ?? '',
		telefono: i.telefono ?? '',
		notas: i.notas ?? ''
	});
	const soloDigitos = $derived((i.telefono ?? '').replace(/\D/g, ''));
	const fecha = (f: string) => new Date(f + 'T00:00:00').toLocaleDateString('es-AR');
</script>

<svelte:head>
	<title>{i.nombre} · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/inquilinos">← Volver a inquilinos</a>
	<h1>{i.nombre}</h1>

	<section class="card contacto">
		{#if soloDigitos}<a class="btn btn-primary" href={`https://wa.me/${soloDigitos}`} target="_blank" rel="noopener">WhatsApp</a>{/if}
		{#if i.email}<a class="btn" href={`mailto:${i.email}`}>Escribir mail</a>{/if}
	</section>

	<section class="card">
		<h2>Contratos</h2>
		{#if data.contratos.length}
			<ul class="lista">
				{#each data.contratos as c (c.id)}
					{@const dias = diasHasta(c.fecha_vencimiento)}
					<li>
						<div>
							<a href={`/propiedades/${c.propiedades?.id}`}>{c.propiedades?.direccion}</a>
							<span class="muted small">{fecha(c.fecha_inicio)} → {fecha(c.fecha_vencimiento)}</span>
						</div>
						<span class="pill" class:warn={c.activo && dias >= 0 && dias <= 30} class:off={!c.activo || dias < 0}>
							{!c.activo ? 'Finalizado' : dias < 0 ? 'Vencido' : `Vence en ${dias} días`}
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="muted">Sin contratos. Podés cargarlo desde Contratos → Nuevo contrato.</p>
		{/if}
	</section>

	<section class="card">
		<h2>Historial de contacto</h2>
		<form method="POST" action="?/mensaje" class="mensaje">
			<div class="fila">
				<select class="input" name="canal" aria-label="Canal">
					{#each CANALES as c (c)}<option value={c}>{c}</option>{/each}
				</select>
				<select class="input" name="propiedad_id" aria-label="Propiedad relacionada">
					<option value="">Sin propiedad</option>
					{#each data.propiedades as p (p.id)}<option value={p.id}>{p.direccion}</option>{/each}
				</select>
			</div>
			<textarea class="input" name="contenido" rows="3" placeholder="Qué se habló, qué quedó pendiente…"></textarea>
			{#if form?.errorMensaje}<p class="error">{form.errorMensaje}</p>{/if}
			{#if form?.okMensaje}<p class="ok">{form.okMensaje}</p>{/if}
			<div class="actions"><button class="btn btn-primary" type="submit">Registrar</button></div>
		</form>

		{#if data.mensajes.length}
			<ul class="lista historial">
				{#each data.mensajes as m (m.id)}
					<li>
						<div>
							<span class="pill">{m.canal}</span>
							<span class="muted small">{new Date(m.created_at).toLocaleString('es-AR')}{m.propiedades ? ` · ${m.propiedades.direccion}` : ''}</span>
							<p class="contenido">{m.contenido}</p>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="card">
		<h2>Datos de contacto</h2>
		<InquilinoForm values={valores} error={form?.error ?? null} submitLabel="Guardar cambios" />
		{#if form?.ok}<p class="ok">{form.ok}</p>{/if}
	</section>

	<section class="card peligro">
		<h2>Eliminar inquilino</h2>
		<p class="muted small">Borra también sus contratos e historial. No se puede deshacer.</p>
		<form method="POST" action="?/eliminar" onsubmit={(e) => { if (!confirm('¿Eliminar este inquilino?')) e.preventDefault(); }}>
			<button class="btn btn-danger" type="submit">Eliminar inquilino</button>
		</form>
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	h2 { margin: 0 0 12px; font-size: 17px; color: var(--text); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
	.contacto { display: flex; gap: 10px; flex-wrap: wrap; }
	.contacto .btn { flex: 1 1 160px; }
	.peligro { border-color: var(--danger); }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.ok { color: var(--success); }
	.error { color: var(--danger); margin: 0; }
	.mensaje { display: grid; gap: 10px; margin-bottom: 16px; }
	.fila { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
	.actions { display: flex; justify-content: flex-end; }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
	.lista li { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; }
	.lista a { color: var(--link); }
	.historial .contenido { margin: 6px 0 0; white-space: pre-wrap; }
	.pill { font-size: 12px; padding: 3px 10px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-weight: 600; }
	.pill.warn { background: var(--warn); color: #fff; }
	.pill.off { background: var(--surface-2); color: var(--muted); }
	form { margin: 0; }
</style>
