<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Ingresar · Inmia CRM</title>
</svelte:head>

<main class="login">
	<div class="tarjeta">
		<div class="marca">
			<img src="/logo-inmia.svg" alt="" width="56" height="56" />
			<h1>Inmia CRM</h1>
		</div>
		<p class="sub">Ingresá con el usuario que te dio el administrador.</p>

		{#if !data.configured}
			<p class="error">Falta configurar Supabase (PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY).</p>
		{/if}

		<form method="POST">
			<label>
				Email
				<input class="input" type="email" name="email" required autocomplete="username" value={form?.email ?? ''} />
			</label>
			<label>
				Contraseña
				<input class="input" type="password" name="password" required autocomplete="current-password" />
			</label>

			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}

			<button class="btn btn-primary" type="submit" disabled={!data.configured}>Ingresar</button>
		</form>
	</div>
</main>

<style>
	.login {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 24px;
		background: var(--bg);
		font-family: var(--font);
		color: var(--text);
	}
	.tarjeta {
		width: min(380px, 100%);
		padding: 32px 28px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}
	.marca { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
	.marca img { border-radius: 14px; flex-shrink: 0; }
	h1 { margin: 0; font-size: 26px; font-weight: 700; color: var(--text); }
	.sub { color: var(--muted); margin: 8px 0 24px; font-size: 14px; line-height: 1.5; }
	form { display: grid; gap: 16px; }
	label { display: grid; gap: 6px; font-size: 14px; font-weight: 600; color: var(--text); }
	button[type='submit'] {
		margin-top: 8px;
		padding: 12px;
		border: 0;
		border-radius: 12px;
		background: var(--primary);
		color: var(--on-primary);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	button[type='submit']:hover { filter: brightness(1.08); }
	button[type='submit']:disabled { opacity: 0.5; cursor: not-allowed; }
	.error { color: var(--danger); font-size: 14px; margin: 0; }
</style>
