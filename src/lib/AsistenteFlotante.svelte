<script lang="ts">
	import AyudaChat from './AyudaChat.svelte';

	let abierto = $state(false);
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') abierto = false; }} />

{#if abierto}
	<section class="panel" aria-label="Asistente de la app">
		<header>
			<span>Asistente</span>
			<button type="button" class="cerrar" onclick={() => (abierto = false)} aria-label="Cerrar asistente">×</button>
		</header>
		<div class="cuerpo">
			<AyudaChat />
		</div>
	</section>
{/if}

<button type="button" class="flotante" onclick={() => (abierto = !abierto)} aria-expanded={abierto} aria-controls="panel-asistente">
	{abierto ? 'Cerrar' : 'Asistente'}
</button>

<style>
	.flotante {
		position: fixed;
		right: 16px;
		bottom: 16px;
		z-index: 50;
		padding: 12px 18px;
		border-radius: 999px;
		border: none;
		background: var(--accent);
		color: var(--accent-ink);
		font-weight: 600;
		box-shadow: var(--shadow);
		cursor: pointer;
	}
	.panel {
		position: fixed;
		right: 16px;
		bottom: 72px;
		z-index: 50;
		width: min(420px, calc(100vw - 32px));
		max-height: 70vh;
		display: grid;
		grid-template-rows: auto 1fr;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		overflow: hidden;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 14px;
		border-bottom: 1px solid var(--border);
		color: var(--text);
		font-weight: 600;
	}
	.cerrar {
		background: none;
		border: none;
		font-size: 22px;
		line-height: 1;
		color: var(--muted);
		cursor: pointer;
	}
	.cuerpo {
		overflow: auto;
		padding: 10px;
	}
	.cuerpo :global(.card) {
		box-shadow: none;
		border: none;
		padding: 6px;
	}
</style>
