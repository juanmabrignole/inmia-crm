<script lang="ts">
	import AsesorForm from '../../../lib/AsesorForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Nuevo asesor · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/asesores">← Volver a asesores</a>
	<h1>Nuevo asesor</h1>
	<section class="card">
		<AsesorForm values={form ?? {}} error={form?.error ?? null} submitLabel="Crear asesor" />
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 14px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
</style>
