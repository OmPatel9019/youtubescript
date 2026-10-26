import type { APIRoute } from 'astro';
import type { TranscriptSegment } from '../../utils/youtube';

export const prerender = false;

// In-memory cache for translated transcripts (LRU style / quick map)
const translationCache = new Map<string, TranscriptSegment[]>();

// Normalize language codes for translation engines
function normalizeLangCode(code: string): string {
  const c = (code || '').toLowerCase().trim();
  if (c === 'zh' || c === 'zh-cn' || c === 'zh-hans') return 'zh-Hans';
  if (c === 'zh-tw' || c === 'zh-hk' || c === 'zh-hant') return 'zh-Hant';
  return c;
}

// Fetch a fresh DuckDuckGo translation VQD token
let cachedVqd: { token: string; timestamp: number } | null = null;

async function getDuckDuckGoVqd(): Promise<string | null> {
  if (cachedVqd && Date.now() - cachedVqd.timestamp < 10 * 60 * 1000) {
    return cachedVqd.token;
  }

  try {
    const res = await fetch('https://duckduckgo.com/?q=translate&ia=translate', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const html = await res.text();
      const m = html.match(/vqd=([0-9-]+)/);
      if (m && m[1]) {
        cachedVqd = { token: m[1], timestamp: Date.now() };
        return m[1];
      }
    }
  } catch (err: any) {
    console.warn('[Translate] Could not get DDG VQD:', err?.message);
  }

  return null;
}

// Fallback translation using Disroot LibreTranslate
async function translateWithLibre(text: string, targetLang: string): Promise<string | null> {
  try {
    const res = await fetch('https://translate.disroot.org/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLang.split('-')[0], // Disroot prefers 'zh', 'es', etc.
        format: 'text'
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.translatedText) {
        return data.translatedText;
      }
    }
  } catch (err: any) {
    console.warn('[Translate] Libre fallback error:', err?.message);
  }

  return null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { segments, targetLang, sourceLang } = body;

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return new Response(JSON.stringify({ error: 'Segments array is required for translation' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedTarget = normalizeLangCode(targetLang || 'en');

    // If target language is empty or already matches source, return as-is
    if (!normalizedTarget || (sourceLang && normalizeLangCode(sourceLang) === normalizedTarget)) {
      return new Response(JSON.stringify({
        success: true,
        targetLang: normalizedTarget,
        segments
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check memory cache
    const cacheKey = `${segments[0]?.text?.slice(0, 30)}_${segments.length}_${normalizedTarget}`;
    if (translationCache.has(cacheKey)) {
      return new Response(JSON.stringify({
        success: true,
        targetLang: normalizedTarget,
        segments: translationCache.get(cacheKey)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Group segments into batches with unique indexed markers §{idx}§
    const results = new Array<string>(segments.length);
    const batches: { index: number; line: string }[][] = [];
    let curBatch: { index: number; line: string }[] = [];
    let curLen = 0;

    for (let i = 0; i < segments.length; i++) {
      const cleanText = (segments[i]?.text || '').trim();
      const line = `§${i}§ ${cleanText}`;

      // DuckDuckGo allows up to ~950 chars; 650 chars provides comfortable headroom
      if (curLen + line.length > 650 && curBatch.length > 0) {
        batches.push(curBatch);
        curBatch = [];
        curLen = 0;
      }
      curBatch.push({ index: i, line });
      curLen += line.length;
    }
    if (curBatch.length > 0) batches.push(curBatch);

    // Get VQD token
    const vqd = await getDuckDuckGoVqd();

    // Process batches with controlled concurrency (up to 3 in parallel)
    const processBatch = async (batch: { index: number; line: string }[]) => {
      const payload = batch.map(b => b.line).join('\n');
      let batchSuccess = false;

      // Method A: DuckDuckGo neural translation (100% free, Bing-powered)
      if (vqd) {
        try {
          const transUrl = `https://duckduckgo.com/translation.js?query=translate&to=${encodeURIComponent(normalizedTarget)}&vqd=${vqd}`;
          const res = await fetch(transUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: payload,
            signal: AbortSignal.timeout(7000)
          });

          if (res.ok) {
            const data = await res.json();
            const translatedStr = data?.translated || '';
            const tokens = translatedStr.split(/§(\d+)§/);

            for (let k = 1; k < tokens.length; k += 2) {
              const segIdx = parseInt(tokens[k], 10);
              const transText = tokens[k + 1]?.trim();
              if (!isNaN(segIdx) && segIdx >= 0 && segIdx < segments.length && transText) {
                results[segIdx] = transText;
              }
            }
            batchSuccess = true;
          }
        } catch (err: any) {
          console.warn('[Translate] DDG batch error:', err?.message);
        }
      }

      // Method B: Disroot LibreTranslate fallback if DDG failed for this batch
      if (!batchSuccess) {
        try {
          const libreTranslated = await translateWithLibre(payload, normalizedTarget);
          if (libreTranslated) {
            const tokens = libreTranslated.split(/§(\d+)§/);
            for (let k = 1; k < tokens.length; k += 2) {
              const segIdx = parseInt(tokens[k], 10);
              const transText = tokens[k + 1]?.trim();
              if (!isNaN(segIdx) && segIdx >= 0 && segIdx < segments.length && transText) {
                results[segIdx] = transText;
              }
            }
          }
        } catch (err: any) {
          console.warn('[Translate] Libre batch fallback error:', err?.message);
        }
      }
    };

    // Execute batches in chunks of 3
    for (let i = 0; i < batches.length; i += 3) {
      await Promise.all(batches.slice(i, i + 3).map(processBatch));
    }

    // Assemble final translated segments; keep original text if individual segment missed
    const translatedSegments: TranscriptSegment[] = segments.map((seg, idx) => ({
      ...seg,
      text: results[idx] || seg.text
    }));

    // Cache the result
    if (translationCache.size > 50) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, translatedSegments);

    return new Response(JSON.stringify({
      success: true,
      targetLang: normalizedTarget,
      segments: translatedSegments
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[Translate API Error]:', error);
    return new Response(JSON.stringify({
      error: error?.message || 'Translation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
