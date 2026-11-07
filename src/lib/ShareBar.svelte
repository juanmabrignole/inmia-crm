<script lang="ts">
	let { url, texto }: { url: string; texto: string } = $props();
	let copiado = $state(false);

	const wa = $derived(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`);
	const mail = $derived(`mailto:?subject=${encodeURIComponent(texto)}&body=${encodeURIComponent(`${texto}\n\n${url}`)}`);

	async function copiar() {
		try {
			await navigator.clipboard.writeText(url);
			copiado = true;
			setTimeout(() => (copiado = false), 2000);
		} catch {
			// Sin permiso de portapapeles: el link queda visible para copiarlo a mano.
		}
	}
</script>

<div class="share">
	<a class="btn" href={wa} target="_blank" rel="noopener">WhatsApp</a>
	<a class="btn" href={mail}>Mail</a>
	<button type="button" class="btn" onclick={copiar}>{copiado ? 'Link copiado' : 'Copiar link'}</button>
</div>

<style>
	.share { display: flex; flex-wrap: wrap; gap: 10px; }
	.share .btn { flex: 1 1 140px; }
</style>
