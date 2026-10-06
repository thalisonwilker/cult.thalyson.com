// src/domain/routes.test.ts
import { describe, it, expect } from 'vitest';
import { getEssayUrl } from './routes';

describe('getEssayUrl', () => {
  it('constrói a URL canônica por categoria com trailing slash', () => {
    const url = getEssayUrl('patrimonio', 'as-14-procissoes-do-cirio-de-nazare');
    expect(url).toBe('/patrimonio/as-14-procissoes-do-cirio-de-nazare/');
  });

  it('normaliza categoria e slug com letras maiúsculas e espaços', () => {
    const url = getEssayUrl('  Musica  ', '  MESTRE-VIEIRA  ');
    expect(url).toBe('/musica/mestre-vieira/');
  });

  it('remove barras extras iniciais ou finais de categoria e slug', () => {
    const url = getEssayUrl('/cinema/', '/o-som-ao-redor/');
    expect(url).toBe('/cinema/o-som-ao-redor/');
  });

  it('lança erro se categoria ou slug estiverem vazios', () => {
    expect(() => getEssayUrl('', 'slug')).toThrow();
    expect(() => getEssayUrl('categoria', '')).toThrow();
  });
});
