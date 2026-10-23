'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Essay } from '../src/domain/essay';
import EditorialHero from '../src/components/EditorialHero';
import FeaturedStories from '../src/components/FeaturedStories';
import CategoryNavigation from '../src/components/CategoryNavigation';
import TerritoryFilter from '../src/components/TerritoryFilter';
import EssayCard from '../src/components/EssayCard';

interface HomeContentProps {
  allEssays: Essay[];
  featuredEssays: Essay[];
}

const categoryLabels: Record<string, string> = {
  musica: 'Música & Ritmos',
  patrimonio: 'Círio & Patrimônio',
  artes: 'Arte, Cinema & Imagem',
  cinema: 'Arte, Cinema & Imagem',
  literatura: 'Literatura Paraense'
};

export default function HomeContent({ allEssays, featuredEssays }: HomeContentProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('categoria') || undefined;
  const currentTerritory = searchParams.get('territorio') || undefined;

  const isFilterActive = Boolean(currentCategory || (currentTerritory && currentTerritory !== 'all'));

  // Filtragem no cliente
  const filteredEssays = allEssays.filter((essay) => {
    const matchCategory = currentCategory
      ? (currentCategory === 'artes'
          ? (essay.data.category === 'artes' || essay.data.category === 'cinema')
          : essay.data.category === currentCategory)
      : true;

    const matchTerritory = currentTerritory && currentTerritory !== 'all'
      ? essay.data.territory === currentTerritory
      : true;

    return matchCategory && matchTerritory;
  });

  const hasFeatured = featuredEssays.length > 0;

  if (isFilterActive) {
    return (
      <section className="filtered-view-section">
        <div className="filtered-header">
          <div className="filtered-breadcrumbs">
            <Link href="/" className="crumb-link">Início</Link>
            <span className="crumb-divider">/</span>
            <span className="crumb-current">
              {currentCategory ? `Categoria: ${categoryLabels[currentCategory] || currentCategory}` : ''}
              {currentCategory && currentTerritory ? ' · ' : ''}
              {currentTerritory ? `Território: ${currentTerritory}` : ''}
            </span>
          </div>

          <h1 className="filtered-title">
            {currentTerritory === 'para' && 'Acervo do Pará & Belém'}
            {currentTerritory === 'nacional' && 'Arte Nacional Contemporânea'}
            {currentTerritory === 'global' && 'Mundo & Clássicos Universais'}
            {currentCategory && !currentTerritory && `Vertente: ${(categoryLabels[currentCategory] || currentCategory).toUpperCase()}`}
          </h1>

          <span className="filtered-count">
            {filteredEssays.length} {filteredEssays.length === 1 ? 'ensaio encontrado' : 'ensaios encontrados'}
          </span>
        </div>

        <TerritoryFilter
          currentTerritory={currentTerritory}
          currentCategory={currentCategory}
        />

        {filteredEssays.length > 0 ? (
          <div className="editorial-cards-grid">
            {filteredEssays.map((essay) => (
              <EssayCard
                key={essay.slug}
                title={essay.data.title}
                description={essay.data.description}
                slug={essay.slug}
                pubDate={essay.data.pubDate}
                category={essay.data.category}
                territory={essay.data.territory}
                locality={essay.data.locality}
                readingTimeMinutes={essay.readingTimeMinutes}
                coverImage={essay.data.coverImage}
                coverImagePosition={essay.data.coverImagePosition}
                tags={essay.data.tags}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-editorial">
            <i className="fa-solid fa-compass empty-icon" aria-hidden="true"></i>
            <h2 className="empty-title">Nenhum ensaio localizado para estes filtros</h2>
            <p className="empty-text">Experimente explorar outra vertente ou retorne ao acervo completo da revista.</p>
            <Link href="/" className="empty-action-btn">Ver todo o acervo</Link>
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="magazine-home-layout">
      {/* 1. Editorial Hero Cinematográfico Full-Width */}
      <EditorialHero
        headline="Belém entre arte, música e memória amazônica"
        lead="Das margens caudalosas do Guajará aos acordes elétricos das periferias: um mergulho nas sonoridades, saberes ribeirinhos e vanguardas estéticas do Pará."
        coverImage="/images/docas-belem-noite-estrelada.jpg"
        ctaLink={hasFeatured ? '#em-destaque' : '#todas-historias'}
        ctaText="Explorar histórias"
      />

      <div className="site-container">
        {/* 2. Bloco Em Destaque (Grade de até 3 cards de mesmo peso) */}
        {hasFeatured && (
          <FeaturedStories
            stories={featuredEssays}
          />
        )}

        {/* 3. Bloco Explore a Cultura (Vertentes Editoriais) */}
        <CategoryNavigation />

        {/* 4. Bloco Últimas Histórias com Filtro Territorial */}
        <section id="todas-historias" className="latest-stories-section" aria-label="Todas as Histórias Recentes">
          <div className="section-header-editorial">
            <div className="header-title-wrap">
              <span className="section-tag-editorial">
                <i className="fa-solid fa-feather-pointed" aria-hidden="true"></i> Arquivo Aberto
              </span>
              <h2 className="section-title-editorial">Últimas Histórias</h2>
            </div>
          </div>

          <TerritoryFilter
            currentTerritory={currentTerritory}
            currentCategory={currentCategory}
          />

          <div className="editorial-cards-grid">
            {allEssays.map((essay) => (
              <EssayCard
                key={essay.slug}
                title={essay.data.title}
                description={essay.data.description}
                slug={essay.slug}
                pubDate={essay.data.pubDate}
                category={essay.data.category}
                territory={essay.data.territory}
                locality={essay.data.locality}
                readingTimeMinutes={essay.readingTimeMinutes}
                coverImage={essay.data.coverImage}
                coverImagePosition={essay.data.coverImagePosition}
                tags={essay.data.tags}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
