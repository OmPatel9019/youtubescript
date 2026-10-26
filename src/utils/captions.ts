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
}

const INNERTUBE_API_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const INNERTUBE_CLIENT_VERSION = '20.10.38';
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: INNERTUBE_CLIENT_VERSION,
  },
};
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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
    .replace(/<[^>]+>/g, '') // Strip any residual inline markup
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseTranscriptXml(xml: string): TranscriptSegment[] {
  const results: TranscriptSegment[] = [];

  // Try format 1: srv3 format (<p t="ms" d="ms">...</p>)
  const pRegex = /<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
  let match: RegExpExecArray | null;

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

  if (results.length > 0) {
    return results;
  }

  // Try format 2: classic format (<text start="s" dur="s">...</text>)
  const textRegex = /<text\s+start="([^"]*)"(?:\s+dur="([^"]*)")?[^>]*>([\s\S]*?)<\/text>/g;
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

  return results;
}

/**
 * Intelligent track selection algorithm:
 * NEVER blindly pick captionTracks[0] because YouTube sorts them alphabetically,
 * which almost always selects Arabic ('ar') on multilingual videos!
 */
export function selectBestCaptionTrack(
  renderer: any,
  requestedLang?: string
): { chosenTrack: any; originalLanguageCode: string } | null {
  const tracks: any[] = renderer?.captionTracks || [];
  if (tracks.length === 0) return null;

  // Determine original video language
  let originalLangCode = 'en';

  // Signal 1: ASR track (YouTube generates ASR strictly in the spoken language)
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
    // Signal 2: Declared source track
    const srcIdx = renderer.defaultTranslationSourceTrackIndices[0];
    if (tracks[srcIdx]?.languageCode) {
      originalLangCode = tracks[srcIdx].languageCode;
    }
  } else {
    // Signal 3: Default audio track caption
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

    // Exact match: prefer manual over ASR
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

    // Prefix match (e.g. 'en' matching 'en-US')
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
  // If there is an ASR track, check if there is also a manual track in that same language
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

  // Source track index from renderer
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

  // Default audio track index
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

  // English fallback (manual preferred)
  const enManual = tracks.find(
    (t: any) =>
      t.languageCode?.toLowerCase().startsWith('en') &&
      t.kind !== 'asr' &&
      !(t.vssId && t.vssId.startsWith('a.'))
  );
  if (enManual) return { chosenTrack: enManual, originalLanguageCode: enManual.languageCode };

  const enAny = tracks.find((t: any) => t.languageCode?.toLowerCase().startsWith('en'));
  if (enAny) return { chosenTrack: enAny, originalLanguageCode: enAny.languageCode };

  // Original language manual track fallback
  const origManual = tracks.find(
    (t: any) =>
      t.languageCode?.toLowerCase() === originalLangCode.toLowerCase() &&
      t.kind !== 'asr' &&
      !(t.vssId && t.vssId.startsWith('a.'))
  );
  if (origManual) return { chosenTrack: origManual, originalLanguageCode: origManual.languageCode };

  // Non-ASR fallback (prefer tracks that are not arbitrarily chosen Arabic unless original language is ar)
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

  // 1. Try YouTube InnerTube API (Android client)
  try {
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
      signal: AbortSignal.timeout(6000),
    });

    if (resp.ok) {
      const data = await resp.json();
      renderer = data?.captions?.playerCaptionsTracklistRenderer;
    }
  } catch (err: any) {
    console.warn(`[InnerTube] fetch error for ${videoId}:`, err?.message);
  }

  // 2. Fallback to Web Page Scraping
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
          for (let i = jsonStart; i < html.length; i++) {
            if (html[i] === '{') depth++;
            else if (html[i] === '}') {
              depth--;
              if (depth === 0) {
                const parsed = JSON.parse(html.slice(jsonStart, i + 1));
                renderer = parsed?.captions?.playerCaptionsTracklistRenderer;
                break;
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`[WebScrape] fallback error for ${videoId}:`, err?.message);
    }
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

  // Build clean available languages list for UI
  const seenLangs = new Set<string>();
  const availableLanguages: CaptionLanguage[] = [];

  for (const track of rawTracks) {
    const code = track.languageCode;
    if (!code) continue;

    const rawName = track.name?.runs?.[0]?.text || track.name?.simpleText || code;
    const isAsr = track.kind === 'asr' || (track.vssId && track.vssId.startsWith('a.'));
    const isOriginal = code === originalLanguageCode;

    // Distinguish auto-generated from manual tracks if both exist
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

  // Sort available languages: original language first, then English, then alphabetical
  availableLanguages.sort((a, b) => {
    if (a.isOriginal && !b.isOriginal) return -1;
    if (!a.isOriginal && b.isOriginal) return 1;
    if (a.code.startsWith('en') && !b.code.startsWith('en')) return -1;
    if (!a.code.startsWith('en') && b.code.startsWith('en')) return 1;
    return a.name.localeCompare(b.name);
  });

  // Fetch the XML timed text
  try {
    const xmlResp = await fetch(chosenTrack.baseUrl, {
      headers: {
        'User-Agent': INNERTUBE_USER_AGENT,
      },
      signal: AbortSignal.timeout(6000),
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
    };
  } catch (err: any) {
    console.warn(`[XMLTimedText] fetch error for ${videoId}:`, err?.message);
    return null;
  }
}
