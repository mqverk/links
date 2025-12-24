// Discord User ID from the data file
const DISCORD_USER_ID = '1451934649239736371';
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
const LOCAL_API_URL = `/api/discord`;

export interface ActivityAsset {
	large_image?: string;
	large_text?: string;
	small_image?: string;
	small_text?: string;
}

export interface Activity {
	type: number;
	name: string;
	state?: string;
	details?: string;
	assets?: ActivityAsset;
	application_id?: string;
	timestamps?: {
		start?: number;
		end?: number;
	};
}

export interface DiscordStatus {
	status: string;
	activities: Activity[];
}

export interface ActivityDisplay {
	text: string;
	activity?: Activity;
	discordStatus?: string;
}

export async function fetchDiscordStatus(): Promise<ActivityDisplay> {
	try {
		const response = await fetch(LOCAL_API_URL);

		if (!response.ok) {
			throw new Error(`Failed to fetch status: ${response.statusText}`);
		}

		const data = await response.json();

		// Get the main activity or status
		const discordStatus = data.data.discord_status;
		const activities = data.data.activities;

		// Look for a custom activity or status
		if (activities && activities.length > 0) {
			for (const activity of activities) {
				// Prefer custom status or presence activity
				if (activity.type === 4) {
					// Custom status
					return {
						text: activity.state || capitalizeStatus(discordStatus),
						activity: null,
						discordStatus
					};
				}
				// If there's any other activity, return full activity data
				if (activity.type !== 4) {
					const text = activity.state || activity.details || activity.name;
					return {
						text,
						activity,
						discordStatus
					};
				}
			}
		}

		// Fallback to Discord status
		return {
			text: capitalizeStatus(discordStatus),
			activity: null,
			discordStatus
		};
	} catch (error) {
		console.error('Error fetching Discord status:', error);
		return {
			text: 'Away',
			activity: null
		};
	}
}

function capitalizeStatus(status: string): string {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

// Subscribe to real-time updates using WebSocket
export function subscribeToDiscordStatus(
	callback: (data: ActivityDisplay) => void
): () => void {
	const WS_URL = `wss://api.lanyard.rest/socket`;

	let ws: WebSocket;
	let heartbeatInterval: number;

	function connect() {
		ws = new WebSocket(WS_URL);

		ws.addEventListener('open', () => {
			// Subscribe to user's presence
			ws.send(
				JSON.stringify({
					op: 2,
					d: {
						subscribe_to_ids: [DISCORD_USER_ID]
					}
				})
			);
		});

		ws.addEventListener('message', async (event) => {
			const message = JSON.parse(event.data);

			if (message.op === 1) {
				// Heartbeat interval
				const heartbeatInterval = message.d.heartbeat_interval;
				clearInterval(heartbeat);
				heartbeat = setInterval(() => {
					if (ws && ws.readyState === WebSocket.OPEN) {
						ws.send(JSON.stringify({ op: 3 }));
					}
				}, heartbeatInterval);
			}

			if (message.op === 0 && message.d) {
				// Presence update
				const discordStatus = message.d.discord_status;
				const activities = message.d.activities;

				let statusText = capitalizeStatus(discordStatus);
				let mainActivity: Activity | null = null;

				// Look for custom status or activity
				if (activities && activities.length > 0) {
					for (const activity of activities) {
						if (activity.type === 4) {
							// Custom status
							statusText = activity.state || statusText;
							break;
						}
						if (activity.type !== 4) {
							// Any other activity - grab it with all its data
							statusText = activity.state || activity.details || activity.name;
							mainActivity = activity;
							break;
						}
					}
				}

				callback({
					text: statusText,
					activity: mainActivity,
					discordStatus
				});
			}
		});

		ws.addEventListener('close', () => {
			clearInterval(heartbeatInterval);
			// Attempt to reconnect after 3 seconds
			setTimeout(connect, 3000);
		});

		ws.addEventListener('error', (error) => {
			console.error('WebSocket error:', error);
		});
	}

	let heartbeat: number;
	connect();

	// Return cleanup function
	return () => {
		clearInterval(heartbeatInterval);
		if (ws) {
			ws.close();
		}
	};
}
