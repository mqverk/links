<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		blur?: number;
		borderWidth?: number;
		spread?: number;
		glow?: boolean;
		disabled?: boolean;
		proximity?: number;
		inactiveZone?: number;
	}

	let {
		blur = 0,
		borderWidth = 3,
		spread = 80,
		glow = true,
		disabled = false,
		proximity = 64,
		inactiveZone = 0.01
	}: Props = $props();

	let container: HTMLElement;
	let mousePosition = $state({ x: 0, y: 0 });
	let isNearElement = $state(false);

	onMount(() => {
		if (disabled || !glow) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!container) return;

			const rect = container.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			mousePosition.x = x;
			mousePosition.y = y;

			// Check if mouse is within proximity
			const isWithin =
				x > -proximity &&
				x < rect.width + proximity &&
				y > -proximity &&
				y < rect.height + proximity;

			isNearElement = isWithin;

			// Update the gradient position
			if (container) {
				container.style.setProperty('--mouse-x', `${x}px`);
				container.style.setProperty('--mouse-y', `${y}px`);
				container.style.setProperty('--is-near', isWithin ? '1' : '0');
			}
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<div
	bind:this={container}
	class="pointer-events-none absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300"
	class:opacity-100={isNearElement && glow && !disabled}
	style="
		--blur: {blur}px;
		--border-width: {borderWidth}px;
		--spread: {spread}px;
		--proximity: {proximity}px;
		--inactive-zone: {inactiveZone};
		background: radial-gradient(
			circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0) 70%
		);
		filter: blur(var(--blur));
	"
>
</div>

<style>
	:global([data-glowing-effect]) {
		position: relative;
		overflow: hidden;
	}
</style>
