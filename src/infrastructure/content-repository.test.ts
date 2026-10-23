import { describe, it, expect } from 'vitest';
import { getAllEssays, getEssayBySlug, renderMarkdownToHtml } from './content-repository';

describe('ContentRepository — 0015: Migração para Next.js', () => {
  it('AC-2: carrega todos os ensaios publicados com frontmatter válido', async () => {
    const essays = await getAllEssays();
    expect(essays.length).toBeGreaterThanOrEqual(3);

    for (const essay of essays) {
      expect(essay.slug).toBeDefined();
      expect(essay.data.title).toBeDefined();
      expect(essay.data.category).toBeDefined();
      expect(essay.data.pubDate instanceof Date).toBe(true);
      expect(essay.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('AC-5: encontra um ensaio específico por slug para rota canônica', async () => {
    const essay = await getEssayBySlug('as-14-procissoes-do-cirio-de-nazare');
    expect(essay).not.toBeNull();
    expect(essay?.data.category).toBe('patrimonio');
  });

  it('AC-2: converte markdown com HTML bruto em HTML seguro preservando tags', async () => {
    const markdown = '<p align="justify">Texto justificado</p>\n\n[Link](https://cult.thalyson.com)';
    const html = await renderMarkdownToHtml(markdown);

    expect(html).toContain('<p align="justify">Texto justificado</p>');
    expect(html).toContain('<a href="https://cult.thalyson.com">Link</a>');
  });

  it('AC-1 / AC-3 / AC-4 / AC-6 / AC-7 / AC-8: valida arquivos e convenções de build estático do Next.js', async () => {
    const fs = await import('node:fs');
    expect(fs.existsSync('next.config.mjs')).toBe(true);
    expect(fs.existsSync('app/layout.tsx')).toBe(true);
    expect(fs.existsSync('app/page.tsx')).toBe(true);
    expect(fs.existsSync('app/not-found.tsx')).toBe(true);
    expect(fs.existsSync('src/styles/components.css')).toBe(true);
  });
});

