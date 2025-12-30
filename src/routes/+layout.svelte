<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import Cursor from '$lib/components/Cursor.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<Cursor />
{@render children()}
