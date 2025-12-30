<script lang="ts">
	import type { LinkItem } from '$lib/data';
	import { onMount } from 'svelte';

	interface Props {
		links: LinkItem[];
	}

	let { links }: Props = $props();

	let cardsContainer: HTMLElement;
	let cards: HTMLElement[] = [];

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			for (const card of cards) {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				card.style.setProperty('--mouse-x', `${x}px`);
				card.style.setProperty('--mouse-y', `${y}px`);
			}
		};

		cardsContainer?.addEventListener('mousemove', handleMouseMove);

		return () => {
			cardsContainer?.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<div class="bg-black min-h-screen flex justify-center items-center p-4">
	<div
		bind:this={cardsContainer}
		class="grid grid-cols-3 gap-2 max-w-6xl w-full"
	>
		{#each links as link, index}
			<div
				bind:this={cards[index]}
				class="card"
				style="--mouse-x: 50%; --mouse-y: 50%;"
			>
				<div class="card-content">
					<div class="card-icon">
						<svelte:component this={link.icon} size={32} />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	:global(body) {
		background-color: black;
		margin: 0;
		font-family: sans-serif;
	}

	.card {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		position: relative;
		height: 260px;
		cursor: pointer;
	}

	/* The Outer Glow (Hidden by default, revealed on grid hover) */
	.card::before {
		content: '';
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: inherit;
		background: radial-gradient(
			800px circle at var(--mouse-x) var(--mouse-y),
			rgba(255, 255, 255, 0.4),
			transparent 40%
		);
		z-index: 1;
		opacity: 0;
		transition: opacity 0.5s;
		pointer-events: none;
	}

	/* Reveal Outer Glow on ALL cards when hovering the grid */
	:global(div[bind\:this=cardsContainer]:hover) .card::before {
		opacity: 1;
	}

	/* The Inner Card (Content) */
	.card-content {
		background-color: #171717;
		border-radius: inherit;
		position: absolute;
		inset: 1px;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* The Inner Glow (Specific to hovered card) */
	.card-content::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			400px circle at var(--mouse-x) var(--mouse-y),
			rgba(255, 255, 255, 0.15),
			transparent 40%
		);
		border-radius: inherit;
		z-index: 3;
		opacity: 0;
		transition: opacity 0.5s;
		pointer-events: none;
	}

	/* Reveal Inner Glow only when specific card is hovered */
	.card:hover .card-content::before {
		opacity: 1;
	}

	/* Icon Styling */
	.card-icon {
		position: relative;
		z-index: 4;
		color: rgba(255, 255, 255, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Responsive Layout */
	@media (max-width: 700px) {
		:global(div) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 450px) {
		:global(div) {
			grid-template-columns: 1fr;
		}
	}
</style>
