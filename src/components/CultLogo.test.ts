import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Identidade Visual: Nova Logo dos Abridores de Letras (CULT .thalyson.com)', () => {
  const logoReactPath = path.resolve(process.cwd(), 'src/components/CultLogo.tsx');
  const logoPngPath = path.resolve(process.cwd(), 'public/images/cult-logo-fluvial.png');

  it('deve possuir o arquivo de componente CultLogo.tsx', () => {
    expect(fs.existsSync(logoReactPath)).toBe(true);
  });

  it('o componente CultLogo.tsx deve renderizar a imagem oficial da logo fluvial com acessibilidade', () => {
    const content = fs.readFileSync(logoReactPath, 'utf-8');
    
    // Contém atributo aria-label informativo
    expect(content).toContain('aria-label=');
    expect(content).toContain('CULT .thalyson.com');

    // Referencia a imagem PNG oficial dos abridores de letras
    expect(content).toContain('/images/cult-logo-fluvial.png');
    expect(content).toContain('cult-logo-img');
    expect(content).toContain('cult-fluvial-logo--header');
    expect(content).toContain('cult-fluvial-logo--footer');
  });

  it('o arquivo de imagem de alta resolução da logo deve existir em public/images/ com transparência', () => {
    expect(fs.existsSync(logoPngPath)).toBe(true);
    const stat = fs.statSync(logoPngPath);
    expect(stat.size).toBeGreaterThan(100000); // Arquivo de alta definição
  });

  it('tokens.css deve declarar a paleta dos abridores de letras e sombras duras', () => {
    const tokensPath = path.resolve(process.cwd(), 'src/styles/tokens.css');
    const tokens = fs.readFileSync(tokensPath, 'utf-8');

    expect(tokens).toContain('--color-cult-navy-deep: #070D22');
    expect(tokens).toContain('--color-cult-surface: #0B1739');
    expect(tokens).toContain('--color-cult-cream: #FFF6E5');
    expect(tokens).toContain('--color-cult-gold: #F4B63F');
    expect(tokens).toContain('--color-cult-turquoise: #17A9B8');
    expect(tokens).toContain('--color-cult-coral: #EC5B5B');
    expect(tokens).toContain('--shadow-fluvial-hard');
    expect(tokens).toContain('--gradient-hero-fluvial');
  });

  it('deve possuir favicons personalizados baseados na letra C vernacular', () => {
    const nextLayout = fs.readFileSync(path.resolve(process.cwd(), 'app/layout.tsx'), 'utf-8');
    expect(nextLayout).toContain('/favicon.svg');
    expect(nextLayout).toContain('/favicon-32x32.png');
    expect(nextLayout).toContain('/apple-touch-icon.png');
    expect(nextLayout).toContain('/favicon.ico');

    expect(fs.existsSync(path.resolve(process.cwd(), 'public/favicon.svg'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'public/favicon.png'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'public/favicon-32x32.png'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'public/apple-touch-icon.png'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'public/favicon.ico'))).toBe(true);
  });
});
