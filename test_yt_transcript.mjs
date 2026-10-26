const INNERTUBE_API_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const INNERTUBE_CLIENT_VERSION = '20.10.38';
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: INNERTUBE_CLIENT_VERSION,
  },
};
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;

import { YoutubeTranscript } from 'youtube-transcript';

async function testSelect(videoId) {
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
  
  // Let's test the current selectBestCaptionTrack logic on renderer:
  const tracks = renderer.captionTracks;
  console.log('Tracks count:', tracks.length);
  
  // Let's test YoutubeTranscript library:
  try {
    const yt1 = await YoutubeTranscript.fetchTranscript(videoId);
    console.log('YoutubeTranscript.fetchTranscript(videoId) without lang returned count:', yt1.length);
    console.log('First segment text:', yt1[0].text);
  } catch (e) {
    console.log('YoutubeTranscript without lang error:', e.message);
  }

  try {
    const yt2 = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    console.log('YoutubeTranscript.fetchTranscript with { lang: "en" } count:', yt2.length);
    console.log('First segment text:', yt2[0].text);
  } catch (e) {
    console.log('YoutubeTranscript with { lang: "en" } error:', e.message);
  }
}

await testSelect('UF8uR6Z6KLc');
