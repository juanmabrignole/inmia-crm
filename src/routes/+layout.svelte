<script lang="ts">
	import '../app.css';
	import favicon from '../lib/assets/favicon.svg';
	import { BRAND } from '../lib/brand';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { applyTheme, currentTheme, loadTheme, type Theme } from '../lib/theme';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	let theme = $state<Theme>('light');
	let colapsado = $state(false);

	const menu = [
		{ href: '/hoy', label: 'Hoy', icono: '☀' },
		{ href: '/', label: 'Panel', icono: '▦' },
		{ href: '/agenda', label: 'Agenda', icono: '◷' },
		{ href: '/propiedades', label: 'Propiedades', icono: '⌂' },
		{ href: '/propiedades/nueva', label: 'Nueva propiedad', icono: '+' },
		{ href: '/leads', label: 'Consultas', icono: '✉' },
		{ href: '/inquilinos', label: 'Inquilinos', icono: '◎' },
		{ href: '/contratos', label: 'Contratos', icono: '▤' },
		{ href: '/asesores', label: 'Asesores', icono: '◉' },
		{ href: '/equipo', label: 'Equipo', icono: '⚑', admin: true },
		{ href: '/ayuda', label: 'Ayuda', icono: '?' }
	];

	function isActive(href: string) {
		const path = page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
	}

	onMount(() => {
		loadTheme();
		theme = currentTheme();
		// Preferencia de este navegador: menú colapsado o no (si falla el storage, queda desplegado)
		try {
			colapsado = localStorage.getItem('inmia-menu') === 'colapsado';
		} catch {
			colapsado = false;
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		applyTheme(theme);
	}

	function toggleMenu() {
		colapsado = !colapsado;
		try {
			localStorage.setItem('inmia-menu', colapsado ? 'colapsado' : 'desplegado');
		} catch {
			/* sin storage, la preferencia dura solo esta sesión */
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

{#if data.user}
	<div class="shell" class:colapsado>
		<aside class="sidebar">
			<div class="cabeza">
				<div class="brand"><span class="texto">{BRAND.nombre}</span></div>
				<button type="button" class="colapsar" onclick={toggleMenu} aria-label={colapsado ? 'Desplegar menú' : 'Ocultar menú'} aria-expanded={!colapsado}>
					{colapsado ? '»' : '«'}
				</button>
			</div>

			<nav class="menu" aria-label="Módulos">
				{#each menu.filter((m) => !m.admin || data.perfil?.rol === 'admin') as item (item.href)}
					<a href={item.href} title={item.label} class:active={isActive(item.href)} aria-current={isActive(item.href) ? 'page' : undefined}>
						<span class="icono" aria-hidden="true">{item.icono}</span>
						<span class="texto">{item.label}</span>
					</a>
				{/each}
			</nav>

			<div class="pie">
				<span class="email texto">{data.user.email}</span>
				<button type="button" class="ghost" onclick={toggleTheme} aria-label="Cambiar tema">
					<span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
					<span class="texto">{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
				</button>
				<form method="POST" action="/logout">
					<button type="submit" class="ghost">
						<span aria-hidden="true">⏻</span>
						<span class="texto">Salir</span>
					</button>
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
	.cabeza { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
	.brand { font-size: 20px; font-weight: 700; letter-spacing: 0.01em; padding: 0 10px; white-space: nowrap; }
	.brand::before { content: '■ '; color: var(--accent); }
	.colapsar { display: none; }
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.ghost:hover { background: rgba(127, 127, 127, 0.15); }
	.menu a { transition: background 0.15s ease; }
	.contenido { min-width: 0; }

	@media (min-width: 761px) {
		.shell { grid-template-columns: 230px 1fr; transition: grid-template-columns 0.2s ease; }
		.sidebar {
			position: sticky;
			top: 0;
			height: 100vh;
			overflow-y: auto;
			flex-direction: column;
			align-items: stretch;
			flex-wrap: nowrap;
			gap: 18px;
			padding: 20px 14px;
		}
		.cabeza { justify-content: space-between; }
		.colapsar {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: 999px;
			border: 1px solid currentColor;
			background: transparent;
			color: inherit;
			cursor: pointer;
			font: inherit;
			flex: none;
		}
		.colapsar:hover { background: rgba(127, 127, 127, 0.15); }
		.menu { display: grid; flex-wrap: nowrap; gap: 4px; }
		.menu a { padding: 9px 12px; }
		.pie { margin-top: auto; margin-left: 0; flex-direction: column; align-items: stretch; gap: 10px; }
		.email { display: block; }
		.ghost { width: 100%; }

		/* Menú colapsado: solo íconos */
		.shell.colapsado { grid-template-columns: 72px 1fr; }
		.colapsado .sidebar { padding: 20px 10px; }
		.colapsado .cabeza { flex-direction: column; gap: 12px; }
		.colapsado .brand { padding: 0; }
		.colapsado .brand::before { content: '■'; }
		.colapsado .texto { display: none; }
		.colapsado .menu a { justify-content: center; padding: 10px 0; }
		.colapsado .ghost { width: 40px; padding: 8px 0; margin: 0 auto; }
		.colapsado .pie { align-items: center; }
	}
</style>
