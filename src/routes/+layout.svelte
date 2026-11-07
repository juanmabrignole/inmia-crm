<script lang="ts">
	import '../app.css';
	import favicon from '../lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { applyTheme, currentTheme, loadTheme, type Theme } from '../lib/theme';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	let theme = $state<Theme>('light');

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
	<header class="topbar">
		<strong class="brand">Inmia CRM</strong>
		<div class="actions">
			<span class="email">{data.user.email}</span>
			<button type="button" class="ghost" onclick={toggleTheme} aria-label="Cambiar tema">
				{theme === 'dark' ? '☀ Claro' : '☾ Oscuro'}
			</button>
			<form method="POST" action="/logout">
				<button type="submit" class="ghost">Salir</button>
			</form>
		</div>
	</header>
{/if}

{@render children()}

<style>
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 12px 20px;
		background: var(--primary);
		color: var(--on-primary);
		flex-wrap: wrap;
	}
	.brand { font-size: 18px; letter-spacing: 0.02em; }
	.actions { display: flex; gap: 10px; align-items: center; font-size: 14px; flex-wrap: wrap; }
	.email { opacity: 0.85; }
	.actions form { margin: 0; }
	.ghost {
		background: transparent;
		color: inherit;
		border: 1px solid currentColor;
		border-radius: 999px;
		padding: 5px 12px;
		cursor: pointer;
		font: inherit;
	}
	.ghost:hover { background: rgba(127, 127, 127, 0.15); }
</style>
