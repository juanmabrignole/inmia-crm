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
	.shell {
		display: grid;
		grid-template-columns: 230px 1fr;
		min-height: 100vh;
	}
	.sidebar {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 20px 14px;
		background: var(--primary);
		color: var(--on-primary);
	}
	.brand { font-size: 18px; font-weight: 700; letter-spacing: 0.02em; padding: 0 10px; }
	.menu { display: grid; gap: 4px; }
	.menu a {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 10px;
		color: inherit;
		text-decoration: none;
		opacity: 0.85;
	}
	.menu a:hover { background: rgba(127, 127, 127, 0.18); opacity: 1; }
	.menu a.active { background: rgba(127, 127, 127, 0.28); opacity: 1; font-weight: 600; }
	.icono { width: 1.2em; text-align: center; }
	.pie {
		margin-top: auto;
		display: grid;
		gap: 10px;
		font-size: 13px;
		padding: 0 6px;
	}
	.email { opacity: 0.8; overflow-wrap: anywhere; }
	.pie form { margin: 0; }
	.ghost {
		width: 100%;
		background: transparent;
		color: inherit;
		border: 1px solid currentColor;
		border-radius: 999px;
		padding: 6px 12px;
		cursor: pointer;
		font: inherit;
	}
	.ghost:hover { background: rgba(127, 127, 127, 0.15); }
	.contenido { min-width: 0; }

	@media (max-width: 760px) {
		.shell { grid-template-columns: 1fr; }
		.sidebar {
			position: static;
			height: auto;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			gap: 10px;
			padding: 12px 14px;
		}
		.menu { display: flex; flex-wrap: wrap; gap: 4px; }
		.menu a { padding: 6px 10px; }
		.pie { margin-top: 0; grid-auto-flow: column; align-items: center; width: auto; margin-left: auto; }
		.email { display: none; }
		.ghost { width: auto; }
	}
</style>
