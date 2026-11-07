<script lang="ts">
  import type { PageData } from './$types';

  type Comparable = {
    id: string;
    direccion: string;
    precio: number;
    moneda: string;
    superficie_m2: number | null;
    ambientes: number | null;
    antiguedad_anios: number | null;
    distancia_m: number | null;
    ajuste_pct: number | null;
  };

  let { data }: { data: PageData } = $props();

  const t = $derived(data.tasacion);
  const p = $derived(t.propiedades);
  const fotos = $derived([...(p.fotos ?? [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).slice(0, 4));

  const comps = $derived(
    ((t.tasacion_comparables ?? []) as Comparable[]).map((c) => {
      const ajustado = c.precio * (1 + (c.ajuste_pct ?? 0) / 100);
      const precioM2 = c.superficie_m2 ? ajustado / c.superficie_m2 : null;
      return { ...c, ajustado, precioM2 };
    })
  );

  const conM2 = $derived(comps.filter((c) => c.precioM2 !== null));
  const promedioM2 = $derived(
    conM2.length ? conM2.reduce((acc, c) => acc + (c.precioM2 ?? 0), 0) / conM2.length : null
  );

  const fmt = (n: number | null | undefined, moneda = 'USD') =>
    n == null
      ? '—'
      : new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda, maximumFractionDigits: 0 }).format(n);
</script>

<svelte:head>
  <title>Informe de valor · {p.direccion}</title>
</svelte:head>

<div class="toolbar no-print">
  <button onclick={() => window.print()}>Imprimir / Guardar como PDF</button>
</div>

<article class="informe">
  <header>
    <div>
      <p class="kicker">Estimación de valor de mercado</p>
      <h1>{p.direccion}</h1>
      <p class="meta">
        {p.tipo ?? 'Propiedad'} · {p.ambientes ?? '—'} amb. · {p.superficie_m2 ?? '—'} m² · Fecha: {new Date(t.fecha).toLocaleDateString('es-AR')}
      </p>
    </div>
  </header>

  {#if fotos.length}
    <section class="fotos">
      {#each fotos as foto}
        <img src={foto.url} alt="Foto de la propiedad" />
      {/each}
    </section>
  {/if}

  <section class="valor">
    <div>
      <span>Valor sugerido</span>
      <strong>{fmt(t.valor_sugerido, t.moneda)}</strong>
    </div>
    <div>
      <span>Rango</span>
      <strong>{fmt(t.valor_minimo, t.moneda)} – {fmt(t.valor_maximo, t.moneda)}</strong>
    </div>
    <div>
      <span>Promedio de comparables</span>
      <strong>{promedioM2 ? fmt(promedioM2 * (p.superficie_m2 ?? 0), t.moneda) : '—'}</strong>
    </div>
  </section>

  <section>
    <h2>Propiedades comparables</h2>
    {#if comps.length}
      <table>
        <thead>
          <tr>
            <th>Dirección</th>
            <th>Sup. m²</th>
            <th>Amb.</th>
            <th>Antig.</th>
            <th>Precio</th>
            <th>Ajuste</th>
            <th>Precio ajustado</th>
            <th>USD/m²</th>
          </tr>
        </thead>
        <tbody>
          {#each comps as c}
            <tr>
              <td>{c.direccion}</td>
              <td>{c.superficie_m2 ?? '—'}</td>
              <td>{c.ambientes ?? '—'}</td>
              <td>{c.antiguedad_anios ?? '—'}</td>
              <td>{fmt(c.precio, c.moneda)}</td>
              <td>{c.ajuste_pct ?? 0}%</td>
              <td>{fmt(c.ajustado, c.moneda)}</td>
              <td>{fmt(c.precioM2, c.moneda)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>Sin comparables cargados.</p>
    {/if}
  </section>

  {#if t.notas}
    <section>
      <h2>Observaciones</h2>
      <p>{t.notas}</p>
    </section>
  {/if}

  <footer>
    <p>
      Documento de estimación orientativa de valor de mercado. No constituye una tasación ni tiene validez como tal.
      Elaborado por {t.tasador ?? 'la inmobiliaria'} con datos de mercado a la fecha indicada.
    </p>
  </footer>
</article>

<style>
  :global(body) { background: #f4f4f1; color: #1d1d1b; font-family: system-ui, sans-serif; margin: 0; }
  .toolbar { padding: 16px; text-align: right; }
  .toolbar button { padding: 10px 16px; border: 0; border-radius: 8px; background: #1f3a5f; color: #fff; cursor: pointer; }
  .informe { background: #fff; max-width: 820px; margin: 0 auto 32px; padding: 32px; box-sizing: border-box; }
  .kicker { text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px; color: #1f3a5f; margin: 0; }
  h1 { font-size: 26px; margin: 4px 0; }
  h2 { font-size: 18px; margin: 24px 0 8px; border-bottom: 2px solid #1f3a5f; padding-bottom: 4px; }
  .meta { color: #555; margin: 0; }
  .fotos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 16px 0; }
  .fotos img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 6px; }
  .valor { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
  .valor div { background: #eef3f9; padding: 12px; border-radius: 8px; }
  .valor span { display: block; font-size: 12px; color: #555; }
  .valor strong { font-size: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px; border-bottom: 1px solid #ddd; }
  footer { margin-top: 32px; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 12px; }

  @media (max-width: 600px) {
    .informe { padding: 16px; }
    .valor { grid-template-columns: 1fr; }
    table { font-size: 11px; }
  }

  @media print {
    :global(body) { background: #fff; }
    .no-print { display: none; }
    .informe { margin: 0; padding: 0; max-width: none; box-shadow: none; }
    .fotos img { break-inside: avoid; }
    table, section { break-inside: avoid; }
  }
</style>
