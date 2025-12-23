export async function GET() {
	const DISCORD_USER_ID = '1451934649239736371';

	try {
		const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
		const data = await res.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to fetch Discord data:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch Discord data' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
