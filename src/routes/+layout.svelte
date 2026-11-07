<script lang="ts">
	import favicon from '../lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.user}
	<header class="topbar">
		<strong>Inmia CRM</strong>
		<div>
			<span>{data.user.email}</span>
			<form method="POST" action="/logout">
				<button type="submit">Salir</button>
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
		padding: 12px 16px;
		background: #1f3a5f;
		color: #fff;
		font-family: system-ui, sans-serif;
	}
	.topbar div {
		display: flex;
		gap: 12px;
		align-items: center;
		font-size: 14px;
	}
	.topbar form { margin: 0; }
	.topbar button {
		background: transparent;
		color: #fff;
		border: 1px solid #fff;
		border-radius: 6px;
		padding: 4px 10px;
		cursor: pointer;
	}
</style>
