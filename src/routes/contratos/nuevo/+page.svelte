<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Nuevo contrato · Inmia CRM</title>
</svelte:head>

<main class="wrap">
	<a class="volver" href="/contratos">← Volver a contratos</a>
	<h1>Nuevo contrato de alquiler</h1>

	<section class="card">
		<form method="POST" class="form">
			<div class="grid">
				<label class="full">Propiedad
					<select class="input" name="propiedad_id" required>
						<option value="">Elegí una propiedad</option>
						{#each data.propiedades as p (p.id)}<option value={p.id}>{p.direccion}</option>{/each}
					</select>
				</label>
				<label class="full">Inquilino
					<select class="input" name="inquilino_id" required>
						<option value="">Elegí un inquilino</option>
						{#each data.inquilinos as i (i.id)}<option value={i.id}>{i.nombre}</option>{/each}
					</select>
					<a class="volver" href="/inquilinos/nuevo">+ Cargar inquilino nuevo</a>
				</label>
				<label>Inicio
					<input class="input" type="date" name="fecha_inicio" required />
				</label>
				<label>Vencimiento
					<input class="input" type="date" name="fecha_vencimiento" required />
				</label>
				<label>Monto mensual
					<input class="input" type="number" min="0" step="1" name="monto" />
				</label>
				<label>Moneda
					<select class="input" name="moneda">
						<option value="ARS" selected>ARS</option>
						<option value="USD">USD</option>
					</select>
				</label>
				<label>Día de pago (1 a 31)
					<input class="input" type="number" min="1" max="31" name="dia_pago" />
				</label>
				{#if data.perfil?.rol === 'admin'}
				<label>Asesor
					<select class="input" name="asesor_id">
						<option value="">Sin asignar</option>
						{#each data.asesores as a (a.id)}<option value={a.id}>{a.nombre}</option>{/each}
					</select>
				</label>
				{/if}
				<label class="full">Notas
					<textarea class="input" name="notas" rows="3"></textarea>
				</label>
			</div>
			{#if form?.error}<p class="error">{form.error}</p>{/if}
			<div class="actions"><button class="btn btn-primary" type="submit">Crear contrato</button></div>
		</form>
	</section>
</main>

<style>
	.wrap { max-width: 860px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 14px; }
	h1 { margin: 0; color: var(--text); font-size: 26px; }
	.volver { color: var(--link); text-decoration: none; font-size: 14px; }
	.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
	.form { display: grid; gap: 16px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
	label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
	label.full { grid-column: 1 / -1; }
	.error { color: var(--danger); margin: 0; }
	.actions { display: flex; justify-content: flex-end; }
</style>
