import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatDate } from './reading-time';

describe('Domain: calculateReadingTime', () => {
  it('deve retornar no mínimo 1 minuto para textos curtos ou vazios', () => {
    expect(calculateReadingTime('')).toBe(1);
    expect(calculateReadingTime('Um texto curto.')).toBe(1);
  });

  it('deve calcular corretamente o tempo para textos com 400 palavras (~2 minutos)', () => {
    const text = Array(400).fill('palavra').join(' ');
    expect(calculateReadingTime(text)).toBe(2);
  });

  it('deve calcular corretamente o tempo para textos com 650 palavras (~4 minutos)', () => {
    const text = Array(650).fill('ensaio').join(' ');
    expect(calculateReadingTime(text)).toBe(4);
  });

  it('deve limpar tags HTML e símbolos Markdown ao calcular', () => {
    const markdown = '# Título\n\n**Texto em negrito** com [link](https://cult.thalyson.com) e `código`.';
    expect(calculateReadingTime(markdown)).toBe(1);
  });
});

describe('Domain: formatDate', () => {
  it('deve formatar a data corretamente no padrão brasileiro', () => {
    const date = new Date(2026, 9, 1); // 01 de outubro de 2026
    const formatted = formatDate(date);
    expect(formatted).toContain('outubro');
    expect(formatted).toContain('2026');
  });
});
