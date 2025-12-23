<script lang="ts">
	import type { Profile } from '$lib/data';
	import { fetchDiscordStatus, subscribeToDiscordStatus, type ActivityDisplay } from '$lib/utils/lanyard';
	import { onMount } from 'svelte';

	let { profile }: { profile: Profile } = $props();
	let activityDisplay = $state<ActivityDisplay>({ text: profile.status, activity: null });
	let isLoading = $state(true);

	function getActivityImageUrl(activity: any): string | null {
		if (!activity?.assets?.large_image) {
			return null;
		}

		const imageId = activity.assets.large_image;
		let imageUrl: string | null = null;

		// If it's already a full URL (from Lanyard CDN)
		if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
			imageUrl = imageId;
		} else if (imageId.startsWith('mp:')) {
			// Spotify/Lanyard external format - extract the actual URL
			const httpIndex = imageId.indexOf('http');
			if (httpIndex !== -1) {
				imageUrl = imageId.substring(httpIndex);
			} else {
				// Fallback for regular Spotify format
				imageUrl = imageId.replace('mp:', 'https://i.scdn.co/image/');
			}
		} else if (activity.application_id) {
			// For Discord app assets
			const appId = activity.application_id;
			imageUrl = `https://cdn.discordapp.com/app-assets/${appId}/${imageId}`;
		}

		// If we have an image URL, proxy it through our API
		if (imageUrl) {
			return `/api/image?url=${encodeURIComponent(imageUrl)}`;
		}

		return null;
	}

	onMount(async () => {
		// Fetch initial status
		try {
			activityDisplay = await fetchDiscordStatus();
		} catch (error) {
			console.error('Failed to fetch initial Discord status:', error);
		} finally {
			isLoading = false;
		}

		// Subscribe to real-time updates
		const unsubscribe = subscribeToDiscordStatus((newActivityDisplay) => {
			activityDisplay = newActivityDisplay;
		});

		return unsubscribe;
	});
</script>

<div
	class="flex h-full flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm"
>
	<div>
		<div class="relative mb-6 inline-block">
			<img
				src={profile.avatarUrl}
				alt={profile.name}
				class="h-24 w-24 rounded-2xl object-cover shadow-2xl transition-transform hover:scale-105"
			/>
			<div class="group absolute -right-2 -bottom-2">
				<div
					class="flex h-8 w-8 cursor-help items-center justify-center rounded-xl border-2 border-neutral-900 bg-neutral-800 text-lg shadow-lg transition-opacity"
					class:opacity-50={isLoading}
				>
					{isLoading ? '⏳' : '💻'}
				</div>
				<!-- Custom Tooltip with Activity Display -->
				<div
					class="pointer-events-none absolute top-10 left-1/2 z-20 w-max max-w-xs -translate-x-1/2 transform opacity-0 transition-all duration-200 group-hover:top-9 group-hover:opacity-100"
				>
					<div
						class="rounded-lg border border-neutral-700/50 bg-neutral-800/90 px-4 py-3 shadow-xl backdrop-blur-sm"
					>
						{#if activityDisplay.activity && getActivityImageUrl(activityDisplay.activity)}
							<div class="mb-2 flex gap-3">
								<img
									src={getActivityImageUrl(activityDisplay.activity)}
									alt={activityDisplay.activity.name}
									class="h-12 w-12 rounded-lg object-cover"
								/>
								<div class="flex flex-col justify-center">
									<p class="text-xs font-semibold text-neutral-300">
										{activityDisplay.activity.name}
									</p>
									<p class="text-xs text-neutral-400">
										{activityDisplay.text}
									</p>
									{#if activityDisplay.activity.details}
										<p class="text-xs text-neutral-400">
											{activityDisplay.activity.details}
										</p>
									{/if}
								</div>
							</div>
						{:else}
							<p class="text-xs font-medium text-white">
								{activityDisplay.text}
							</p>
						{/if}
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

	<div class="mt-8">
		<div class="mb-6 flex items-center gap-2 text-sm text-neutral-500">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
					cx="12"
					cy="10"
					r="3"
				/></svg
			>
			{profile.location}
		</div>
		<p class="leading-relaxed text-neutral-300">
			{profile.bio}
		</p>
	</div>
</div>
