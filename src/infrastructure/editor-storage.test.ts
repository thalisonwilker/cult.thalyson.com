import { describe, it, expect } from 'vitest';
import {
  parseEssayMarkdown,
  formatEssayMarkdown,
  saveEssay,
  getEssay,
  deleteEssay,
  type EssayData
} from './editor-storage';

describe('editor-storage', () => {
  it('deve parsear corretamente o frontmatter e body de um ensaio markdown', () => {
    const raw = `---
title: "Título Teste"
description: "Descrição de teste"
pubDate: 2026-10-02
category: "patrimonio"
territory: "para"
locality: "Belém do Pará"
author: "Thalyson"
tags: ["cultura", "patrimonio"]
draft: false
coverImage: "/images/teste.jpg"
coverImagePosition: "center 20%"
---

Este é o corpo do ensaio com **negrito** e [links](https://exemplo.com).
`;

    const parsed = parseEssayMarkdown(raw, 'titulo-teste');
    expect(parsed.slug).toBe('titulo-teste');
    expect(parsed.title).toBe('Título Teste');
    expect(parsed.description).toBe('Descrição de teste');
    expect(parsed.pubDate).toBe('2026-10-02');
    expect(parsed.category).toBe('patrimonio');
    expect(parsed.territory).toBe('para');
    expect(parsed.locality).toBe('Belém do Pará');
    expect(parsed.tags).toEqual(['cultura', 'patrimonio']);
    expect(parsed.draft).toBe(false);
    expect(parsed.coverImage).toBe('/images/teste.jpg');
    expect(parsed.coverImagePosition).toBe('center 20%');
    expect(parsed.body).toContain('Este é o corpo do ensaio');
  });

  it('deve formatar os dados de ensaio em markdown válido com frontmatter', () => {
    const data: EssayData = {
      slug: 'meu-ensaio',
      title: 'Meu Ensaio Cultural',
      description: 'Uma reflexão sobre cultura.',
      pubDate: '2026-10-02',
      category: 'teatro',
      territory: 'para',
      locality: 'Belém',
      author: 'Thalyson',
      tags: ['teatro', 'amazonia'],
      draft: false,
      coverImage: '/images/teatro.jpg',
      coverImagePosition: 'center top',
      body: 'Texto completo aqui.'
    };

    const formatted = formatEssayMarkdown(data);
    expect(formatted).toContain('title: "Meu Ensaio Cultural"');
    expect(formatted).toContain('category: "teatro"');
    expect(formatted).toContain('territory: "para"');
    expect(formatted).toContain('tags: ["teatro", "amazonia"]');
    expect(formatted).toContain('coverImage: "/images/teatro.jpg"');
    expect(formatted).toContain('coverImagePosition: "center top"');
    expect(formatted).toContain('Texto completo aqui.');
  });

  it('deve salvar, recuperar e excluir uma publicação localmente', async () => {
    const testSlug = 'publicacao-temporaria-teste-de-exclusao';
    const testData: EssayData = {
      slug: testSlug,
      title: 'Publicação Temporária para Teste',
      description: 'Descrição de teste para exclusão.',
      pubDate: '2026-10-02',
      category: 'ensaios',
      territory: 'para',
      author: 'Thalyson',
      tags: ['teste'],
      draft: true,
      body: 'Conteúdo de teste para exclusão.'
    };

    // 1. Salva a publicação
    const saveResult = await saveEssay(testData);
    expect(saveResult.ok).toBe(true);
    expect(saveResult.slug).toBe(testSlug);

    // 2. Recupera a publicação
    const fetched = await getEssay(testSlug);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('Publicação Temporária para Teste');

    // 3. Exclui a publicação
    const deleted = await deleteEssay(testSlug);
    expect(deleted).toBe(true);

    // 4. Verifica que não existe mais
    const reFetched = await getEssay(testSlug);
    expect(reFetched).toBeNull();

    // 5. Excluir novamente deve retornar false (já não existe)
    const secondDelete = await deleteEssay(testSlug);
    expect(secondDelete).toBe(false);
  });

  it('deve adicionar, atualizar e remover categorias de forma estruturada e persistida', async () => {
    const { getCategories, addCategory, updateCategory, deleteCategory, saveCategories } = await import('./editor-storage');
    
    // Backup das categorias originais
    const original = await getCategories();

    try {
      const testCatValue = 'categoria-teste-vitest';
      const testCatLabel = 'Categoria Teste Vitest';

      // 1. Adicionar categoria
      const afterAdd = await addCategory({ value: testCatValue, label: testCatLabel });
      expect(afterAdd.some((c) => c.value === testCatValue && c.label === testCatLabel)).toBe(true);

      // 2. Não permitir duplicata de slug/value
      await expect(addCategory({ value: testCatValue, label: 'Outro Nome' })).rejects.toThrow();

      // 3. Atualizar label da categoria
      const updatedLabel = 'Categoria Teste Atualizada';
      const afterUpdate = await updateCategory(testCatValue, updatedLabel);
      const foundUpdated = afterUpdate.find((c) => c.value === testCatValue);
      expect(foundUpdated?.label).toBe(updatedLabel);

      // 4. Remover categoria
      const afterDelete = await deleteCategory(testCatValue);
      expect(afterDelete.some((c) => c.value === testCatValue)).toBe(false);
    } finally {
      // Restaura o arquivo original
      await saveCategories(original);
    }
  });

  it('deve formatar, persistir e atualizar a flag featured corretamente', async () => {
    const { setFeatured } = await import('./editor-storage');
    const slug = 'ensaio-para-teste-de-featured';
    const testData: EssayData = {
      slug,
      title: 'Ensaio com Destaque',
      description: 'Testando featured flag.',
      pubDate: '2026-10-05',
      category: 'ensaios',
      territory: 'para',
      author: 'Thalyson',
      tags: [],
      draft: false,
      featured: true,
      body: 'Corpo do ensaio'
    };

    try {
      await saveEssay(testData);
      const fetched = await getEssay(slug);
      expect(fetched?.featured).toBe(true);

      // Desmarca o destaque usando setFeatured
      await setFeatured(slug, false);
      const fetchedAfter = await getEssay(slug);
      expect(fetchedAfter?.featured).toBe(false);
    } finally {
      await deleteEssay(slug);
    }
  });
});

