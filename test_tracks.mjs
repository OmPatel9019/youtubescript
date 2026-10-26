import { readFileSync } from 'fs';
// We can test captions.ts by importing or transpiling or checking the fetch directly
const INNERTUBE_API_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const INNERTUBE_CLIENT_VERSION = '20.10.38';
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: INNERTUBE_CLIENT_VERSION,
  },
};
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;

async function testFetch(videoId) {
  const resp = await fetch(INNERTUBE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': INNERTUBE_USER_AGENT,
    },
    body: JSON.stringify({
      context: INNERTUBE_CONTEXT,
      videoId,
    }),
  });
  const data = await resp.json();
  const renderer = data?.captions?.playerCaptionsTracklistRenderer;
  console.log('Renderer exists:', !!renderer);
  if (!renderer) return;

  const tracks = renderer.captionTracks;
  console.log('All tracks in renderer:');
  tracks.forEach((t, i) => {
    console.log(`[${i}] code: ${t.languageCode}, name: ${t.name?.runs?.[0]?.text || t.name?.simpleText}, kind: ${t.kind}, vssId: ${t.vssId}`);
  });

  // Now let's test fetching baseUrl of each track:
  for (let i = 0; i < Math.min(3, tracks.length); i++) {
    const t = tracks[i];
    console.log(`Fetching track [${i}] ${t.languageCode}...`);
    try {
      const xmlResp = await fetch(t.baseUrl, {
        headers: { 'User-Agent': INNERTUBE_USER_AGENT }
      });
      console.log(`Track [${i}] HTTP status:`, xmlResp.status);
      const text = await xmlResp.text();
      console.log(`Track [${i}] snippet:`, text.slice(0, 150));
    } catch (e) {
      console.log(`Track [${i}] fetch error:`, e.message);
    }
  }
}

await testFetch('UF8uR6Z6KLc');
