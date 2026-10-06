import { describe, it, expect } from 'vitest';
import { selectFeatured, slugsToUnfeature, type FeaturedCandidate } from './featured';

describe('selectFeatured', () => {
  it('seleciona apenas não-rascunhos marcados como featured', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'a', pubDate: '2026-01-01', featured: true, draft: false },
      { slug: 'b', pubDate: '2026-01-02', featured: false, draft: false },
      { slug: 'c', pubDate: '2026-01-03', featured: true, draft: true }, // rascunho ignorado
    ];
    const res = selectFeatured(items);
    expect(res.map((r) => r.slug)).toEqual(['a']);
  });

  it('ordena por pubDate decrescente e limita ao máximo de 3 itens', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'primeiro', pubDate: '2026-01-01', featured: true },
      { slug: 'segundo', pubDate: '2026-01-02', featured: true },
      { slug: 'terceiro', pubDate: '2026-01-03', featured: true },
      { slug: 'quarto', pubDate: '2026-01-04', featured: true },
    ];
    const res = selectFeatured(items, 3);
    expect(res.map((r) => r.slug)).toEqual(['quarto', 'terceiro', 'segundo']);
  });

  it('desempata por slug alfabético crescente quando a data for igual', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'beta', pubDate: '2026-01-01', featured: true },
      { slug: 'alfa', pubDate: '2026-01-01', featured: true },
    ];
    const res = selectFeatured(items);
    expect(res.map((r) => r.slug)).toEqual(['alfa', 'beta']);
  });

  it('retorna array vazio quando nenhum item é destaque', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'a', pubDate: '2026-01-01', featured: false },
    ];
    expect(selectFeatured(items)).toEqual([]);
  });
});

describe('slugsToUnfeature', () => {
  it('não desmarca ninguém se o alvo for rascunho', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'a', pubDate: '2026-01-01', featured: true },
      { slug: 'b', pubDate: '2026-01-02', featured: true },
      { slug: 'c', pubDate: '2026-01-03', featured: true },
    ];
    const res = slugsToUnfeature(items, 'novo-rascunho', true, 3);
    expect(res).toEqual([]);
  });

  it('não desmarca ninguém se houver menos de 3 outros destaques', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'a', pubDate: '2026-01-01', featured: true },
      { slug: 'b', pubDate: '2026-01-02', featured: true },
    ];
    const res = slugsToUnfeature(items, 'c', false, 3);
    expect(res).toEqual([]);
  });

  it('não desmarca ninguém se o alvo já for um dos 3 destaques existentes', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'a', pubDate: '2026-01-01', featured: true },
      { slug: 'b', pubDate: '2026-01-02', featured: true },
      { slug: 'c', pubDate: '2026-01-03', featured: true },
    ];
    const res = slugsToUnfeature(items, 'b', false, 3);
    expect(res).toEqual([]);
  });

  it('desmarca o destaque mais antigo quando já existem 3 e uma 4ª publicação é destacada', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'antigo', title: 'Mais Antigo', pubDate: '2026-01-01', featured: true },
      { slug: 'meio', title: 'Médio', pubDate: '2026-01-02', featured: true },
      { slug: 'novo', title: 'Mais Novo', pubDate: '2026-01-03', featured: true },
    ];
    const res = slugsToUnfeature(items, 'quarto', false, 3);
    expect(res).toEqual([{ slug: 'antigo', title: 'Mais Antigo' }]);
  });

  it('desmarca múltiplos se houver excedente acumulado no disco', () => {
    const items: FeaturedCandidate[] = [
      { slug: 'a1', pubDate: '2026-01-01', featured: true },
      { slug: 'a2', pubDate: '2026-01-02', featured: true },
      { slug: 'a3', pubDate: '2026-01-03', featured: true },
      { slug: 'a4', pubDate: '2026-01-04', featured: true },
    ];
    // 4 outros + 1 novo = 5 itens; limite 3 -> desmarca os 2 mais antigos (a1 e a2)
    const res = slugsToUnfeature(items, 'novo', false, 3);
    expect(res.map((r) => r.slug)).toEqual(['a1', 'a2']);
  });
});
