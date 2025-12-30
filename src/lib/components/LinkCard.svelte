<script lang="ts">
	import type { LinkItem } from '$lib/data';
	import { ArrowUpRight } from 'lucide-svelte';
	import GlowingEffect from './GlowingEffect.svelte';

	let { link }: { link: LinkItem } = $props();
	let Icon = $derived(link.icon);
</script>

<a
	href={link.url}
	target="_blank"
	rel="noopener noreferrer"
	class="{link.class} group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-neutral-800/50 bg-neutral-900/50 p-4 transition-transform duration-200 hover:scale-[1.02] md:h-full md:flex-col md:items-start md:justify-between md:rounded-3xl md:p-6 md:gap-0"
	data-glowing-effect
>
	<GlowingEffect
		blur={0}
		borderWidth={3}
		spread={80}
		glow={true}
		disabled={false}
		proximity={64}
		inactiveZone={0.01}
	/>

	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/50 {link.color} transition-colors md:h-12 md:w-12 md:rounded-2xl"
	>
		<Icon size={20} class="md:h-6 md:w-6" />
	</div>

	<div class="flex flex-1 flex-col md:w-full md:flex-none">
		<h3 class="font-bold text-white text-base md:mb-1 md:text-xl">{link.title}</h3>
		<p class="text-xs font-medium text-neutral-500 md:text-sm">
			{link.subtitle}
		</p>
	</div>

	<div
		class="text-neutral-600 md:bg-transparent md:absolute md:top-6 md:right-6"
	>
		<ArrowUpRight size={20} />
	</div>
</a>
