export interface FaqItem {
  id: string;
  name: string;
  answerHtml: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "como-transcrever-um-video-do-youtube",
    name: "Como transcrever um video do youtube?",
    answerHtml: `<p>Para <strong>transcrever um video do youtube</strong> de forma rápida e 100% gratuita, siga estes 3 passos simples:</p><ol><li><strong>Copie o link do vídeo:</strong> Acesse o YouTube no computador ou aplicativo móvel (Android/iOS), clique no botão <em>Compartilhar</em> e copie a URL do vídeo desejado. O sistema é compatível com links padrão, Shorts e links curtos (youtu.be).</li><li><strong>Cole no campo de busca:</strong> Acesse o Extractyoutubescript e cole o link no campo de entrada no topo da página.</li><li><strong>Clique em Extrair Transcrição:</strong> Em poucos segundos, a plataforma processa a fala e exibe o texto completo sincronizado com marcações de tempo (timestamps).</li></ol><p>Você pode acompanhar o texto sincronizado com o player, copiar tudo com 1 clique ou exportar o arquivo sem precisar criar conta nem instalar extensões.</p>`
  },
  {
    id: "como-transcrever-video-do-youtube-em-texto",
    name: "Como transcrever video do youtube em texto?",
    answerHtml: `<p>Para <strong>transcrever video do youtube em texto</strong> editável pronto para anotações, resumos ou trabalhos acadêmicos:</p><ol><li><strong>Insira o link do vídeo:</strong> Cole a URL do YouTube no conversor online e clique em <strong>Extrair Transcrição</strong>.</li><li><strong>Escolha o modo de visualização:</strong> Alterne entre o modo de parágrafos contínuos (texto corrido limpo) ou o modo com minutagem (timestamps precisos) para identificar o momento exato de cada fala.</li><li><strong>Copie ou exporte o texto:</strong> Utilize o botão <strong>Copiar Texto</strong> para colar diretamente no Microsoft Word, Google Docs, Notion ou ChatGPT, ou faça o download imediato nos formatos <strong>.TXT</strong>, <strong>.SRT</strong> (legenda), <strong>.VTT</strong>, <strong>.MD</strong> (Markdown) ou <strong>.JSON</strong>.</li></ol><p>A ferramenta também oferece a função <em>Smart Trim</em> para eliminar automaticamente introduções, vinhetas repetitivas e trechos de patrocinadores com apenas um clique.</p>`
  },
  {
    id: "como-transcrever-um-video-do-youtube-ia",
    name: "Como transcrever um vídeo do youtube?",
    answerHtml: `<p>Para <strong>transcrever um vídeo do youtube</strong> com alta fidelidade — inclusive quando o canal não disponibilizou legendas nativas (Closed Captions) —, nossa plataforma combina duas tecnologias de ponta:</p><ul><li><strong>Extração Instantânea de Legendas:</strong> Se o vídeo contiver legendas geradas automaticamente ou adicionadas pelo criador, o texto completo é obtido em menos de 3 segundos.</li><li><strong>IA Acústica com Áudio Fallback:</strong> Quando o vídeo não tem legendas, nossa Inteligência Artificial analisa a faixa sonora, filtra ruídos do ambiente e transcreve a fala diretamente em texto pontuado e estruturado.</li></ul><p>O processo é 100% online e gratuito, funcionando diretamente pelo navegador tanto no computador quanto em celulares Android e iPhone, servindo para videoaulas, entrevistas, podcasts longos e YouTube Shorts.</p>`
  },
  {
    id: "como-ver-a-transcricao-do-video-no-youtube",
    name: "Como ver a transcrição do video no youtube?",
    answerHtml: `<p>Para <strong>ver a transcrição do video no youtube</strong> nativamente usando a própria interface da plataforma:</p><ol><li><strong>No computador (Desktop):</strong> Abra o vídeo no YouTube, role a página até a caixa de descrição abaixo do título, clique em <strong>"...mais"</strong> para expandir e clique no botão <strong>"Mostrar transcrição"</strong>. Uma barra lateral será aberta no canto direito com as falas e os segundos do vídeo.</li><li><strong>No celular (App YouTube):</strong> No aplicativo do YouTube para Android ou iPhone, toque na descrição do vídeo e role para baixo até a opção <strong>"Mostrar transcrição"</strong>.</li></ol><p><em>Vantagens do Extractyoutubescript em relação à transcrição nativa:</em> A função nativa do YouTube não permite baixar arquivos (.txt, .srt, .docx), não remove anúncios de patrocinadores e fica indisponível se o canal desabilitar as legendas. No Extractyoutubescript, você copia o texto limpo em 1 clique, baixa em múltiplos formatos, traduz para mais de 30 línguas e transcreve até vídeos sem legenda nativa com IA.</p>`
  },
  {
    id: "formatos-exportacao-transcricao",
    name: "Em quais formatos posso baixar a transcrição?",
    answerHtml: `<p>Você pode baixar a transcrição completa nos seguintes formatos profissionais:</p><ul><li><strong>.TXT:</strong> Texto corrido simples, ideal para abrir no Bloco de Notas, colar no Word ou resumir com IA.</li><li><strong>.SRT:</strong> Arquivo oficial de legenda com minutagem precisa (timecodes), pronto para editores de vídeo como Premiere, Final Cut, DaVinci e CapCut.</li><li><strong>.VTT:</strong> Formato Web Video Text Tracks para legendas em players HTML5 e plataformas online.</li><li><strong>.MD (Markdown):</strong> Formatado com cabeçalhos e listas para Notion, Obsidian e documentações.</li><li><strong>.JSON:</strong> Estruturado com timestamps de início e fim, perfeito para desenvolvedores e integrações.</li></ul>`
  },
  {
    id: "gratuito-sem-cadastro",
    name: "Preciso pagar alguma taxa ou fazer login para transcrever vídeos?",
    answerHtml: `<p>Não! O Extractyoutubescript é <strong>100% gratuito e ilimitado</strong>. Você não precisa criar conta, informar e-mail, cadastrar senha nem inserir dados de cartão de crédito. Basta colar o link do YouTube e transcrever quantos vídeos quiser com total privacidade.</p>`
  }
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map((item) => ({
    "@type": "Question",
    "name": item.name,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answerHtml
    }
  }))
};
