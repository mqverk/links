<script lang="ts">
	import type { Profile } from '$lib/data';
	import { fetchDiscordStatus, subscribeToDiscordStatus, type ActivityDisplay } from '$lib/utils/lanyard';
	import { onMount } from 'svelte';
	import Gamepad2 from 'lucide-svelte/icons/gamepad-2';
	import Monitor from 'lucide-svelte/icons/monitor';
	import Headphones from 'lucide-svelte/icons/headphones';
	import Tv from 'lucide-svelte/icons/tv';
	import Code from 'lucide-svelte/icons/code';

	let { profile }: { profile: Profile } = $props();
	let activityDisplay = $state<ActivityDisplay>({ text: profile.status, activity: null });
	let isLoading = $state(true);

	function getActivityIcon(type: number | undefined) {
		switch (type) {
			case 0:
				return Gamepad2;
			case 1:
				return Monitor;
			case 2:
				return Headphones;
			case 3:
				return Tv;
			default:
				return Code;
		}
	}

	function getStatusColor(status: string | undefined): string {
		switch (status) {
			case 'online':
				return 'bg-green-500';
			case 'idle':
				return 'bg-yellow-500';
			case 'dnd':
				return 'bg-red-500';
			default:
				return 'bg-zinc-500';
		}
	}

	function getActivityImageUrl(activity: any): string | null {
		if (!activity?.assets?.large_image) {
			return null;
		}

		const assetUrl = activity.assets.large_image;

		// Handle spotify asset identifiers like `spotify:ab67616d0000b273...`
		// Convert them to the public CDN URL used by Spotify album art
		if (assetUrl?.startsWith('spotify:')) {
			const parts = assetUrl.split(':');
			if (parts.length >= 2 && parts[1]) {
				const imageUrl = `https://i.scdn.co/image/${parts[1]}`;
				return `/api/image?url=${encodeURIComponent(imageUrl)}`;
			}
		}

		// Handle mp:external format like:
		// mp:external/gSyzI_yG7kG8NH4jj5t-4JxVmOIHeM6bkwsNAx3oAxY/%3Fv%3D20/https/raw.githubusercontent.com/vyfor/icons/master/icons/default/dark/dashboard.png
		if (assetUrl?.startsWith('mp:external/')) {
			// Extract the URL part after the hash
			const urlMatch = assetUrl.match(/mp:external\/[^\/]+\/(.+)/);
			if (urlMatch) {
				const encodedPart = urlMatch[1];

				// Decode the URL-encoded part
				const decodedPart = decodeURIComponent(encodedPart);

				// The decoded part should be something like: ?v=20/https/raw.githubusercontent.com/...
				// We need to extract the actual HTTPS URL and add the query param
				const httpsMatch = decodedPart.match(/https\/(.+)/);
				if (httpsMatch) {
					let finalUrl = 'https://' + httpsMatch[1];
					// Add the v=20 parameter if it exists
					const queryMatch = decodedPart.match(/\?v=(\d+)/);
					if (queryMatch) {
						finalUrl += '?v=' + queryMatch[1];
					}
					return `/api/image?url=${encodeURIComponent(finalUrl)}`;
				}

				// Fallback: if no https match, try to construct URL from the decoded part
				if (decodedPart.includes('https://')) {
					const httpsIndex = decodedPart.indexOf('https://');
					const finalUrl = decodedPart.substring(httpsIndex);
					return `/api/image?url=${encodeURIComponent(finalUrl)}`;
				}
			}
			return null;
		}

		// Handle regular Discord CDN URLs or direct HTTPS URLs
		if (assetUrl?.startsWith('https://') || assetUrl?.startsWith('http://')) {
			return `/api/image?url=${encodeURIComponent(assetUrl)}`;
		}

		// For Discord app assets without a full URL
		if (activity.application_id) {
			const appId = activity.application_id;
			const imageUrl = `https://cdn.discordapp.com/app-assets/${appId}/${assetUrl}`;
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
					class="flex h-8 w-8 cursor-help items-center justify-center rounded-xl border-2 border-neutral-900 bg-neutral-800 shadow-lg transition-opacity"
					class:opacity-50={isLoading}
				>
					{#if isLoading}
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-300"></div>
					{:else}
						<svelte:component this={getActivityIcon(activityDisplay.activity?.type)} size={16} class="text-white" />
					{/if}
				</div>
				<!-- Custom Tooltip with Activity Display -->
				<div
					class="pointer-events-none absolute top-10 left-1/2 z-20 w-max max-w-sm -translate-x-1/2 transform opacity-0 transition-all duration-200 group-hover:top-9 group-hover:opacity-100"
				>
					<div
						class="rounded-lg border border-neutral-700/50 bg-neutral-800/90 px-4 py-3 shadow-xl backdrop-blur-sm"
					>
						{#if activityDisplay.activity && getActivityImageUrl(activityDisplay.activity)}
							<div class="flex gap-3">
								<!-- Large Asset Image -->
								<div class="relative shrink-0">
									<img
										src={getActivityImageUrl(activityDisplay.activity)}
										alt={activityDisplay.activity.name}
										class="h-20 w-20 rounded-lg object-cover"
									/>
									<!-- Small Asset Image Overlay -->
									{#if activityDisplay.activity.assets?.small_image}
										<img
											src={getActivityImageUrl({
												...activityDisplay.activity,
												assets: { large_image: activityDisplay.activity.assets.small_image }
											})}
											alt="Small asset"
											class="absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-2 border-neutral-800 bg-neutral-800 object-cover"
										/>
									{/if}
								</div>

								<!-- Activity Details -->
								<div class="flex-1 min-w-0 flex flex-col justify-center gap-1">
									<div class="flex items-center gap-1.5">
										<svelte:component this={getActivityIcon(activityDisplay.activity.type)} size={14} class="text-white shrink-0" />
										<p class="text-xs font-semibold text-neutral-300 truncate">
											{activityDisplay.activity.name}
										</p>
									</div>

									{#if activityDisplay.activity.details}
										<p class="text-xs text-neutral-400 truncate">
											{activityDisplay.activity.details}
										</p>
									{/if}

									{#if activityDisplay.text}
										<p class="text-xs text-neutral-400 truncate">
											{activityDisplay.text}
										</p>
									{/if}

									{#if activityDisplay.activity.timestamps?.start}
										<div class="flex items-center gap-1 mt-1 text-xs text-neutral-500">
											<span>
												{(() => {
													const start = new Date(activityDisplay.activity.timestamps.start);
													const now = new Date();
													const diffMs = now.getTime() - start.getTime();
													const diffMins = Math.floor(diffMs / 60000);
													const diffHrs = Math.floor(diffMins / 60);

													if (diffHrs > 0) return `${diffHrs}h ${diffMins % 60}m`;
													return `${diffMins}m`;
												})()}
												elapsed
											</span>
										</div>
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
