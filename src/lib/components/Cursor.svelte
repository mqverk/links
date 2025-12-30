<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let isDesktop = $state(false);
	let container = $state<HTMLElement>();
	let dots: HTMLSpanElement[] = $state([]);

	const amount = 20;
	const width = 26;

	let mousePosition = { x: 0, y: 0 };
	let dotsData: any[] = [];
	let animationFrame: number;

	class Dot {
		index: number;
		anglespeed = 0.05;
		x = 0;
		y = 0;
		scale: number;
		range: number;
		limit: number;
		lockX = 0;
		lockY = 0;
		angleX = 0;
		angleY = 0;

		constructor(index: number) {
			this.index = index;
			this.scale = 1 - 0.05 * index;
			this.range = width / 2 - (width / 2) * this.scale + 2;
			this.limit = width * 0.75 * this.scale;
		}

		lock() {
			this.lockX = this.x;
			this.lockY = this.y;
			this.angleX = Math.PI * 2 * Math.random();
			this.angleY = Math.PI * 2 * Math.random();
		}

		update() {
			// Follow logic handled in render loop for x/y
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDesktop) return;
		mousePosition.x = e.clientX;
		mousePosition.y = e.clientY;
	}

	function render() {
		let x = mousePosition.x;
		let y = mousePosition.y;

		dotsData.forEach((dot, index) => {
			let nextDot = dotsData[index + 1] || dotsData[0];
			
			dot.update();

			const dx = (nextDot.x - dot.x) * 0.35;
			const dy = (nextDot.y - dot.y) * 0.35;
			dot.x += dx;
			dot.y += dy;
			dot.x = x;
			dot.y = y;

			// Apply to DOM
			if (dots[index]) {
				dots[index].style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`;
			}

			// Calculate position for NEXT dot in the chain
			const nextDx = (nextDot.x - x) * 0.35;
			const nextDy = (nextDot.y - y) * 0.35;
			x += nextDx;
			y += nextDy;
		});

		animationFrame = requestAnimationFrame(render);
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(pointer: fine)');
		isDesktop = mediaQuery.matches;

		mediaQuery.addEventListener('change', (e) => {
			isDesktop = e.matches;
		});

		// Init dots
		for (let i = 0; i < amount; i++) {
			dotsData.push(new Dot(i));
		}
		
		// Initialize positions
		dotsData.forEach(d => { d.x = window.innerWidth/2; d.y = window.innerHeight/2; });

		render();
	});

	onDestroy(() => {
		if (browser) {
			if (animationFrame) cancelAnimationFrame(animationFrame);
		}
	});
</script>

<svelte:window onmousemove={handleMouseMove} />

{#if isDesktop}
	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="hidden">
		<defs>
			<filter id="goo">
				<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
				<feColorMatrix
					in="blur"
					mode="matrix"
					values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15"
					result="goo"
				/>
				<feComposite in="SourceGraphic" in2="goo" operator="atop" />
			</filter>
		</defs>
	</svg>

	<div
		bind:this={container}
		class="pointer-events-none fixed top-0 left-0 z-9999 h-full w-full mix-blend-difference"
		style="filter: url('#goo');"
	>
		{#each { length: amount } as _, i}
			<span
				bind:this={dots[i]}
				class="absolute block h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white will-change-transform"
			></span>
		{/each}
	</div>
	
	<!-- Hide default cursor -->
{/if}
