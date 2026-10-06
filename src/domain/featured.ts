export interface FeaturedCandidate {
  slug: string;
  title?: string;
  pubDate: string | Date;
  draft?: boolean;
  featured?: boolean;
}

function parseTimestamp(date: string | Date): number {
  if (date instanceof Date) return date.getTime();
  const t = new Date(date).getTime();
  return isNaN(t) ? 0 : t;
}

/**
 * Seleciona os ensaios em destaque para exibição na Home:
 * - Apenas não-rascunhos (draft: false ou undefined)
 * - Apenas com featured: true
 * - Ordenados por pubDate decrescente (mais recente primeiro)
 * - Desempate por slug alfabético crescente
 * - Limitado a max (padrão 3)
 */
export function selectFeatured<T extends FeaturedCandidate>(
  items: T[],
  max = 3
): T[] {
  const publishedFeatured = items.filter((item) => !item.draft && Boolean(item.featured));

  publishedFeatured.sort((a, b) => {
    const diff = parseTimestamp(b.pubDate) - parseTimestamp(a.pubDate);
    if (diff !== 0) return diff;
    return a.slug.localeCompare(b.slug);
  });

  return publishedFeatured.slice(0, max);
}

/**
 * Calcula quais destaques existentes devem ser desmarcados quando uma publicação
 * é marcada como destaque:
 * - Rascunhos nunca contam no limite nem provocam desmarcação.
 * - Considera apenas outros destaques não-rascunho já existentes (slug !== targetSlug).
 * - Se outros destaques somarem >= max, os mais antigos (pubDate menor) são desmarcados
 *   até que o total (outros + nova) não ultrapasse max.
 */
export function slugsToUnfeature<T extends FeaturedCandidate>(
  existingItems: T[],
  targetSlug: string,
  isTargetDraft = false,
  max = 3
): { slug: string; title?: string }[] {
  if (isTargetDraft) {
    return [];
  }

  const otherFeatured = existingItems.filter(
    (item) => item.slug !== targetSlug && !item.draft && Boolean(item.featured)
  );

  if (otherFeatured.length < max) {
    return [];
  }

  // Ordena do mais antigo para o mais recente para desmarcar os mais antigos
  otherFeatured.sort((a, b) => {
    const diff = parseTimestamp(a.pubDate) - parseTimestamp(b.pubDate);
    if (diff !== 0) return diff;
    return a.slug.localeCompare(b.slug);
  });

  const excessCount = otherFeatured.length + 1 - max;
  const toRemove = otherFeatured.slice(0, excessCount);

  return toRemove.map((item) => ({
    slug: item.slug,
    title: item.title || item.slug
  }));
}
