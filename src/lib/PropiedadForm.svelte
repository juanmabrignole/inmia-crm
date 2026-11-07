<script lang="ts">
	import { OPERACIONES, ESTADOS_VENTA, ESTADOS_ALQUILER, MONEDAS } from './propiedades';

	let {
		values = {},
		error = null,
		submitLabel = 'Guardar'
	}: { values?: Record<string, string>; error?: string | null; submitLabel?: string } = $props();

	const v = (k: string, d = '') => values[k] ?? d;
</script>

<form method="POST" class="form">
	<div class="grid">
		<label class="full">Dirección
			<input class="input" name="direccion" required value={v('direccion')} />
		</label>
		<label>Tipo
			<input class="input" name="tipo" value={v('tipo')} placeholder="Departamento, Casa, PH…" />
		</label>
		<label>Operación
			<select class="input" name="operacion">
				{#each OPERACIONES as o (o.value)}
					<option value={o.value} selected={v('operacion', 'venta') === o.value}>{o.label}</option>
				{/each}
			</select>
		</label>
		<label>Ambientes
			<input class="input" type="number" min="0" name="ambientes" value={v('ambientes')} />
		</label>
		<label>Dormitorios
			<input class="input" type="number" min="0" name="dormitorios" value={v('dormitorios')} />
		</label>
		<label>Baños
			<input class="input" type="number" min="0" name="banos" value={v('banos')} />
		</label>
		<label>Superficie (m²)
			<input class="input" type="number" min="0" step="0.01" name="superficie_m2" value={v('superficie_m2')} />
		</label>
		<label>Antigüedad (años)
			<input class="input" type="number" min="0" name="antiguedad_anios" value={v('antiguedad_anios')} />
		</label>
		<label class="check">
			<input type="checkbox" name="cochera" checked={v('cochera') === 'true'} /> Tiene cochera
		</label>
	</div>

	<fieldset class="block">
		<legend>Venta</legend>
		<div class="grid">
			<label>Precio
				<input class="input" type="number" min="0" step="1" name="precio_venta" value={v('precio_venta')} />
			</label>
			<label>Moneda
				<select class="input" name="moneda_venta">
					{#each MONEDAS as m (m)}
						<option value={m} selected={v('moneda_venta', 'USD') === m}>{m}</option>
					{/each}
				</select>
			</label>
			<label>Estado
				<select class="input" name="estado_venta">
					{#each ESTADOS_VENTA as e (e)}
						<option value={e} selected={v('estado_venta', 'disponible') === e}>{e}</option>
					{/each}
				</select>
			</label>
		</div>
	</fieldset>

	<fieldset class="block">
		<legend>Alquiler</legend>
		<div class="grid">
			<label>Precio mensual
				<input class="input" type="number" min="0" step="1" name="precio_alquiler" value={v('precio_alquiler')} />
			</label>
			<label>Moneda
				<select class="input" name="moneda_alquiler">
					{#each MONEDAS as m (m)}
						<option value={m} selected={v('moneda_alquiler', 'ARS') === m}>{m}</option>
					{/each}
				</select>
			</label>
			<label>Estado
				<select class="input" name="estado_alquiler">
					{#each ESTADOS_ALQUILER as e (e)}
						<option value={e} selected={v('estado_alquiler', 'disponible') === e}>{e}</option>
					{/each}
				</select>
			</label>
		</div>
	</fieldset>

	<label class="full">Descripción
		<textarea class="input" name="descripcion" rows="5">{v('descripcion')}</textarea>
	</label>

	<label class="check">
		<input type="checkbox" name="publicada" checked={v('publicada', 'true') === 'true'} />
		Publicada (aparece en el feed para portales)
	</label>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<div class="actions">
		<button class="btn btn-primary" type="submit">{submitLabel}</button>
	</div>
</form>

<style>
	.form { display: grid; gap: 16px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
	label { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
	label.full { grid-column: 1 / -1; }
	label.check { display: flex; align-items: center; gap: 8px; color: var(--text); }
	.block { border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin: 0; }
	legend { padding: 0 6px; color: var(--muted); font-size: 13px; }
	.error { color: var(--danger); margin: 0; }
	.actions { display: flex; justify-content: flex-end; }
</style>
