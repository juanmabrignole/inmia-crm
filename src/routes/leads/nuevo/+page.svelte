<script lang="ts">
	import { ETIQUETAS_ESTADO, hace } from '../../../lib/leads';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	const v = $derived((form && 'valores' in form ? form.valores : {}) as Record<string, string>);
	type Dup = { id: string; nombre: string | null; email: string | null; telefono: string | null; estado: string; created_at: string };
	const duplicados = $derived((form && 'duplicados' in form ? form.duplicados : []) as Dup[]);
</script>

<svelte:head>
	<title>Nueva consulta · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/leads">← Volver a consultas</a>
	<h1>Cargar consulta</h1>

	{#if form?.error}<p class="error card">{form.error}</p>{/if}

	{#if duplicados.length}
		<section class="card">
			<h2>Ya existe</h2>
			<ul class="lista">
				{#each duplicados as d (d.id)}
					<li>
						<a href="/leads/{d.id}">
							<strong>{d.nombre ?? 'Sin nombre'}</strong>
							· {[d.email, d.telefono].filter(Boolean).join(' · ')}
							<span class="muted small">({ETIQUETAS_ESTADO[d.estado as keyof typeof ETIQUETAS_ESTADO]}, {hace(d.created_at)})</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="card">
		<form method="POST" class="form">
			<div class="grid">
				<label>Nombre
					<input class="input" name="nombre" value={v.nombre ?? ''} />
				</label>
				<label>Origen
					<input class="input" name="origen" placeholder="Ej: ZonaProp, Facebook, Web" value={v.origen ?? ''} />
				</label>
				<label>Email
					<input class="input" type="email" name="email" value={v.email ?? ''} />
				</label>
				<label>Teléfono / WhatsApp
					<input class="input" type="tel" name="telefono" value={v.telefono ?? ''} />
				</label>
				<label class="full">Etiquetas (separadas por coma)
					<input class="input" name="etiquetas" placeholder="Ej: alquiler, zona norte" value={v.etiquetas ?? ''} />
				</label>
				<label class="full">Mensaje
					<textarea class="input" name="mensaje" rows="3">{v.mensaje ?? ''}</textarea>
				</label>
			</div>
			{#if duplicados.length}
				<label class="check"><input type="checkbox" name="forzar" /> Es otra consulta, guardarla igual</label>
			{/if}
			<div class="actions"><button class="btn btn-primary" type="submit">Guardar consulta</button></div>
		</form>
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 14px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	h2 { margin: 0 0 8px; font-size: 17px; color: var(--text); }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.muted { color: var(--muted); }
	.small { font-size: 13px; }
	.error { color: var(--danger); margin: 0; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); margin: 0; }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
	.lista li { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; }
	.lista a { color: var(--text); text-decoration: none; }
	.form { display: grid; gap: 16px; }
	.grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
	label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
	label.full { grid-column: 1 / -1; }
	.check { display: flex; gap: 8px; align-items: center; color: var(--text); }
	.actions { display: flex; justify-content: flex-end; }

	@media (min-width: 601px) {
		.grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>
