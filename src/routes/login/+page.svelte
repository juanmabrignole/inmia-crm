<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Ingresar · Inmia CRM</title>
</svelte:head>

<main class="login">
	<h1>Inmia CRM</h1>
	<p class="sub">Ingresá con el usuario que te dio el administrador.</p>

	{#if !data.configured}
		<p class="error">Falta configurar Supabase (PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY).</p>
	{/if}

	<form method="POST">
		<label>
			Email
			<input type="email" name="email" required autocomplete="username" value={form?.email ?? ''} />
		</label>
		<label>
			Contraseña
			<input type="password" name="password" required autocomplete="current-password" />
		</label>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<button type="submit" disabled={!data.configured}>Ingresar</button>
	</form>
</main>

<style>
	.login {
		max-width: 360px;
		margin: 80px auto;
		padding: 24px;
		font-family: system-ui, sans-serif;
	}
	h1 { color: #1f3a5f; margin-bottom: 4px; }
	.sub { color: #555; margin-top: 0; }
	form { display: grid; gap: 14px; }
	label { display: grid; gap: 6px; font-size: 14px; }
	input { padding: 10px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; }
	button {
		padding: 12px;
		border: 0;
		border-radius: 8px;
		background: #1f3a5f;
		color: #fff;
		font-size: 16px;
		cursor: pointer;
	}
	button:disabled { opacity: 0.5; cursor: not-allowed; }
	.error { color: #b00020; font-size: 14px; }
</style>
