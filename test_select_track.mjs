// Test selectBestCaptionTrack with UF8uR6Z6KLc
const INNERTUBE_API_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const INNERTUBE_CLIENT_VERSION = '20.10.38';
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'ANDROID',
    clientVersion: INNERTUBE_CLIENT_VERSION,
  },
};
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;

function selectBestCaptionTrack(renderer, requestedLang) {
  const tracks = renderer?.captionTracks || [];
  if (tracks.length === 0) return null;

  let originalLangCode = 'en';

  const asrTrack = tracks.find(
    (t) => t.kind === 'asr' || (t.vssId && t.vssId.startsWith('a.'))
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

  console.log('originalLangCode detected:', originalLangCode);

  // 1. If user requested a specific language
  if (requestedLang && requestedLang !== 'auto') {
    const req = requestedLang.toLowerCase().trim();
    const exactManual = tracks.find(
      (t) =>
        t.languageCode?.toLowerCase() === req &&
        t.kind !== 'asr' &&
        !(t.vssId && t.vssId.startsWith('a.'))
    );
    if (exactManual) return { chosenTrack: exactManual, originalLanguageCode: originalLangCode };

    const exactAny = tracks.find(
      (t) => t.languageCode?.toLowerCase() === req
    );
    if (exactAny) return { chosenTrack: exactAny, originalLanguageCode: originalLangCode };

    const prefixManual = tracks.find(
      (t) =>
        t.languageCode?.toLowerCase().startsWith(req) &&
        t.kind !== 'asr' &&
        !(t.vssId && t.vssId.startsWith('a.'))
    );
    if (prefixManual) return { chosenTrack: prefixManual, originalLanguageCode: originalLangCode };

    const prefixAny = tracks.find((t) =>
      t.languageCode?.toLowerCase().startsWith(req)
    );
    if (prefixAny) return { chosenTrack: prefixAny, originalLanguageCode: originalLangCode };
  }

  // 2. Auto-detect
  if (asrTrack) {
    const spokenLang = asrTrack.languageCode;
    const manualSpoken = tracks.find(
      (t) =>
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
    (t) =>
      t.languageCode?.startsWith('en') &&
      t.kind !== 'asr' &&
      !(t.vssId && t.vssId.startsWith('a.'))
  );
  if (enManual) return { chosenTrack: enManual, originalLanguageCode: enManual.languageCode };

  const enAny = tracks.find((t) => t.languageCode?.startsWith('en'));
  if (enAny) return { chosenTrack: enAny, originalLanguageCode: enAny.languageCode };

  return { chosenTrack: tracks[0], originalLanguageCode: tracks[0].languageCode || originalLangCode };
}

async function run() {
  const resp = await fetch(INNERTUBE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': INNERTUBE_USER_AGENT,
    },
    body: JSON.stringify({
      context: INNERTUBE_CONTEXT,
      videoId: 'UF8uR6Z6KLc',
    }),
  });
  const data = await resp.json();
  const renderer = data?.captions?.playerCaptionsTracklistRenderer;
  const sel = selectBestCaptionTrack(renderer, 'auto');
  console.log('Selected track:', sel.chosenTrack.languageCode, sel.chosenTrack.name, sel.chosenTrack.vssId);
}

await run();
