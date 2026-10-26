export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

export * from './captions';

export interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  authorUrl?: string;
  thumbnailUrl: string;
  url: string;
}

export function extractVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    
    // youtu.be/ID
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split(/[?#]/)[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    // youtube.com/watch?v=ID
    if (parsed.searchParams.has('v')) {
      const v = parsed.searchParams.get('v');
      return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
    }

    // youtube.com/shorts/ID or /embed/ID or /v/ID
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2 && ['shorts', 'embed', 'v', 'live'].includes(pathParts[0])) {
      const id = pathParts[1];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
  } catch {
    // Regex fallback
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return null;
}

export function formatTime(seconds: number): string {
  const totalSec = Math.floor(seconds);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatSrtTime(seconds: number): string {
  const totalMs = Math.floor(seconds * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

export function formatVttTime(seconds: number): string {
  return formatSrtTime(seconds).replace(',', '.');
}

export interface TranscriptParagraph {
  start: number;
  duration: number;
  text: string;
}

/**
 * Intelligent paragraph reconstruction engine:
 * Reassembles fragmented 2-4 second subtitle cues into coherent, natural paragraphs.
 * - Eliminates stray line breaks (\r, \n) and collapses whitespace.
 * - Respects natural sentence terminals (. ? !) and speech pauses (gap >= 1.8s).
 * - Avoids mid-sentence line breaks, creating a smooth, book-like reading experience.
 */
export function formatParagraphs(segments: TranscriptSegment[]): TranscriptParagraph[] {
  if (!segments || segments.length === 0) return [];

  const paragraphs: TranscriptParagraph[] = [];
  let currentWords: string[] = [];
  let currentStart = segments[0].start;
  let currentEnd = segments[0].start + (segments[0].duration || 2);
  let isNewParagraph = true;

  const TARGET_WORD_COUNT = 80;
  const MIN_WORD_COUNT = 45;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const cleanText = (seg.text || '')
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) continue;

    if (isNewParagraph) {
      currentStart = seg.start;
      isNewParagraph = false;
    }
    currentEnd = seg.start + (seg.duration || 2);

    const words = cleanText.split(' ').filter(Boolean);
    currentWords.push(...words);

    const isLast = i === segments.length - 1;
    const endsWithTerminal = /[.?!]["')\]]?$/.test(cleanText);

    let isSpeechPause = false;
    if (!isLast && segments[i + 1]) {
      const nextStart = segments[i + 1].start;
      const pauseDuration = nextStart - currentEnd;
      if (pauseDuration >= 1.8) {
        isSpeechPause = true;
      }
    }

    const wordCount = currentWords.length;
    const shouldBreak =
      isLast ||
      (wordCount >= TARGET_WORD_COUNT && (endsWithTerminal || isSpeechPause)) ||
      (wordCount >= MIN_WORD_COUNT && isSpeechPause) ||
      (wordCount >= 140);

    if (shouldBreak && currentWords.length > 0) {
      paragraphs.push({
        start: Math.round(currentStart * 10) / 10,
        duration: Math.max(0.1, Math.round((currentEnd - currentStart) * 10) / 10),
        text: currentWords.join(' ')
      });
      currentWords = [];
      isNewParagraph = true;
    }
  }

  if (currentWords.length > 0) {
    paragraphs.push({
      start: Math.round(currentStart * 10) / 10,
      duration: Math.max(0.1, Math.round((currentEnd - currentStart) * 10) / 10),
      text: currentWords.join(' ')
    });
  }

  return paragraphs;
}

export function exportToContinuousText(segments: TranscriptSegment[]): string {
  if (!segments || segments.length === 0) return '';
  return segments
    .map(s => (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');
}

export function exportToTxt(segments: TranscriptSegment[], includeTimestamps = true): string {
  if (includeTimestamps) {
    return segments
      .map(s => {
        const clean = (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        return `[${formatTime(s.start)}] ${clean}`;
      })
      .join('\n');
  }
  return exportToContinuousText(segments);
}

export function exportToSrt(segments: TranscriptSegment[]): string {
  return segments
    .map((s, index) => {
      const start = formatSrtTime(s.start);
      const end = formatSrtTime(s.start + (s.duration || 2.5));
      const clean = (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      return `${index + 1}\n${start} --> ${end}\n${clean}\n`;
    })
    .join('\n');
}

export function exportToVtt(segments: TranscriptSegment[]): string {
  const body = segments
    .map(s => {
      const start = formatVttTime(s.start);
      const end = formatVttTime(s.start + (s.duration || 2.5));
      const clean = (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      return `${start} --> ${end}\n${clean}\n`;
    })
    .join('\n');
  return `WEBVTT\n\n${body}`;
}

export function exportToMarkdown(segments: TranscriptSegment[], meta: VideoMetadata, includeTimestamps = true): string {
  const lines = [
    `# ${meta.title || 'YouTube Video Transcript'}`,
    ``,
    `- **Video URL**: ${meta.url}`,
    `- **Creator**: ${meta.author || 'Unknown'}`,
    `- **Exported from**: [Extractyoutubescript](https://extractyoutubescript.com)`,
    `- **Total Segments**: ${segments.length}`,
    `- **Timestamps**: ${includeTimestamps ? 'Included' : 'None (Continuous Script)'}`,
    ``,
    `---`,
    ``,
    `## Full Transcript`,
    ``
  ];

  if (includeTimestamps) {
    segments.forEach(s => {
      const clean = (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      lines.push(`> **\`${formatTime(s.start)}\`** ${clean}`);
      lines.push(``);
    });
  } else {
    lines.push(exportToContinuousText(segments));
  }

  return lines.join('\n');
}

export function exportToJson(segments: TranscriptSegment[], meta: VideoMetadata, includeTimestamps = true): string {
  if (includeTimestamps) {
    return JSON.stringify({
      metadata: meta,
      generatedAt: new Date().toISOString(),
      totalSegments: segments.length,
      includeTimestamps: true,
      segments: segments.map(s => ({
        start: s.start,
        duration: s.duration,
        text: (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
      }))
    }, null, 2);
  }

  return JSON.stringify({
    metadata: meta,
    generatedAt: new Date().toISOString(),
    totalSegments: segments.length,
    includeTimestamps: false,
    text: exportToContinuousText(segments),
    segments: segments.map(s => ({
      text: (s.text || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
    }))
  }, null, 2);
}
