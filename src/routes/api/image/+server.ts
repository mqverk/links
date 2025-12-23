export async function GET({ url }: { url: URL }) {
	const imageUrl = url.searchParams.get('url');

	if (!imageUrl) {
		return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		// Decode the URL if it's encoded
		const decodedUrl = decodeURIComponent(imageUrl);

		// Verify it's a valid HTTP(S) URL
		if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
			return new Response(JSON.stringify({ error: 'Invalid URL' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const res = await fetch(decodedUrl);

		if (!res.ok) {
			return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
				status: res.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const contentType = res.headers.get('content-type') || 'image/png';
		const buffer = await res.arrayBuffer();

		return new Response(buffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error('Error proxying image:', error);
		return new Response(JSON.stringify({ error: 'Failed to proxy image' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
