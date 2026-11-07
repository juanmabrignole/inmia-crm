<script lang="ts">
	import PropiedadForm from '../../../lib/PropiedadForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Nueva propiedad · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/propiedades">← Volver a propiedades</a>
	<h1>Nueva propiedad</h1>
	<section class="card">
		<PropiedadForm values={form ?? {}} error={form?.error ?? null} submitLabel="Crear propiedad" />
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 14px; }
	h1 { margin: 0; color: var(--text); font-size: 24px; }
	.volver { color: var(--accent); text-decoration: none; font-size: 14px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; box-shadow: var(--shadow); }
</style>
