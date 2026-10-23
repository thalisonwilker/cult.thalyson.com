import React, { Suspense } from 'react';
import { getAllEssays } from '../src/infrastructure/content-repository';
import { selectFeatured } from '../src/domain/featured';
import HomeContent from './HomeContent';

export default async function HomePage() {
  const allEssays = await getAllEssays();

  // Seleção de até 3 ensaios em destaque (featured: true)
  const featuredCandidates = allEssays.map((e) => ({
    ...e,
    pubDate: e.data.pubDate,
    draft: e.data.draft,
    featured: e.data.featured,
  }));

  const selectedFeaturedList = selectFeatured(featuredCandidates, 3);
  const featuredEssays = selectedFeaturedList as typeof allEssays;

  return (
    <Suspense fallback={<div className="site-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Carregando acervo cultural...</div>}>
      <HomeContent allEssays={allEssays} featuredEssays={featuredEssays} />
    </Suspense>
  );
}
