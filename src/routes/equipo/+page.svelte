<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Equipo · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<header>
		<h1>Equipo</h1>
		<p class="muted">Definí qué ve cada usuario. Los admin ven todo. Los asesores ven solo lo asignado a su nombre.</p>
	</header>

	{#if form?.error}<p class="error card">{form.error}</p>{/if}
	{#if form?.ok}<p class="ok card">{form.ok}</p>{/if}

	<section class="card">
		<ul class="lista">
			{#each data.perfiles as p (p.user_id)}
				<li>
					<form method="POST" action="?/actualizar" class="fila">
						<input type="hidden" name="user_id" value={p.user_id} />
						<div class="email"><strong>{p.email ?? 'Sin email'}</strong></div>
						<select class="input" name="rol" aria-label="Rol">
							<option value="asesor" selected={p.rol === 'asesor'}>Asesor</option>
							<option value="admin" selected={p.rol === 'admin'}>Admin</option>
						</select>
						<select class="input" name="asesor_id" aria-label="Asesor asignado">
							<option value="">Sin asignar</option>
							{#each data.asesores as a (a.id)}
								<option value={a.id} selected={p.asesor_id === a.id}>{a.nombre}</option>
							{/each}
						</select>
						<button class="btn btn-primary" type="submit">Guardar</button>
					</form>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	.wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 16px; }
	h1 { margin: 0; font-size: 26px; color: var(--text); }
	.muted { color: var(--muted); margin: 0; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); margin: 0; }
	.error { color: var(--danger); }
	.ok { color: var(--success); }
	.lista { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
	.lista li { border: 1px solid var(--border); border-radius: 12px; padding: 12px; }
	.fila { display: grid; grid-template-columns: 1.4fr 1fr 1.2fr auto; gap: 10px; align-items: center; margin: 0; }
	.email { min-width: 0; overflow-wrap: anywhere; }
	@media (max-width: 760px) {
		.fila { grid-template-columns: 1fr; }
	}
</style>
