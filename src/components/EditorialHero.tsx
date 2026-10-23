import React from 'react';
import Link from 'next/link';
import { withBasePath } from '../domain/routes';

interface EditorialHeroProps {
  coverImage?: string;
  headline?: string;
  lead?: string;
  ctaLink?: string;
  ctaText?: string;
}

export default function EditorialHero({
  coverImage = '/images/docas-belem-noite-estrelada.jpg',
  headline = 'Belém entre arte, música e memória amazônica',
  lead = 'Das margens caudalosas do Guajará aos acordes elétricos das periferias: um mergulho nas sonoridades, saberes ribeirinhos e vanguardas estéticas do Pará.',
  ctaLink = '#em-destaque',
  ctaText = 'Explorar histórias'
}: EditorialHeroProps) {
  const resolvedCover = withBasePath(coverImage);

  return (
    <section className="editorial-hero" aria-label="História Principal da Edição">
      <div className="hero-frame">
        {/* Imagem de Fundo de Alto Impacto */}
        <img
          src={resolvedCover}
          alt="Pintura expressionista noturna da Estação das Docas com os guindastes históricos amarelos e o céu estrelado em espirais sobre a Baía do Guajará em Belém do Pará"
          className="hero-media"
          loading="eager"
          decoding="async"
        />

        {/* Gradient Localizado Exclusivamente para Leitura do Texto */}
        <div className="hero-scrim" aria-hidden="true"></div>

        {/* Conteúdo Editorial com Elementos Fluviais dos Abridores de Letras */}
        <div className="hero-content-wrapper">
          <div className="hero-text-content">
            {/* Pequeno Filete Ornamental Fluvial Superior */}
            <div className="hero-fluvial-ornament" aria-hidden="true">
              <span className="filete-wing filete-wing--left"></span>
              <svg className="filete-star" width="28" height="18" viewBox="0 0 28 18" fill="none">
                <path d="M14 1 L16.5 6.5 L23 9 L16.5 11.5 L14 17 L11.5 11.5 L5 9 L11.5 6.5 Z" fill="#F4B63F" stroke="#FFF6E5" strokeWidth="0.8"/>
                <circle cx="2" cy="9" r="2" fill="#17A9B8"/>
                <circle cx="26" cy="9" r="2" fill="#17A9B8"/>
              </svg>
              <span className="filete-wing filete-wing--right"></span>
            </div>

            <h1 className="hero-headline">
              {headline}
            </h1>

            {/* Filete das Águas Fluviais sob o Título */}
            <div className="hero-river-line" aria-hidden="true">
              <svg width="120" height="8" viewBox="0 0 120 8" fill="none">
                <path d="M0 4 Q 30 1, 60 4 T 120 4" stroke="#17A9B8" strokeWidth="2" strokeLinecap="round"/>
                <polygon points="60,0 64,4 60,8 56,4" fill="#F4B63F" stroke="#FFF6E5" strokeWidth="0.6"/>
              </svg>
            </div>

            <p className="hero-lead">
              {lead}
            </p>

            {/* CTA Principal: Pequena Placa Pintada em Barco Amazônico */}
            <div className="hero-actions">
              <Link href={ctaLink} className="hero-boat-plate-btn" aria-label="Explorar histórias e saberes do Pará">
                <span className="plate-text">{ctaText}</span>
                <span className="plate-arrow" aria-hidden="true">
                  <i className="fa-solid fa-arrow-down"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
