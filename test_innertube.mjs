const INNERTUBE_API_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const INNERTUBE_CLIENT_VERSION = '20.10.38';
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: INNERTUBE_CLIENT_VERSION,
  },
};
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;

async function test(videoId) {
  console.log('--- Testing video:', videoId);
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
  if (!renderer) {
    console.log('No renderer found in InnerTube');
    return;
  }
  console.log('defaultTranslationSourceTrackIndices:', renderer.defaultTranslationSourceTrackIndices);
  console.log('defaultAudioTrackIndex:', renderer.defaultAudioTrackIndex);
  console.log('audioTracks:', JSON.stringify(renderer.audioTracks));
  console.log('Number of captionTracks:', renderer.captionTracks?.length);
  console.log('captionTracks first 5:');
  for (let i = 0; i < Math.min(5, renderer.captionTracks.length); i++) {
    const t = renderer.captionTracks[i];
    console.log(`[${i}] code: ${t.languageCode}, kind: ${t.kind}, vssId: ${t.vssId}, name: ${JSON.stringify(t.name)}`);
  }
  const asr = renderer.captionTracks.find(t => t.kind === 'asr' || (t.vssId && t.vssId.startsWith('a.')));
  console.log('asrTrack found:', asr ? `${asr.languageCode} (${asr.vssId})` : 'NONE');
}

// Test with dQw4w9WgXcQ (Rick Astley) and UF8uR6Z6KLc (Steve Jobs) and 3qHkcs3kG6U (Lex Fridman)
await test('dQw4w9WgXcQ');
await test('UF8uR6Z6KLc');
