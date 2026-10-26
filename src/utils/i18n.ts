export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export const translations: Record<string, Record<string, string>> = {
  // Page Meta
  'meta.title': {
    en: 'Extractyoutubescript — Free YouTube Transcript Generator',
    pt: 'Transcrever Vídeo YouTube — Converter em Texto Online Grátis com IA',
    it: 'Extractyoutubescript — Generatore Gratuito di Trascrizioni YouTube',
    es: 'Extractyoutubescript — Generador Gratuito de Transcripciones de YouTube',
    de: 'Extractyoutubescript — Kostenloser YouTube-Transkript-Generator',
    fr: 'Extractyoutubescript — Générateur Gratuit de Transcriptions YouTube'
  },
  'meta.description': {
    en: 'Extract complete YouTube transcripts instantly with native captions, free smart audio fallback, and multi-format exports. Download as TXT, SRT, VTT, Markdown, and JSON.',
    pt:
     'Aprenda como transcrever vídeo do YouTube em texto online grátis. Use nossa IA para transcrever vídeo do YouTube em segundos e baixe em TXT, SRT, VTT ou Markdown.',
    it: 'Estrai istantaneamente trascrizioni complete di YouTube con sottotitoli nativi, fallback audio gratuito ed esportazione multiformato. Scarica in TXT, SRT, VTT, Markdown e JSON.',
    es: 'Extrae transcripciones completas de YouTube al instante con subtítulos nativos, respaldo de audio gratuito y exportación multiformato. Descarga en TXT, SRT, VTT, Markdown y JSON.',
    de: 'Extrahieren Sie vollständige YouTube-Transkripte sofort mit nativen Untertiteln, kostenlosem Audio-Fallback und Multiformat-Export. Als TXT, SRT, VTT, Markdown und JSON herunterladen.',
    fr: 'Extrayez instantanément les transcriptions YouTube complètes avec sous-titres natifs, secours audio gratuit et export multiformat. Téléchargez en TXT, SRT, VTT, Markdown et JSON.'
  },

  // Header
  'header.brand': {
    en: 'Extractyoutubescript',
    pt: 'Extractyoutubescript',
    it: 'Extractyoutubescript',
    es: 'Extractyoutubescript',
    de: 'Extractyoutubescript',
    fr: 'Extractyoutubescript'
  },
  'header.lang_label': {
    en: 'Language',
    pt: 'Idioma',
    it: 'Lingua',
    es: 'Idioma',
    de: 'Sprache',
    fr: 'Langue'
  },
  'header.nav_home': {
    en: 'Home',
    pt: 'Início',
    it: 'Inizio',
    es: 'Inicio',
    de: 'Start',
    fr: 'Accueil'
  },
  'header.nav_about': {
    en: 'About Us',
    pt: 'Sobre Nós',
    it: 'Chi Siamo',
    es: 'Sobre Nosotros',
    de: 'Über Uns',
    fr: 'À Propos'
  },
  'header.nav_contact': {
    en: 'Contact',
    pt: 'Contato',
    it: 'Contatti',
    es: 'Contacto',
    de: 'Kontakt',
    fr: 'Contact'
  },
  'header.nav_privacy': {
    en: 'Privacy Policy',
    pt: 'Privacidade',
    it: 'Privacy',
    es: 'Privacidad',
    de: 'Datenschutz',
    fr: 'Confidentialité'
  },
  'header.nav_terms': {
    en: 'Terms',
    pt: 'Termos',
    it: 'Termini',
    es: 'Términos',
    de: 'AGB',
    fr: 'Conditions'
  },
  'footer.company_title': {
    en: 'Company',
    pt: 'Institucional',
    it: 'Azienda',
    es: 'Compañía',
    de: 'Unternehmen',
    fr: 'Entreprise'
  },
  'footer.legal_title': {
    en: 'Legal & Policies',
    pt: 'Legal & Privacidade',
    it: 'Note Legali',
    es: 'Legal y Privacidad',
    de: 'Rechtliches',
    fr: 'Mentions Légales'
  },
  'footer.about': {
    en: 'About Extractyoutubescript',
    pt: 'Sobre Nós',
    it: 'Chi Siamo',
    es: 'Sobre Nosotros',
    de: 'Über Uns',
    fr: 'À Propos de Nous'
  },
  'footer.contact': {
    en: 'Contact Us',
    pt: 'Fale Conosco',
    it: 'Contattaci',
    es: 'Contáctanos',
    de: 'Kontakt',
    fr: 'Nous Contacter'
  },
  'footer.privacy': {
    en: 'Privacy Policy',
    pt: 'Política de Privacidade',
    it: 'Informativa sulla Privacy',
    es: 'Política de Privacidad',
    de: 'Datenschutzerklärung',
    fr: 'Politique de Confidentialité'
  },
  'footer.terms': {
    en: 'Terms & Conditions',
    pt: 'Termos e Condições',
    it: 'Termini e Condizioni',
    es: 'Términos y Condiciones',
    de: 'Nutzungsbedingungen',
    fr: 'Conditions Générales'
  },
  'footer.disclaimer': {
    en: 'YouTube Disclaimer',
    pt: 'Aviso YouTube LLC',
    it: 'Disclaimer YouTube',
    es: 'Aviso Legal YouTube',
    de: 'YouTube-Hinweis',
    fr: 'Mentions YouTube'
  },

  // Hero
  'hero.title': {
    en: 'Extract YouTube transcripts <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">with zero friction.</span>',
    pt: 'Transcrever Vídeo YouTube <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">em texto online e grátis.</span>',
    it: 'Estrai trascrizioni di YouTube <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">senza complicazioni.</span>',
    es: 'Extrae transcripciones de YouTube <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">sin complicaciones.</span>',
    de: 'YouTube-Transkripte extrahieren <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">völlig reibungslos.</span>',
    fr: 'Extrayez les transcriptions YouTube <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">en toute simplicité.</span>'
  },
  'hero.subtitle': {
    en: 'Paste any YouTube link to extract native captions, automatically activate the free audio fallback when captions are missing, translate to 30+ languages, and export in seconds.',
    pt: 'Cole qualquer link do YouTube para transcrever vídeo do YouTube em texto instantaneamente com IA, legendas automáticas, timestamps sincronizados e exportação para TXT, SRT e Markdown.',
    it: 'Incolla qualsiasi link di YouTube per estrarre i sottotitoli nativi, attivare automaticamente il fallback audio gratuito se mancano i sottotitoli, tradurre in oltre 30 lingue ed esportare in pochi secondi.',
    es: 'Pega cualquier enlace de YouTube para extraer subtítulos nativos, activar automáticamente el respaldo gratuito de audio si faltan subtítulos, traducir a más de 30 idiomas y exportar en segundos.',
    de: 'Fügen Sie einen beliebigen YouTube-Link ein, um native Untertitel zu extrahieren, bei fehlenden Untertiteln das kostenlose Audio-Fallback zu aktivieren, in über 30 Sprachen zu übersetzen und in Sekunden zu exportieren.',
    fr: 'Collez n\'importe quel lien YouTube pour extraire les sous-titres natifs, activer automatiquement le secours audio gratuit en cas d\'absence de sous-titres, traduire dans plus de 30 langues et exporter en quelques secondes.'
  },

  // Input Card
  'form.placeholder': {
    en: 'Paste YouTube link or Video ID',
    pt: 'Cole o link do YouTube ou ID do vídeo',
    it: 'Incolla link di YouTube o ID video',
    es: 'Pega el enlace de YouTube o ID de video',
    de: 'YouTube-Link oder Video-ID einfügen',
    fr: 'Collez le lien YouTube ou l\'identifiant vidéo'
  },
  'form.btn_extract': {
    en: 'Extract Transcript',
    pt: 'Extrair Transcrição',
    it: 'Estrai Trascrizione',
    es: 'Extraer Transcripción',
    de: 'Transkript Extrahieren',
    fr: 'Extraire la Transcription'
  },
  'form.btn_extracting': {
    en: 'Extracting...',
    pt: 'Extraindo...',
    it: 'Estrazione in corso...',
    es: 'Extrayendo...',
    de: 'Wird extrahiert...',
    fr: 'Extraction en cours...'
  },
  'samples.title': {
    en: 'Try samples:',
    pt: 'Exemplos rápidos:',
    it: 'Prova esempi:',
    es: 'Probar ejemplos:',
    de: 'Beispiele testen:',
    fr: 'Exemples rapides :'
  },
  'method.auto': {
    en: 'Auto (CC + Fallback)',
    pt: 'Automático (CC + Fallback)',
    it: 'Automatico (CC + Fallback)',
    es: 'Automático (CC + Respaldo)',
    de: 'Automatisch (CC + Fallback)',
    fr: 'Automatique (CC + Secours)'
  },
  'method.cc': {
    en: 'CC Only',
    pt: 'Apenas CC',
    it: 'Solo CC',
    es: 'Solo CC',
    de: 'Nur CC',
    fr: 'Sous-titres seuls'
  },
  'method.fallback': {
    en: 'Free Fallback',
    pt: 'Fallback Gratuito',
    it: 'Fallback Gratuito',
    es: 'Respaldo Gratuito',
    de: 'Kostenloses Fallback',
    fr: 'Secours Gratuit'
  },
  'error.dismiss': {
    en: 'Dismiss',
    pt: 'Fechar',
    it: 'Chiudi',
    es: 'Descartar',
    de: 'Schließen',
    fr: 'Fermer'
  },
  'error.default': {
    en: 'Error processing video',
    pt: 'Erro ao processar o vídeo',
    it: 'Errore durante l\'elaborazione del video',
    es: 'Error al procesar el video',
    de: 'Fehler bei der Videoverarbeitung',
    fr: 'Erreur lors du traitement de la vidéo'
  },

  // Loading State
  'loading.title': {
    en: 'Extracting Transcript...',
    pt: 'Extraindo Transcrição...',
    it: 'Estrazione del trascritto...',
    es: 'Extrayendo Transcripción...',
    de: 'Transkript wird extrahiert...',
    fr: 'Extraction de la transcription...'
  },
  'loading.desc': {
    en: 'Checking native YouTube caption tracks',
    pt: 'Verificando faixas de legendas nativas do YouTube',
    it: 'Verifica delle tracce dei sottotitoli nativi di YouTube',
    es: 'Comprobando pistas de subtítulos nativas de YouTube',
    de: 'Überprüfung nativer YouTube-Untertitelspuren',
    fr: 'Vérification des pistes de sous-titres natifs de YouTube'
  },
  'loading.fallback_title': {
    en: 'Activating Free Smart Audio Fallback...',
    pt: 'Ativando Fallback Inteligente de Áudio Gratuito...',
    it: 'Attivazione del fallback audio intelligente gratuito...',
    es: 'Activando Respaldo Inteligente de Audio Gratuito...',
    de: 'Kostenloses Smart Audio-Fallback wird aktiviert...',
    fr: 'Activation du secours audio intelligent gratuit...'
  },
  'loading.fallback_desc': {
    en: 'Contacting YouTube media servers and parsing timed captions',
    pt: 'Contatando servidores de mídia do YouTube e processando legendas sincronizadas',
    it: 'Connessione ai server di YouTube e analisi dei sottotitoli sincronizzati',
    es: 'Conectando con servidores de YouTube y analizando subtítulos temporizados',
    de: 'Verbindung zu YouTube-Servern und Verarbeitung synchronisierter Untertitel',
    fr: 'Connexion aux serveurs YouTube et analyse des sous-titres synchronisés'
  },

  // Status Badges & Controls
  'status.method_cc': {
    en: 'Direct YouTube CC API',
    pt: 'API Direta de Legendas YouTube',
    it: 'API Diretta Sottotitoli YouTube',
    es: 'API Directa de Subtítulos YouTube',
    de: 'Direkte YouTube-CC-API',
    fr: 'API Directe Sous-titres YouTube'
  },
  'status.method_fallback': {
    en: 'Method 2: Free Smart Audio Fallback',
    pt: 'Método 2: Fallback Inteligente de Áudio Gratuito',
    it: 'Metodo 2: Fallback Audio Intelligente Gratuito',
    es: 'Método 2: Respaldo Inteligente de Audio Gratuito',
    de: 'Methode 2: Kostenloses Smart Audio-Fallback',
    fr: 'Méthode 2 : Secours Audio Intelligent Gratuit'
  },
  'status.native_tag': {
    en: '(Native)',
    pt: '(Nativo)',
    it: '(Nativo)',
    es: '(Nativo)',
    de: '(Nativ)',
    fr: '(Natif)'
  },
  'status.translated_tag': {
    en: '(Translated)',
    pt: '(Traduzido)',
    it: '(Tradotto)',
    es: '(Traducido)',
    de: '(Übersetzt)',
    fr: '(Traduit)'
  },
  'status.original_tag': {
    en: '(Original)',
    pt: '(Original)',
    it: '(Originale)',
    es: '(Original)',
    de: '(Original)',
    fr: '(Original)'
  },
  'status.translate_group': {
    en: 'Translate Video To:',
    pt: 'Traduzir Vídeo Para:',
    it: 'Traduci Video In:',
    es: 'Traducir Video A:',
    de: 'Video übersetzen in:',
    fr: 'Traduire la Vidéo en :'
  },
  'status.native_group': {
    en: 'Available Video Subtitles (Native):',
    pt: 'Legendas Disponíveis do Vídeo (Nativas):',
    it: 'Sottotitoli Disponibili del Video (Nativi):',
    es: 'Subtítulos Disponibles del Video (Nativos):',
    de: 'Verfügbare Video-Untertitel (Nativ):',
    fr: 'Sous-titres Disponibles de la Vidéo (Natifs) :'
  },
  'video.click_seek': {
    en: 'Click timestamp to seek:',
    pt: 'Clique no timestamp para reproduzir:',
    it: 'Clicca sul timestamp per riprodurre:',
    es: 'Haz clic en la marca de tiempo para buscar:',
    de: 'Zeitstempel anklicken zum Abspielen:',
    fr: 'Cliquez sur l\'horodatage pour lire :'
  },
  'video.open_yt': {
    en: 'Open in YouTube',
    pt: 'Abrir no YouTube',
    it: 'Apri su YouTube',
    es: 'Abrir en YouTube',
    de: 'Auf YouTube öffnen',
    fr: 'Ouvrir sur YouTube'
  },

  // Trim Card
  'trim.title': {
    en: 'Remove Unwanted Sections',
    pt: 'Remover Seções Indesejadas',
    it: 'Rimuovi Sezioni Indesiderate',
    es: 'Eliminar Secciones No Deseadas',
    de: 'Unerwünschte Abschnitte entfernen',
    fr: 'Supprimer les Sections Indésirables'
  },
  'trim.badge': {
    en: 'Smart Trim',
    pt: 'Corte Inteligente',
    it: 'Taglio Intelligente',
    es: 'Corte Inteligente',
    de: 'Smart-Trim',
    fr: 'Découpe Intelligente'
  },
  'trim.desc': {
    en: 'Quickly remove intros, outros, or sponsor pitches from your transcript and exports:',
    pt: 'Remova rapidamente introduções, encerramentos ou trechos de patrocinadores da sua transcrição e exportações:',
    it: 'Rimuovi rapidamente intro, outro o sponsor dalla trascrizione e dai file esportati:',
    es: 'Elimina rápidamente introducciones, finales o anuncios de patrocinadores de tu transcripción y exportaciones:',
    de: 'Entfernen Sie schnell Intros, Outros oder Sponsorenwerbung aus Ihrem Transkript und den Exporten:',
    fr: 'Supprimez rapidement les intros, outros ou partenariats de votre transcription et de vos exports :'
  },
  'trim.intro_btn': {
    en: '✂️ Skip Intro (30s)',
    pt: '✂️ Pular Intro (30s)',
    it: '✂️ Salta Intro (30s)',
    es: '✂️ Saltar Intro (30s)',
    de: '✂️ Intro überspringen (30s)',
    fr: '✂️ Passer l\'intro (30s)'
  },
  'trim.intro_active': {
    en: '✓ Intro Skipped (30s)',
    pt: '✓ Intro Pulada (30s)',
    it: '✓ Intro Saltata (30s)',
    es: '✓ Intro Omitida (30s)',
    de: '✓ Intro übersprungen (30s)',
    fr: '✓ Intro passée (30s)'
  },
  'trim.outro_btn': {
    en: '✂️ Skip Outro (30s)',
    pt: '✂️ Pular Encerramento (30s)',
    it: '✂️ Salta Outro (30s)',
    es: '✂️ Saltar Final (30s)',
    de: '✂️ Outro überspringen (30s)',
    fr: '✂️ Passer la fin (30s)'
  },
  'trim.outro_active': {
    en: '✓ Outro Skipped (30s)',
    pt: '✓ Encerramento Pulado (30s)',
    it: '✓ Outro Saltata (30s)',
    es: '✓ Final Omitido (30s)',
    de: '✓ Outro übersprungen (30s)',
    fr: '✓ Fin passée (30s)'
  },
  'trim.sponsors_btn': {
    en: '🛡️ Strip Sponsors & Fluff',
    pt: '🛡️ Remover Patrocinadores e Fluff',
    it: '🛡️ Rimuovi Sponsor e Fluff',
    es: '🛡️ Eliminar Patrocinios y Relleno',
    de: '🛡️ Sponsoren & Füllwörter filtern',
    fr: '🛡️ Retirer les Sponsors & Blabla'
  },
  'trim.sponsors_active': {
    en: '✓ Sponsors Filtered',
    pt: '✓ Patrocinadores Filtrados',
    it: '✓ Sponsor Filtrati',
    es: '✓ Patrocinios Filtrados',
    de: '✓ Sponsoren gefiltert',
    fr: '✓ Sponsors Filtrés'
  },
  'trim.auto_filter': {
    en: 'Auto-Filter',
    pt: 'Filtro Automático',
    it: 'Filtro Automatico',
    es: 'Filtro Automático',
    de: 'Auto-Filter',
    fr: 'Filtre Automatique'
  },

  // Transcript Explorer
  'search.placeholder': {
    en: 'Search within transcript...',
    pt: 'Pesquisar na transcrição...',
    it: 'Cerca nella trascrizione...',
    es: 'Buscar en la transcripción...',
    de: 'Im Transkript suchen...',
    fr: 'Rechercher dans la transcription...'
  },
  'search.found': {
    en: 'found',
    pt: 'encontrados',
    it: 'trovati',
    es: 'encontrados',
    de: 'gefunden',
    fr: 'trouvés'
  },
  'view.timestamps': {
    en: 'Timestamps',
    pt: 'Marcas de Tempo',
    it: 'Timestamp',
    es: 'Marcas de Tiempo',
    de: 'Zeitstempel',
    fr: 'Horodatages'
  },
  'view.continuous': {
    en: 'Continuous',
    pt: 'Texto Contínuo',
    it: 'Testo Continuo',
    es: 'Texto Continuo',
    de: 'Fließtext',
    fr: 'Texte Continu'
  },
  'export.label': {
    en: 'Export formats:',
    pt: 'Formatos de exportação:',
    it: 'Formati di esportazione:',
    es: 'Formatos de exportación:',
    de: 'Exportformate:',
    fr: 'Formats d\'export :'
  },
  'export.ts_on': {
    en: 'Timestamps: ON',
    pt: 'Timestamps: ATIVADO',
    it: 'Timestamp: ATTIVI',
    es: 'Marcas: ACTIVADAS',
    de: 'Zeitstempel: AN',
    fr: 'Horodatages : ACTIVÉS'
  },
  'export.ts_off': {
    en: 'Timestamps: OFF',
    pt: 'Timestamps: DESATIVADO',
    it: 'Timestamp: DISATTIVI',
    es: 'Marcas: DESACTIVADAS',
    de: 'Zeitstempel: AUS',
    fr: 'Horodatages : DÉSACTIVÉS'
  },
  'export.copy_btn': {
    en: 'Copy',
    pt: 'Copiar',
    it: 'Copia',
    es: 'Copiar',
    de: 'Kopieren',
    fr: 'Copier'
  },
  'export.txt_title': {
    en: 'Plain text transcript (.txt)',
    pt: 'Transcrição em texto simples (.txt)',
    it: 'Trascrizione in testo semplice (.txt)',
    es: 'Transcripción en texto plano (.txt)',
    de: 'Klartext-Transkript (.txt)',
    fr: 'Transcription en texte brut (.txt)'
  },
  'export.srt_title': {
    en: 'SubRip subtitle format (.srt)',
    pt: 'Formato de legendas SubRip (.srt)',
    it: 'Formato sottotitoli SubRip (.srt)',
    es: 'Formato de subtítulos SubRip (.srt)',
    de: 'SubRip-Untertitelformat (.srt)',
    fr: 'Format de sous-titres SubRip (.srt)'
  },
  'export.vtt_title': {
    en: 'WebVTT subtitle format (.vtt)',
    pt: 'Formato de legendas WebVTT (.vtt)',
    it: 'Formato sottotitoli WebVTT (.vtt)',
    es: 'Formato de subtítulos WebVTT (.vtt)',
    de: 'WebVTT-Untertitelformat (.vtt)',
    fr: 'Format de sous-titres WebVTT (.vtt)'
  },
  'export.md_title': {
    en: 'Markdown formatted document (.md)',
    pt: 'Documento formatado em Markdown (.md)',
    it: 'Documento formattato in Markdown (.md)',
    es: 'Documento formateado en Markdown (.md)',
    de: 'Markdown-formatiertes Dokument (.md)',
    fr: 'Document formaté en Markdown (.md)'
  },
  'export.json_title': {
    en: 'JSON structured data (.json)',
    pt: 'Dados estruturados JSON (.json)',
    it: 'Dati strutturati JSON (.json)',
    es: 'Datos estructurados JSON (.json)',
    de: 'Strukturierte JSON-Daten (.json)',
    fr: 'Données structurées JSON (.json)'
  },
  'export.copy_title': {
    en: 'Copy transcript to clipboard',
    pt: 'Copiar transcrição para a área de transferência',
    it: 'Copia trascrizione negli appunti',
    es: 'Copiar transcripción al portapapeles',
    de: 'Transkript in die Zwischenablage kopieren',
    fr: 'Copier la transcription dans le presse-papiers'
  },
  'transcript.empty_search': {
    en: 'No matching text found in transcript.',
    pt: 'Nenhum texto correspondente encontrado na transcrição.',
    it: 'Nessun testo corrispondente trovato nella trascrizione.',
    es: 'No se encontró texto coincidente en la transcripción.',
    de: 'Kein passender Text im Transkript gefunden.',
    fr: 'Aucun texte correspondant trouvé dans la transcription.'
  },
  'transcript.empty_content': {
    en: 'No transcript content.',
    pt: 'Sem conteúdo de transcrição.',
    it: 'Nessun contenuto di trascrizione.',
    es: 'Sin contenido de transcripción.',
    de: 'Kein Transkriptinhalt.',
    fr: 'Aucun contenu de transcription.'
  },

  // Toasts
  'toast.copied': {
    en: 'Copied to clipboard',
    pt: 'Copiado para a área de transferência',
    it: 'Copiato negli appunti',
    es: 'Copiado al portapapeles',
    de: 'In die Zwischenablage kopiert',
    fr: 'Copié dans le presse-papiers'
  },
  'toast.copied_full_ts': {
    en: 'Full transcript (with timestamps) copied!',
    pt: 'Transcrição completa (com timestamps) copiada!',
    it: 'Trascrizione completa (con timestamp) copiata!',
    es: '¡Transcripción completa (con marcas de tiempo) copiada!',
    de: 'Vollständiges Transkript (mit Zeitstempeln) kopiert!',
    fr: 'Transcription complète (avec horodatages) copiée !'
  },
  'toast.copied_continuous': {
    en: 'Continuous script copied!',
    pt: 'Texto contínuo copiado!',
    it: 'Testo continuo copiato!',
    es: '¡Texto continuo copiado!',
    de: 'Fließtext kopiert!',
    fr: 'Script continu copié !'
  },
  'toast.intro_trimmed': {
    en: 'First 30 seconds trimmed',
    pt: 'Primeiros 30 segundos cortados',
    it: 'Primi 30 secondi rimossi',
    es: 'Primeros 30 segundos recortados',
    de: 'Erste 30 Sekunden getrimmt',
    fr: 'Premières 30 secondes supprimées'
  },
  'toast.intro_restored': {
    en: 'Intro restored',
    pt: 'Introdução restaurada',
    it: 'Intro ripristinata',
    es: 'Introducción restaurada',
    de: 'Intro wiederhergestellt',
    fr: 'Intro rétablie'
  },
  'toast.outro_trimmed': {
    en: 'Last 30 seconds trimmed',
    pt: 'Últimos 30 segundos cortados',
    it: 'Ultimi 30 secondi rimossi',
    es: 'Últimos 30 segundos recortados',
    de: 'Letzte 30 Sekunden getrimmt',
    fr: 'Dernières 30 secondes supprimées'
  },
  'toast.outro_restored': {
    en: 'Outro restored',
    pt: 'Encerramento restaurado',
    it: 'Outro ripristinata',
    es: 'Final restaurado',
    de: 'Outro wiederhergestellt',
    fr: 'Fin rétablie'
  },
  'toast.sponsors_filtered': {
    en: 'Sponsor phrases filtered out',
    pt: 'Frases de patrocínio filtradas',
    it: 'Frasi di sponsorizzazione rimosse',
    es: 'Frases de patrocinio filtradas',
    de: 'Sponsorenphrasen herausgefiltert',
    fr: 'Phrases de sponsors filtrées'
  },
  'toast.sponsors_restored': {
    en: 'Sponsor phrases restored',
    pt: 'Frases de patrocínio restauradas',
    it: 'Frasi di sponsorizzazione ripristinate',
    es: 'Frases de patrocinio restauradas',
    de: 'Sponsorenphrasen wiederhergestellt',
    fr: 'Phrases de sponsors rétablies'
  },
  'toast.ts_enabled': {
    en: 'Timestamps enabled for downloads',
    pt: 'Timestamps ativados para downloads',
    it: 'Timestamp abilitati per il download',
    es: 'Marcas de tiempo activadas para descargas',
    de: 'Zeitstempel für Downloads aktiviert',
    fr: 'Horodatages activés pour les téléchargements'
  },
  'toast.ts_disabled': {
    en: 'Timestamps disabled for downloads',
    pt: 'Timestamps desativados para downloads',
    it: 'Timestamp disabilitati per il download',
    es: 'Marcas de tiempo desactivadas para descargas',
    de: 'Zeitstempel für Downloads deaktiviert',
    fr: 'Horodatages désactivés pour les téléchargements'
  },
  'toast.translating_to': {
    en: 'Translating to',
    pt: 'Traduzindo para',
    it: 'Traduzione in',
    es: 'Traduciendo a',
    de: 'Wird übersetzt in',
    fr: 'Traduction vers'
  },
  'toast.restored_orig': {
    en: 'Restored original language',
    pt: 'Idioma original restaurado',
    it: 'Lingua originale ripristinata',
    es: 'Idioma original restaurado',
    de: 'Originalsprache wiederhergestellt',
    fr: 'Langue d\'origine rétablie'
  },
  'toast.loaded_native': {
    en: 'Loaded native captions',
    pt: 'Legendas nativas carregadas',
    it: 'Sottotitoli nativi caricati',
    es: 'Subtítulos nativos cargados',
    de: 'Native Untertitel geladen',
    fr: 'Sous-titres natifs chargés'
  },
  'toast.trans_complete': {
    en: 'Translation complete',
    pt: 'Tradução concluída',
    it: 'Traduzione completata',
    es: 'Traducción completada',
    de: 'Übersetzung abgeschlossen',
    fr: 'Traduction terminée'
  },
  'toast.exported': {
    en: 'Exported',
    pt: 'Exportado',
    it: 'Esportato',
    es: 'Exportado',
    de: 'Exportiert',
    fr: 'Exporté'
  },
  'toast.jumped': {
    en: 'Jumped video to',
    pt: 'Vídeo avançado para',
    it: 'Video saltato a',
    es: 'Video saltado a',
    de: 'Video gesprungen zu',
    fr: 'Vidéo avancée à'
  },

  // Footer
  'footer.tagline': {
    en: 'The next-generation YouTube transcript generator with instant CC extraction, free smart audio fallback, and multi-format exports.',
    pt: 'O gerador de transcrições do YouTube de última geração com extração instantânea de legendas, fallback inteligente gratuito e exportações em vários formatos.',
    it: 'Il generatore di trascrizioni YouTube di nuova generazione con estrazione istantanea dei sottotitoli, fallback audio gratuito ed esportazioni multiformato.',
    es: 'El generador de transcripciones de YouTube de última generación con extracción instantánea de subtítulos, respaldo inteligente de audio gratuito y exportación multiformato.',
    de: 'Der YouTube-Transkript-Generator der nächsten Generation mit sofortiger CC-Extraktion, kostenlosem intelligentem Audio-Fallback und Multiformat-Export.',
    fr: 'Le générateur de transcriptions YouTube de nouvelle génération avec extraction instantanée des sous-titres, secours audio intelligent gratuit et exports multi-formats.'
  },
  'footer.methods_title': {
    en: 'Engine Methods',
    pt: 'Métodos do Motor',
    it: 'Metodi del Motore',
    es: 'Métodos del Motor',
    de: 'Engine-Methoden',
    fr: 'Méthodes du Moteur'
  },
  'footer.m1': {
    en: 'Method 1: Instant CC API',
    pt: 'Método 1: API CC Instantânea',
    it: 'Metodo 1: API Sottotitoli Istantanea',
    es: 'Método 1: API CC Instantánea',
    de: 'Methode 1: Sofortige CC-API',
    fr: 'Méthode 1 : API CC Instantanée'
  },
  'footer.m2': {
    en: 'Method 2: Free Audio Fallback',
    pt: 'Método 2: Fallback Gratuito de Áudio',
    it: 'Metodo 2: Fallback Audio Gratuito',
    es: 'Método 2: Respaldo de Audio Gratuito',
    de: 'Methode 2: Kostenloses Audio-Fallback',
    fr: 'Méthode 2 : Secours Audio Gratuit'
  },
  'footer.m3': {
    en: 'Multi-Language Translation',
    pt: 'Tradução Multilíngue',
    it: 'Traduzione Multilingue',
    es: 'Traducción Multilingüe',
    de: 'Mehrsprachige Übersetzung',
    fr: 'Traduction Multilingue'
  },
  'footer.m4': {
    en: 'Dual-View Script Formatter',
    pt: 'Formatador com Visão Dupla',
    it: 'Formattatore a Doppia Vista',
    es: 'Formateador de Doble Vista',
    de: 'Dual-View Skript-Formatierer',
    fr: 'Formateur à Double Affichage'
  },
  'footer.exports_title': {
    en: 'Export Formats',
    pt: 'Formatos de Exportação',
    it: 'Formati di Esportazione',
    es: 'Formatos de Exportación',
    de: 'Export-Formate',
    fr: 'Formats d\'Export'
  },
  'footer.e1': {
    en: 'SubRip Subtitles (.SRT)',
    pt: 'Legendas SubRip (.SRT)',
    it: 'Sottotitoli SubRip (.SRT)',
    es: 'Subtítulos SubRip (.SRT)',
    de: 'SubRip Untertitel (.SRT)',
    fr: 'Sous-titres SubRip (.SRT)'
  },
  'footer.e2': {
    en: 'WebVTT Subtitles (.VTT)',
    pt: 'Legendas WebVTT (.VTT)',
    it: 'Sottotitoli WebVTT (.VTT)',
    es: 'Subtítulos WebVTT (.VTT)',
    de: 'WebVTT Untertitel (.VTT)',
    fr: 'Sous-titres WebVTT (.VTT)'
  },
  'footer.e3': {
    en: 'Notion / Obsidian Markdown (.MD)',
    pt: 'Markdown Notion / Obsidian (.MD)',
    it: 'Markdown Notion / Obsidian (.MD)',
    es: 'Markdown Notion / Obsidian (.MD)',
    de: 'Notion / Obsidian Markdown (.MD)',
    fr: 'Markdown Notion / Obsidian (.MD)'
  },
  'footer.e4': {
    en: 'Plain Text with Timestamps (.TXT)',
    pt: 'Texto Simples com Timestamps (.TXT)',
    it: 'Testo Semplice con Timestamp (.TXT)',
    es: 'Texto Plano con Marcas de Tiempo (.TXT)',
    de: 'Klartext mit Zeitstempeln (.TXT)',
    fr: 'Texte Brut avec Horodatages (.TXT)'
  },
  'footer.e5': {
    en: 'Structured JSON (.JSON)',
    pt: 'JSON Estruturado (.JSON)',
    it: 'JSON Strutturato (.JSON)',
    es: 'JSON Estructurado (.JSON)',
    de: 'Strukturiertes JSON (.JSON)',
    fr: 'JSON Structuré (.JSON)'
  }
};

export const STORAGE_KEY = 'extractyt_site_lang';

export function getTranslation(key: string, lang = 'pt'): string {
  const normLang = (lang || 'pt').toLowerCase().split('-')[0];
  const dict = translations[key];
  if (!dict) return key;
  return dict[normLang] || dict['pt'] || dict['en'] || key;
}

export function getCurrentSiteLang(): string {
  if (typeof window === 'undefined') return 'pt';
  try {
    return localStorage.getItem(STORAGE_KEY) || 'pt';
  } catch {
    return 'pt';
  }
}

export function setSiteLanguage(lang: string): void {
  if (typeof window === 'undefined') return;
  const norm = (lang || 'en').toLowerCase().split('-')[0];
  try {
    localStorage.setItem(STORAGE_KEY, norm);
  } catch {
    // localStorage might be unavailable in private mode
  }
  applySiteLanguage(norm);
}

export function applySiteLanguage(lang: string): void {
  if (typeof document === 'undefined') return;
  const norm = (lang || 'en').toLowerCase().split('-')[0];

  // Update HTML lang attribute
  document.documentElement.lang = norm;

  // Update Page Title and Meta Description
  const metaTitle = getTranslation('meta.title', norm);
  const metaDesc = getTranslation('meta.description', norm);
  if (metaTitle) document.title = metaTitle;
  
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && metaDesc) {
    descEl.setAttribute('content', metaDesc);
  }

  // Update text elements with data-i18n
  const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = getTranslation(key, norm);
      if (translated) {
        if (translated.includes('<')) {
          el.innerHTML = translated;
        } else {
          el.textContent = translated;
        }
      }
    }
  });

  // Update placeholder attributes with data-i18n-placeholder
  const placeholderEls = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]');
  placeholderEls.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = getTranslation(key, norm);
      if (translated) {
        el.placeholder = translated;
      }
    }
  });

  // Update title attributes with data-i18n-title
  const titleEls = document.querySelectorAll<HTMLElement>('[data-i18n-title]');
  titleEls.forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      const translated = getTranslation(key, norm);
      if (translated) {
        el.title = translated;
      }
    }
  });

  // Keep all language dropdowns on the page synced
  const siteSelect = document.getElementById('site-lang-select') as HTMLSelectElement | null;
  if (siteSelect && siteSelect.value !== norm) {
    siteSelect.value = norm;
  }

  // Dispatch custom event for dynamic components (like TranscriptApp)
  window.dispatchEvent(new CustomEvent('site-language-change', { detail: { lang: norm } }));
}
