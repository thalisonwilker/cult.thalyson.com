/**
 * Calcula o tempo estimado de leitura em minutos a partir do texto do artigo.
 * Utiliza a média padrão de 200 palavras por minuto (WPM).
 *
 * @param content Texto em Markdown/HTML ou string pura
 * @param wordsPerMinute Taxa de leitura em palavras por minuto (default: 200)
 * @returns Tempo em minutos (inteiro, mínimo 1 para textos não vazios)
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || typeof content !== 'string') {
    return 1;
  }

  // Remove tags HTML e caracteres especiais de markdown para contagem de palavras
  const cleanText = content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_~\[\]()>-]/g, ' ')
    .trim();

  if (cleanText.length === 0) {
    return 1;
  }

  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Formata data no padrão editorial brasileiro (ex: "01 de outubro de 2026")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
}
