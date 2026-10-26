import { fetchYouTubeTranscript } from './src/utils/captions.js';

// Test with Rick Astley (music) or Steve Jobs or a popular video
const videoId = 'dQw4w9WgXcQ';
console.log('Testing video:', videoId);
try {
  const result = await fetchYouTubeTranscript(videoId);
  console.log('Current language:', result?.currentLanguage);
  console.log('Original language:', result?.originalLanguage);
  console.log('Available languages count:', result?.availableLanguages?.length);
  console.log('First 5 languages:', result?.availableLanguages?.slice(0, 5));
  console.log('First segment:', result?.segments?.[0]);
} catch (e) {
  console.error('Error:', e);
}
