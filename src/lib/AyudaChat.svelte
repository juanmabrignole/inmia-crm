<script lang="ts">
	let pregunta = $state('');
	let respuesta = $state('');
	let error = $state<string | null>(null);
	let cargando = $state(false);

	const MAX = 400;

	async function preguntar(e: SubmitEvent) {
		e.preventDefault();
		const texto = pregunta.trim();
		if (!texto || cargando) return;
		cargando = true;
		error = null;
		respuesta = '';
		try {
			const res = await fetch('/api/ayuda-chat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ pregunta: texto })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				error = data.message ?? 'No pude responder ahora. Probá de nuevo en un rato.';
			} else {
				respuesta = data.respuesta ?? '';
			}
		} catch {
			error = 'Sin conexión. Revisá tu internet y probá de nuevo.';
		} finally {
			cargando = false;
		}
	}
</script>

<section class="card chat" aria-labelledby="chat-titulo">
	<h2 id="chat-titulo">Preguntale al asistente</h2>
	<p class="muted">Respuestas sobre cómo usar la app, según esta guía. Es una IA: para temas legales o impositivos, consultá a un profesional.</p>

	<form onsubmit={preguntar}>
		<label class="sr-only" for="pregunta-ayuda">Tu pregunta</label>
		<input id="pregunta-ayuda" class="input" type="text" maxlength={MAX} placeholder="Ej: ¿Cómo asigno una consulta?" bind:value={pregunta} disabled={cargando} />
		<button class="btn btn-primary" type="submit" disabled={cargando || !pregunta.trim()}>{cargando ? 'Pensando…' : 'Preguntar'}</button>
	</form>

	<div aria-live="polite">
		{#if error}<p class="error">{error}</p>{/if}
		{#if respuesta}<p class="respuesta">{respuesta}</p>{/if}
	</div>
</section>

<style>
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
	h2 { margin: 0 0 6px; font-size: 18px; color: var(--text); }
	.muted { color: var(--muted); margin: 0 0 12px; font-size: 14px; }
	form { display: flex; gap: 8px; flex-wrap: wrap; }
	input { flex: 1; min-width: 200px; }
	.respuesta { margin: 12px 0 0; color: var(--text); white-space: pre-line; line-height: 1.5; }
	.error { margin: 12px 0 0; color: var(--danger); }
	.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
