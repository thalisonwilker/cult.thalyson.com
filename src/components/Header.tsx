'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CultLogo from './CultLogo';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  currentCategory?: string;
}

const categories = [
  { slug: 'musica', label: 'Música & Ritmos', accent: 'var(--color-cult-gold)' },
  { slug: 'patrimonio', label: 'Círio & Patrimônio', accent: 'var(--color-cult-coral)' },
  { slug: 'artes', label: 'Arte, Cinema & Imagem', accent: 'var(--color-cult-cobalt)' },
  { slug: 'literatura', label: 'Literatura Paraense', accent: 'var(--color-cult-turquoise)' }
];

export default function Header({ currentCategory }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <header className={`editorial-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        {/* Unidade de Marca: Nova Logo Fluvial dos Abridores de Letras */}
        <div className="brand-unit">
          <CultLogo variant="header" />
        </div>

        {/* Navegação Editorial Desktop em Linha Única à Direita */}
        <nav className="editorial-nav-desktop" aria-label="Navegação editorial principal">
          <ul className="nav-list">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.slug || (cat.slug === 'artes' && currentCategory === 'cinema');
              return (
                <li key={cat.slug} className="nav-item">
                  <Link
                    href={`/?categoria=${cat.slug}`}
                    className={`editorial-link ${isActive ? 'active' : ''}`}
                    style={{ '--nav-accent': cat.accent } as React.CSSProperties}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="accent-dot" aria-hidden="true"></span>
                    <span className="link-label">{cat.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Ações: Theme Switcher & Menu Hambúrguer Mobile */}
        <div className="header-actions">
          <ThemeToggle />

          <button
            id="mobile-menu-trigger"
            className="mobile-menu-btn"
            type="button"
            aria-label="Abrir menu de navegação"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>

      {/* Assinatura Visual Discreta da Revista */}
      <div className="signature-bar" aria-hidden="true"></div>

      {/* Mobile Drawer / Overlay Acessível */}
      <div
        id="mobile-nav-drawer"
        className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="drawer-backdrop"
          id="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        ></div>
        <div className="drawer-content" role="dialog" aria-modal="true" aria-label="Menu de Categorias">
          <div className="drawer-header">
            <CultLogo variant="compact" />
            <button
              id="mobile-menu-close"
              className="drawer-close-btn"
              type="button"
              aria-label="Fechar menu"
              onClick={() => setDrawerOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="drawer-nav" aria-label="Navegação mobile">
            <ul className="drawer-list">
              <li>
                <Link
                  href="/"
                  className={`drawer-link ${!currentCategory ? 'active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="drawer-dot" style={{ backgroundColor: 'var(--color-cult-turquoise)' }}></span>
                  <span>Todo o Acervo</span>
                </Link>
              </li>
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug || (cat.slug === 'artes' && currentCategory === 'cinema');
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/?categoria=${cat.slug}`}
                      className={`drawer-link ${isActive ? 'active' : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <span className="drawer-dot" style={{ backgroundColor: cat.accent }}></span>
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="drawer-footer">
            <p className="drawer-caption">
              Um portal crítico e afetivo sobre as artes, memórias e saberes da Amazônia Atlântica.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
