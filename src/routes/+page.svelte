<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="home">
	<h1>Panel</h1>
	<p>Hola{data.user?.email ? `, ${data.user.email}` : ''}. El dashboard se arma en el próximo paso.</p>
</main>

<style>
	.home { max-width: 720px; margin: 40px auto; padding: 0 16px; font-family: system-ui, sans-serif; }
	h1 { color: #1f3a5f; }
</style>
