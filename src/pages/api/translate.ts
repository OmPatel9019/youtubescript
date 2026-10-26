import type { APIRoute } from 'astro';
import type { TranscriptSegment } from '../../utils/youtube';

export const prerender = false;

// In-memory cache for translated transcripts (LRU style / quick map)
const translationCache = new Map<string, TranscriptSegment[]>();

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function toGoogleLang(code: string): string {
  const c = (code || '').toLowerCase().trim();
  if (c === 'zh' || c === 'zh-cn' || c === 'zh-hans') return 'zh-CN';
  if (c === 'zh-tw' || c === 'zh-hk' || c === 'zh-hant') return 'zh-TW';
  if (c === 'pt-br') return 'pt';
  if (c === 'he') return 'iw';
  return c.split('-')[0];
}

function toDuckLang(code: string): string {
  const c = (code || '').toLowerCase().trim();
  if (c === 'zh' || c === 'zh-cn' || c === 'zh-hans') return 'zh-Hans';
  if (c === 'zh-tw' || c === 'zh-hk' || c === 'zh-hant') return 'zh-Hant';
  if (c === 'pt-br') return 'pt';
  return c.split('-')[0];
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
        'User-Agent': BROWSER_USER_AGENT,
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

/**
 * Primary Engine: Google Translate (via Chrome extension client)
 * High-speed, supports POST to avoid URL size limits, and handles up to ~3500 chars per batch.
 */
async function translateWithGoogle(text: string, targetLang: string, sourceLang = 'auto'): Promise<string | null> {
  try {
    const glang = toGoogleLang(targetLang);
    const slang = sourceLang && sourceLang !== 'auto' ? toGoogleLang(sourceLang) : 'auto';
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=${encodeURIComponent(slang)}&tl=${encodeURIComponent(glang)}&dt=t`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': BROWSER_USER_AGENT
      },
      body: 'q=' + encodeURIComponent(text),
      signal: AbortSignal.timeout(8000)
    });

    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        return data[0].map((item: any) => item?.[0] || '').join('');
      }
    }
  } catch (err: any) {
    console.warn('[Translate] Google engine error:', err?.message);
  }
  return null;
}

/**
 * Secondary Engine: DuckDuckGo neural translation (under 750 chars per batch)
 */
async function translateWithDuck(text: string, targetLang: string): Promise<string | null> {
  const vqd = await getDuckDuckGoVqd();
  if (!vqd) return null;

  try {
    const dlang = toDuckLang(targetLang);
    const transUrl = `https://duckduckgo.com/translation.js?query=translate&to=${encodeURIComponent(dlang)}&vqd=${vqd}`;
    const res = await fetch(transUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': BROWSER_USER_AGENT
      },
      body: text,
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      const data: any = await res.json();
      if (data?.translated) {
        return data.translated;
      }
    }
  } catch (err: any) {
    console.warn('[Translate] DuckDuckGo engine error:', err?.message);
  }
  return null;
}

/**
 * Tertiary Engine: MyMemory fallback for isolated segments
 */
async function translateWithMyMemory(text: string, targetLang: string, sourceLang = 'en'): Promise<string | null> {
  try {
    const sl = (sourceLang || 'en').split('-')[0];
    const tl = (targetLang || 'es').split('-')[0];
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${encodeURIComponent(sl)}|${encodeURIComponent(tl)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
    if (res.ok) {
      const data: any = await res.json();
      if (data?.responseData?.translatedText && !data.responseData.translatedText.startsWith('MYMEMORY WARNING')) {
        return data.responseData.translatedText;
      }
    }
  } catch (err: any) {
    console.warn('[Translate] MyMemory fallback error:', err?.message);
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

    const normTarget = toGoogleLang(targetLang || 'en');
    const normSource = sourceLang ? toGoogleLang(sourceLang) : 'auto';

    // If target language is empty or matches source, return as-is
    if (!normTarget || (normSource !== 'auto' && normSource === normTarget)) {
      return new Response(JSON.stringify({
        success: true,
        targetLang: normTarget,
        segments
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check memory cache
    const cacheKey = `${normSource}_${normTarget}_${segments.length}_${(segments[0]?.text || '').slice(0, 30)}`;
    if (translationCache.has(cacheKey)) {
      return new Response(JSON.stringify({
        success: true,
        targetLang: normTarget,
        segments: translationCache.get(cacheKey)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const results = new Array<string>(segments.length);

    // 1. Group segments into batches of ~2500 chars for Google Translate
    const googleBatches: { index: number; line: string }[][] = [];
    let curBatch: { index: number; line: string }[] = [];
    let curLen = 0;

    for (let i = 0; i < segments.length; i++) {
      const cleanText = (segments[i]?.text || '').trim();
      if (!cleanText) {
        results[i] = '';
        continue;
      }
      const line = `§${i}§ ${cleanText}`;

      if (curLen + line.length > 2500 && curBatch.length > 0) {
        googleBatches.push(curBatch);
        curBatch = [];
        curLen = 0;
      }
      curBatch.push({ index: i, line });
      curLen += line.length;
    }
    if (curBatch.length > 0) googleBatches.push(curBatch);

    // Process Google batches with concurrency of 3
    const processGoogleBatch = async (batch: { index: number; line: string }[]) => {
      const payload = batch.map(b => b.line).join('\n');
      const translated = await translateWithGoogle(payload, normTarget, normSource);
      if (translated) {
        const tokens = translated.split(/§\s*(\d+)\s*§/);
        for (let k = 1; k < tokens.length; k += 2) {
          const segIdx = parseInt(tokens[k], 10);
          const transText = tokens[k + 1]?.trim();
          if (!isNaN(segIdx) && segIdx >= 0 && segIdx < segments.length && transText) {
            results[segIdx] = transText;
          }
        }
      }
    };

    for (let i = 0; i < googleBatches.length; i += 3) {
      await Promise.all(googleBatches.slice(i, i + 3).map(processGoogleBatch));
    }

    // 2. Identify missing segments and try DuckDuckGo (Tier 2) in small batches (<= 650 chars)
    const missingIndices: number[] = [];
    for (let i = 0; i < segments.length; i++) {
      if ((segments[i]?.text || '').trim() && !results[i]) {
        missingIndices.push(i);
      }
    }

    if (missingIndices.length > 0) {
      const duckBatches: { index: number; line: string }[][] = [];
      let dBatch: { index: number; line: string }[] = [];
      let dLen = 0;

      for (const idx of missingIndices) {
        const cleanText = (segments[idx]?.text || '').trim();
        const line = `§${idx}§ ${cleanText}`;
        if (dLen + line.length > 650 && dBatch.length > 0) {
          duckBatches.push(dBatch);
          dBatch = [];
          dLen = 0;
        }
        dBatch.push({ index: idx, line });
        dLen += line.length;
      }
      if (dBatch.length > 0) duckBatches.push(dBatch);

      const processDuckBatch = async (batch: { index: number; line: string }[]) => {
        const payload = batch.map(b => b.line).join('\n');
        const translated = await translateWithDuck(payload, normTarget);
        if (translated) {
          const tokens = translated.split(/§\s*(\d+)\s*§/);
          for (let k = 1; k < tokens.length; k += 2) {
            const segIdx = parseInt(tokens[k], 10);
            const transText = tokens[k + 1]?.trim();
            if (!isNaN(segIdx) && segIdx >= 0 && segIdx < segments.length && transText) {
              results[segIdx] = transText;
            }
          }
        }
      };

      for (let i = 0; i < duckBatches.length; i += 2) {
        await Promise.all(duckBatches.slice(i, i + 2).map(processDuckBatch));
      }
    }

    // 3. For any still missing segments, use MyMemory (Tier 3)
    const stillMissing: number[] = [];
    for (let i = 0; i < segments.length; i++) {
      if ((segments[i]?.text || '').trim() && !results[i]) {
        stillMissing.push(i);
      }
    }

    if (stillMissing.length > 0 && stillMissing.length <= 30) {
      await Promise.all(
        stillMissing.map(async (idx) => {
          const text = (segments[idx]?.text || '').trim();
          const tr = await translateWithMyMemory(text, normTarget, normSource);
          if (tr) {
            results[idx] = tr;
          }
        })
      );
    }

    // Verify how many were translated
    let translatedCount = 0;
    for (let i = 0; i < segments.length; i++) {
      if (results[i] && results[i].trim().length > 0) {
        translatedCount++;
      }
    }

    // Assemble final translated segments
    const translatedSegments: TranscriptSegment[] = segments.map((seg, idx) => ({
      ...seg,
      text: results[idx] && results[idx].trim().length > 0 ? results[idx] : seg.text
    }));

    if (translatedCount === 0 && segments.some(s => (s?.text || '').trim().length > 0)) {
      return new Response(JSON.stringify({
        error: 'Translation services are temporarily unreachable. Please try again in a few moments.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Cache the result
    if (translationCache.size > 50) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, translatedSegments);

    return new Response(JSON.stringify({
      success: true,
      targetLang: normTarget,
      translatedCount,
      totalSegments: segments.length,
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
