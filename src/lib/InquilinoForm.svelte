<script lang="ts">
	let {
		values = {},
		error = null,
		submitLabel = 'Guardar'
	}: { values?: Record<string, string>; error?: string | null; submitLabel?: string } = $props();

	const v = (k: string, d = '') => values[k] ?? d;
</script>

<form method="POST" class="form">
	<div class="grid">
		<label class="full">Nombre y apellido
			<input class="input" name="nombre" required value={v('nombre')} />
		</label>
		<label>Email
			<input class="input" type="email" name="email" value={v('email')} />
		</label>
		<label>Teléfono / WhatsApp
			<input class="input" type="tel" name="telefono" value={v('telefono')} placeholder="+54 9 11 ..." />
		</label>
	</div>
	<label>Notas
		<textarea class="input" name="notas" rows="3">{v('notas')}</textarea>
	</label>
	{#if error}<p class="error">{error}</p>{/if}
	<div class="actions">
		<button class="btn btn-primary" type="submit">{submitLabel}</button>
	</div>
</form>

<style>
	.form { display: grid; gap: 16px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
	label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
	label.full { grid-column: 1 / -1; }
	.error { color: var(--danger); margin: 0; }
	.actions { display: flex; justify-content: flex-end; }
</style>
