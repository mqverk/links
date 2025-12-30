<script lang="ts">
	import type { Profile } from '$lib/data';
	import { quotes } from '$lib/data';
	import { onMount, onDestroy } from 'svelte';

	let { profile }: { profile: Profile } = $props();

	// Time Logic
	let time = $state(new Date());
	let interval: any;

	// Quote Logic
	let quote = $state(quotes[0]);

	// Spotlight Logic
	let card: HTMLElement;
	let mouseX = $state(0);
	let mouseY = $state(0);
	let isHovering = $state(false);

	function updateMousePosition(e: MouseEvent) {
		if (!card) return;
		const rect = card.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

	onMount(() => {
		interval = setInterval(() => {
			time = new Date();
		}, 1000);
		
		// Random quote on mount
		quote = quotes[Math.floor(Math.random() * quotes.length)];
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={card}
	onmousemove={updateMousePosition}
	onmouseleave={handleMouseLeave}
	class="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 text-center backdrop-blur-sm md:p-8 md:text-left"
>
	<!-- Spotlight Effect -->
	<div
		class="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
		style:opacity={isHovering ? 1 : 0}
		style:background={`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 40%)`}
	></div>

	<!-- Content -->
	<div class="relative z-10">
		<div class="relative mb-6 inline-block md:mx-0">
			<img
				src={profile.avatarUrl}
				alt={profile.name}
				class="h-24 w-24 rounded-2xl object-cover shadow-2xl transition-transform hover:scale-105"
			/>
			<div class="group absolute -right-2 -bottom-2">
				<div
					class="flex h-8 w-8 cursor-help items-center justify-center rounded-xl border-2 border-neutral-900 bg-neutral-800 text-lg shadow-lg"
				>
					💻
				</div>
				<!-- Custom Tooltip -->
				<div
					class="pointer-events-none absolute top-10 left-1/2 z-20 w-max max-w-[150px] -translate-x-1/2 transform opacity-0 transition-all duration-200 group-hover:top-9 group-hover:opacity-100"
				>
					<div
						class="rounded-lg border border-neutral-700/50 bg-neutral-800/90 px-3 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-sm"
					>
						{profile.status}
						<div
							class="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-800/90"
						></div>
					</div>
				</div>
			</div>
		</div>

		<h1 class="mb-2 text-3xl font-bold tracking-tight text-white">{profile.name}</h1>
		<p class="text-neutral-400">{profile.role}</p>
	</div>

	<div class="relative z-10 mt-8">
		<div class="mb-6 flex w-full items-center justify-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-neutral-500 [scrollbar-width:none] md:justify-start">
			<div class="flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-800/50 px-3 py-1">
				<span class="relative flex h-2 w-2">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
					></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
				</span>
				<span class="font-mono text-xs">
					{time.toLocaleTimeString('en-US', {
						timeZone: 'Asia/Kolkata',
						hour: '2-digit',
						minute: '2-digit'
					})}
					IST
				</span>
			</div>
			<span>•</span>
			<span>{profile.location}</span>
		</div>

		<div class="space-y-2">
			<p class="text-sm italic font-medium leading-relaxed text-neutral-400">
				"{quote.text}"
			</p>
			<p class="text-xs font-semibold uppercase tracking-wider text-neutral-600">
				— {quote.author}
			</p>
		</div>
	</div>
</div>
