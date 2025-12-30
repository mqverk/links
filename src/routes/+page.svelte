<script lang="ts">
	import { profile, links } from '$lib/data';
	import ProfileCard from '$lib/components/ProfileCard.svelte';
	import LinkCard from '$lib/components/LinkCard.svelte';
</script>

<svelte:head>
	<title>mqverk // links</title>
</svelte:head>

<div class="min-h-screen w-full bg-black font-sans text-white selection:bg-blue-500/30">
	<!-- Background Gradients -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<div
			class="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vh] rounded-full bg-blue-900/10 blur-[120px]"
		></div>
		<div
			class="absolute top-[40%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-purple-900/10 blur-[100px]"
		></div>
	</div>

	<main
		class="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center px-4 py-8 md:h-full md:px-8 md:py-24"
	>
		<div class="grid w-full grid-cols-1 gap-4 md:h-full md:grid-cols-4 md:grid-rows-4">
			<!-- Profile Card (Spans 2 columns, 2 rows) -->
			<div class="h-auto md:col-span-2 md:row-span-2 md:h-auto">
				<ProfileCard {profile} />
			</div>

			<!-- Links -->
			{#each links as link}
				<LinkCard {link} />
			{/each}
		</div>

		<div class="mt-8 w-full pb-6 text-center md:absolute md:bottom-6 md:left-0 md:mt-0 md:pb-0">
			<p class="text-xs font-medium text-neutral-600">
				Made with love ❤️ using <span class="text-[#ff3e00]">SvelteKit</span> by
				<a
					href="https://github.com/mqverk"
					target="_blank"
					class="transition-colors hover:text-white">Maverick</a
				>
			</p>
		</div>
	</main>
</div>
