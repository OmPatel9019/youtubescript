import type { TranscriptSegment } from './youtube';

export interface CaptionLanguage {
  code: string;
  name: string;
  isAsr?: boolean;
  isOriginal?: boolean;
}

export interface ExtractedTranscript {
  segments: TranscriptSegment[];
  availableLanguages: CaptionLanguage[];
  currentLanguage: CaptionLanguage;
  originalLanguage: string;
  videoDetails?: {
    title?: string;
    author?: string;
    lengthSeconds?: number;
  };
}

const INNERTUBE_API_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';

// iOS Client - Bypasses bot wall / LOGIN_REQUIRED from datacenter & edge networks
const IOS_CLIENT_VERSION = '21.26.4';
const IOS_CONTEXT = {
  client: {
    clientName: 'IOS',
    clientVersion: IOS_CLIENT_VERSION,
    deviceMake: 'Apple',
    deviceModel: 'iPhone16,2',
    osName: 'iOS',
    osVersion: '18.3.2.22D82',
    gl: 'US',
    hl: 'en',
  },
};
const IOS_USER_AGENT = `com.google.ios.youtube/${IOS_CLIENT_VERSION} (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X; en_US)`;
const IOS_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': IOS_USER_AGENT,
  'X-YouTube-Client-Name': '5',
  'X-YouTube-Client-Version': IOS_CLIENT_VERSION,
};

// Android Client - Secondary fallback & fast metadata fetch
const ANDROID_CLIENT_VERSION = '20.10.38';
const ANDROID_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: ANDROID_CLIENT_VERSION,
    gl: 'US',
    hl: 'en',
  },
};
const ANDROID_USER_AGENT = `com.google.android.youtube/${ANDROID_CLIENT_VERSION} (Linux; U; Android 14)`;
const ANDROID_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': ANDROID_USER_AGENT,
  'X-YouTube-Client-Name': '3',
  'X-YouTube-Client-Version': ANDROID_CLIENT_VERSION,
};

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

export function decodeEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return '';
      }
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return '';
      }
    })
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseTranscriptXml(xml: string): TranscriptSegment[] {
  if (!xml) return [];
  const results: TranscriptSegment[] = [];

  // Try JSON3 format if YouTube returned JSON payload
  const trimmed = xml.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const data = JSON.parse(trimmed);
      const events = data?.events;
      if (Array.isArray(events)) {
        for (const ev of events) {
          if (!ev.segs || !Array.isArray(ev.segs)) continue;
          const text = ev.segs.map((s: any) => s.utf8 || '').join('').trim();
          const cleanedText = decodeEntities(text);
          if (cleanedText) {
            const startMs = typeof ev.tStartMs === 'number' ? ev.tStartMs : 0;
            const durMs = typeof ev.dDurationMs === 'number' ? ev.dDurationMs : 2500;
            results.push({
              start: Math.round(startMs / 100) / 10,
              duration: Math.max(0.1, Math.round(durMs / 100) / 10),
              text: cleanedText
            });
          }
        }
        if (results.length > 0) return results;
      }
    } catch {}
  }

  // Try format 1: classic format (<text start="s" dur="s">...</text>)
  const textRegex = /<text\s+start="([^"]*)"(?:\s+dur="([^"]*)")?[^>]*>([\s\S]*?)<\/text>/g;
  let match: RegExpExecArray | null;
  while ((match = textRegex.exec(xml)) !== null) {
    const startSec = parseFloat(match[1]) || 0;
    const durSec = match[2] ? parseFloat(match[2]) : 2.5;
    const cleanedText = decodeEntities(match[3]);

    if (cleanedText) {
      results.push({
        start: Math.round(startSec * 10) / 10,
        duration: Math.max(0.1, Math.round(durSec * 10) / 10),
        text: cleanedText
      });
    }
  }

  if (results.length > 0) {
    return results;
  }

  // Try format 2: srv3 format (<p t="ms" d="ms">...</p>)
  const pRegex = /<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
  while ((match = pRegex.exec(xml)) !== null) {
    const startMs = parseInt(match[1], 10);
    const durMs = match[2] ? parseInt(match[2], 10) : 2500;
    const inner = match[3];

    let text = '';
    const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let sMatch: RegExpExecArray | null;
    while ((sMatch = sRegex.exec(inner)) !== null) {
      text += sMatch[1];
    }

    if (!text) {
      text = inner.replace(/<[^>]+>/g, '');
    }

    const cleanedText = decodeEntities(text);
    if (cleanedText) {
      results.push({
        start: Math.round(startMs / 100) / 10,
        duration: Math.max(0.1, Math.round(durMs / 100) / 10),
        text: cleanedText
      });
    }
  }

  return results;
}

/**
 * Fast metadata and duration extractor via InnerTube
 */
export async function fetchVideoDetails(videoId: string): Promise<{
  title?: string;
  author?: string;
  lengthSeconds?: number;
  shortDescription?: string;
} | null> {
  try {
    const resp = await fetch(INNERTUBE_API_URL, {
      method: 'POST',
      headers: ANDROID_HEADERS,
      body: JSON.stringify({
        context: ANDROID_CONTEXT,
        videoId,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (resp.ok) {
      const data: any = await resp.json();
      if (data?.videoDetails) {
        return {
          title: data.videoDetails.title,
          author: data.videoDetails.author,
          lengthSeconds: parseInt(data.videoDetails.lengthSeconds, 10) || undefined,
          shortDescription: data.videoDetails.shortDescription,
        };
      }
    }
  } catch {}
  return null;
}

/**
 * Intelligent track selection algorithm:
 * Picks the user's requested language if available, or the video's original/native language track.
 */
export function selectBestCaptionTrack(
  renderer: any,
  requestedLang?: string
): { chosenTrack: any; originalLanguageCode: string } | null {
  const tracks: any[] = renderer?.captionTracks || [];
  if (tracks.length === 0) return null;

  let originalLangCode = 'en';

  const asrTrack = tracks.find(
    (t: any) =>
      t.kind === 'asr' ||
      (t.vssId && t.vssId.startsWith('a.')) ||
      (t.name?.simpleText && t.name.simpleText.toLowerCase().includes('auto')) ||
      (t.name?.runs?.[0]?.text && t.name.runs[0].text.toLowerCase().includes('auto'))
  );
  if (asrTrack?.languageCode) {
    originalLangCode = asrTrack.languageCode;
  } else if (
    Array.isArray(renderer.defaultTranslationSourceTrackIndices) &&
    renderer.defaultTranslationSourceTrackIndices.length > 0
  ) {
    const srcIdx = renderer.defaultTranslationSourceTrackIndices[0];
    if (tracks[srcIdx]?.languageCode) {
      originalLangCode = tracks[srcIdx].languageCode;
    }
  } else {
    const defAudioIdx = renderer.defaultAudioTrackIndex ?? 0;
    const audioTrack = renderer.audioTracks?.[defAudioIdx];
    if (
      audioTrack?.hasDefaultTrack &&
      typeof audioTrack.defaultCaptionTrackIndex === 'number'
    ) {
      const defCap = tracks[audioTrack.defaultCaptionTrackIndex];
      if (defCap?.languageCode) {
        originalLangCode = defCap.languageCode;
      }
    }
  }

  // 1. If user requested a specific language
  if (requestedLang && requestedLang !== 'auto') {
    const req = requestedLang.toLowerCase().trim();

    const exactManual = tracks.find(
      (t: any) =>
        t.languageCode?.toLowerCase() === req &&
        t.kind !== 'asr' &&
        !(t.vssId && t.vssId.startsWith('a.'))
    );
    if (exactManual) return { chosenTrack: exactManual, originalLanguageCode: originalLangCode };

    const exactAny = tracks.find(
      (t: any) => t.languageCode?.toLowerCase() === req
    );
    if (exactAny) return { chosenTrack: exactAny, originalLanguageCode: originalLangCode };

    const prefixManual = tracks.find(
      (t: any) =>
        t.languageCode?.toLowerCase().startsWith(req) &&
        t.kind !== 'asr' &&
        !(t.vssId && t.vssId.startsWith('a.'))
    );
    if (prefixManual) return { chosenTrack: prefixManual, originalLanguageCode: originalLangCode };

    const prefixAny = tracks.find((t: any) =>
      t.languageCode?.toLowerCase().startsWith(req)
    );
    if (prefixAny) return { chosenTrack: prefixAny, originalLanguageCode: originalLangCode };
  }

  // 2. Auto-detect: Pick the original video language track
  if (asrTrack) {
    const spokenLang = asrTrack.languageCode;
    const manualSpoken = tracks.find(
      (t: any) =>
        t.languageCode === spokenLang &&
        t.kind !== 'asr' &&
        !(t.vssId && t.vssId.startsWith('a.'))
    );
    if (manualSpoken) return { chosenTrack: manualSpoken, originalLanguageCode: spokenLang };
    return { chosenTrack: asrTrack, originalLanguageCode: spokenLang };
  }

  if (
    Array.isArray(renderer.defaultTranslationSourceTrackIndices) &&
    renderer.defaultTranslationSourceTrackIndices.length > 0
  ) {
    const srcIndex = renderer.defaultTranslationSourceTrackIndices[0];
    if (tracks[srcIndex]) {
      return {
        chosenTrack: tracks[srcIndex],
        originalLanguageCode: tracks[srcIndex].languageCode || originalLangCode
      };
    }
  }

  const defAudioIdx = renderer.defaultAudioTrackIndex ?? 0;
  const audioTrack = renderer.audioTracks?.[defAudioIdx];
  if (
    audioTrack?.hasDefaultTrack &&
    typeof audioTrack.defaultCaptionTrackIndex === 'number'
  ) {
    const defCap = tracks[audioTrack.defaultCaptionTrackIndex];
    if (defCap) {
      return {
        chosenTrack: defCap,
        originalLanguageCode: defCap.languageCode || originalLangCode
      };
    }
  }

  const enManual = tracks.find(
    (t: any) =>
      t.languageCode?.toLowerCase().startsWith('en') &&
      t.kind !== 'asr' &&
      !(t.vssId && t.vssId.startsWith('a.'))
  );
  if (enManual) return { chosenTrack: enManual, originalLanguageCode: enManual.languageCode };

  const enAny = tracks.find((t: any) => t.languageCode?.toLowerCase().startsWith('en'));
  if (enAny) return { chosenTrack: enAny, originalLanguageCode: enAny.languageCode };

  const origManual = tracks.find(
    (t: any) =>
      t.languageCode?.toLowerCase() === originalLangCode.toLowerCase() &&
      t.kind !== 'asr' &&
      !(t.vssId && t.vssId.startsWith('a.'))
  );
  if (origManual) return { chosenTrack: origManual, originalLanguageCode: origManual.languageCode };

  const nonArabicManual = tracks.find(
    (t: any) =>
      t.kind !== 'asr' &&
      !(t.vssId && t.vssId.startsWith('a.')) &&
      t.languageCode?.toLowerCase() !== 'ar'
  );
  if (nonArabicManual) return { chosenTrack: nonArabicManual, originalLanguageCode: nonArabicManual.languageCode };

  const firstManual = tracks.find(
    (t: any) => t.kind !== 'asr' && !(t.vssId && t.vssId.startsWith('a.'))
  );
  if (firstManual) return { chosenTrack: firstManual, originalLanguageCode: firstManual.languageCode };

  return { chosenTrack: tracks[0], originalLanguageCode: tracks[0].languageCode || originalLangCode };
}

export async function fetchYouTubeTranscript(
  videoId: string,
  requestedLang?: string
): Promise<ExtractedTranscript | null> {
  let renderer: any = null;
  let videoDetails: any = null;

  // Multi-client strategy: Try iOS first (bypasses cloud IP bot detection), then Android
  const clients = [
    { name: 'IOS', context: IOS_CONTEXT, headers: IOS_HEADERS },
    { name: 'ANDROID', context: ANDROID_CONTEXT, headers: ANDROID_HEADERS },
  ];

  for (const clientCfg of clients) {
    try {
      const resp = await fetch(INNERTUBE_API_URL, {
        method: 'POST',
        headers: clientCfg.headers,
        body: JSON.stringify({
          context: clientCfg.context,
          videoId,
        }),
        signal: AbortSignal.timeout(7000),
      });

      if (resp.ok) {
        const data: any = await resp.json();
        const candidateRenderer = data?.captions?.playerCaptionsTracklistRenderer;
        if (candidateRenderer && Array.isArray(candidateRenderer.captionTracks) && candidateRenderer.captionTracks.length > 0) {
          renderer = candidateRenderer;
          videoDetails = {
            title: data?.videoDetails?.title,
            author: data?.videoDetails?.author,
            lengthSeconds: parseInt(data?.videoDetails?.lengthSeconds, 10) || undefined,
          };
          break;
        }
      }
    } catch {}
  }

  // Fallback to Web Page Scraping if InnerTube failed
  if (!renderer || !Array.isArray(renderer.captionTracks) || renderer.captionTracks.length === 0) {
    try {
      const pageResp = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': BROWSER_USER_AGENT,
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (pageResp.ok) {
        const html = await pageResp.text();
        const token = 'var ytInitialPlayerResponse = ';
        const idx = html.indexOf(token);
        if (idx !== -1) {
          const jsonStart = idx + token.length;
          let depth = 0;
          let inString = false;
          let escape = false;
          let end = -1;
          for (let i = jsonStart; i < html.length; i++) {
            const char = html[i];
            if (escape) { escape = false; continue; }
            if (char === '\\') { escape = true; continue; }
            if (char === '"') { inString = !inString; continue; }
            if (!inString) {
              if (char === '{') depth++;
              else if (char === '}') {
                depth--;
                if (depth === 0) { end = i; break; }
              }
            }
          }
          if (end !== -1) {
            const parsed = JSON.parse(html.slice(jsonStart, end + 1));
            const candidateRenderer = parsed?.captions?.playerCaptionsTracklistRenderer;
            if (candidateRenderer && Array.isArray(candidateRenderer.captionTracks) && candidateRenderer.captionTracks.length > 0) {
              renderer = candidateRenderer;
              videoDetails = {
                title: parsed?.videoDetails?.title,
                author: parsed?.videoDetails?.author,
                lengthSeconds: parseInt(parsed?.videoDetails?.lengthSeconds, 10) || undefined,
              };
            }
          }
        }
      }
    } catch {}
  }

  if (!renderer || !Array.isArray(renderer.captionTracks) || renderer.captionTracks.length === 0) {
    return null;
  }

  const rawTracks: any[] = renderer.captionTracks;
  const selection = selectBestCaptionTrack(renderer, requestedLang);
  if (!selection || !selection.chosenTrack || !selection.chosenTrack.baseUrl) {
    return null;
  }

  const { chosenTrack, originalLanguageCode } = selection;

  const seenLangs = new Set<string>();
  const availableLanguages: CaptionLanguage[] = [];

  for (const track of rawTracks) {
    const code = track.languageCode;
    if (!code) continue;

    const rawName = track.name?.runs?.[0]?.text || track.name?.simpleText || code;
    const isAsr = track.kind === 'asr' || (track.vssId && track.vssId.startsWith('a.'));
    const isOriginal = code === originalLanguageCode;

    const key = `${code}-${isAsr ? 'asr' : 'manual'}`;
    if (!seenLangs.has(key)) {
      seenLangs.add(key);
      let displayName = rawName;
      if (isAsr && !displayName.toLowerCase().includes('auto')) {
        displayName += ' (auto)';
      }
      if (isOriginal && !displayName.toLowerCase().includes('original')) {
        displayName += ' (Original)';
      }

      availableLanguages.push({
        code,
        name: displayName,
        isAsr,
        isOriginal,
      });
    }
  }

  availableLanguages.sort((a, b) => {
    if (a.isOriginal && !b.isOriginal) return -1;
    if (!a.isOriginal && b.isOriginal) return 1;
    if (a.code.startsWith('en') && !b.code.startsWith('en')) return -1;
    if (!a.code.startsWith('en') && b.code.startsWith('en')) return 1;
    return a.name.localeCompare(b.name);
  });

  try {
    const xmlResp = await fetch(chosenTrack.baseUrl, {
      headers: {
        'User-Agent': IOS_USER_AGENT,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!xmlResp.ok) {
      return null;
    }

    const xml = await xmlResp.text();
    const segments = parseTranscriptXml(xml);

    if (!segments || segments.length === 0) {
      return null;
    }

    const currentLangName =
      chosenTrack.name?.runs?.[0]?.text ||
      chosenTrack.name?.simpleText ||
      chosenTrack.languageCode;

    return {
      segments,
      availableLanguages,
      currentLanguage: {
        code: chosenTrack.languageCode,
        name: currentLangName,
        isAsr: chosenTrack.kind === 'asr' || (chosenTrack.vssId && chosenTrack.vssId.startsWith('a.')),
        isOriginal: chosenTrack.languageCode === originalLanguageCode,
      },
      originalLanguage: originalLanguageCode,
      videoDetails,
    };
  } catch {
    return null;
  }
}
