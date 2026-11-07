<script lang="ts">
	import '../app.css';
	import favicon from '../lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { applyTheme, currentTheme, loadTheme, type Theme } from '../lib/theme';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	let theme = $state<Theme>('light');

	const menu = [
		{ href: '/', label: 'Panel', icono: '▦' },
		{ href: '/propiedades', label: 'Propiedades', icono: '⌂' },
		{ href: '/propiedades/nueva', label: 'Nueva propiedad', icono: '+' }
	];

	function isActive(href: string) {
		const path = page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
	}

	onMount(() => {
		loadTheme();
		theme = currentTheme();
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		applyTheme(theme);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

{#if data.user}
	<div class="shell">
		<aside class="sidebar">
			<div class="brand">Inmia CRM</div>

			<nav class="menu" aria-label="Módulos">
				{#each menu as item (item.href)}
					<a href={item.href} class:active={isActive(item.href)} aria-current={isActive(item.href) ? 'page' : undefined}>
						<span class="icono" aria-hidden="true">{item.icono}</span>
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="pie">
				<span class="email">{data.user.email}</span>
				<button type="button" class="ghost" onclick={toggleTheme} aria-label="Cambiar tema">
					{theme === 'dark' ? '☀ Claro' : '☾ Oscuro'}
				</button>
				<form method="POST" action="/logout">
					<button type="submit" class="ghost">Salir</button>
				</form>
			</div>
		</aside>

		<div class="contenido">
			{@render children()}
		</div>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	/* Mobile first: base = celular; escritorio desde 761px */
	.shell { display: grid; grid-template-columns: 1fr; min-height: 100vh; }
	.sidebar {
		position: static;
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		padding: 12px 14px;
		background: var(--sidebar);
		color: var(--on-sidebar);
	}
	.brand { font-size: 20px; font-weight: 700; letter-spacing: 0.01em; padding: 0 10px; }
	.brand::before { content: '■ '; color: var(--accent); }
	.menu { display: flex; flex-wrap: wrap; gap: 4px; }
	.menu a {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 10px;
		border-radius: 10px;
		color: inherit;
		text-decoration: none;
		opacity: 0.85;
	}
	.menu a:hover { background: rgba(127, 127, 127, 0.18); opacity: 1; }
	.menu a.active { background: var(--accent); color: var(--accent-ink); opacity: 1; font-weight: 600; }
	.icono { width: 1.2em; text-align: center; }
	.pie { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 13px; }
	.email { display: none; opacity: 0.8; overflow-wrap: anywhere; }
	.pie form { margin: 0; }
	.ghost {
		background: transparent;
		color: inherit;
		border: 1px solid currentColor;
		border-radius: 999px;
		padding: 6px 12px;
		cursor: pointer;
		font: inherit;
	}
	.ghost:hover { background: rgba(127, 127, 127, 0.15); }
	.menu a { transition: background 0.15s ease; }
	.contenido { min-width: 0; }

	@media (min-width: 761px) {
		.shell { grid-template-columns: 230px 1fr; }
		.sidebar {
			position: sticky;
			top: 0;
			height: 100vh;
			flex-direction: column;
			align-items: stretch;
			flex-wrap: nowrap;
			gap: 22px;
			padding: 20px 14px;
		}
		.menu { display: grid; flex-wrap: nowrap; gap: 4px; }
		.menu a { padding: 10px 12px; }
		.pie { margin-top: auto; margin-left: 0; flex-direction: column; align-items: stretch; gap: 10px; }
		.email { display: block; }
		.ghost { width: 100%; }
	}
</style>
