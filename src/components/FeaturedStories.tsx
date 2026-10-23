import React from 'react';
import Link from 'next/link';
import type { Essay } from '../domain/essay';
import { formatDate } from '../domain/reading-time';
import { getEssayUrl, withBasePath } from '../domain/routes';

interface FeaturedStoriesProps {
  stories: Essay[];
}

export default function FeaturedStories({ stories }: FeaturedStoriesProps) {
  const items = stories.slice(0, 3);

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="em-destaque" className="featured-section" aria-label="Histórias em Destaque">
      <div className="section-header-editorial">
        <div className="header-title-wrap">
          <span className="section-tag-editorial">
            <i className="fa-solid fa-star" aria-hidden="true"></i> Seleção da Redação
          </span>
          <h2 className="section-title-editorial">Em Destaque</h2>
        </div>
      </div>

      <div className="featured-grid">
        {items.map((story) => {
          const storyUrl = getEssayUrl(story.data.category, story.slug);
          const rawCover = story.data.coverImage || '/images/carimbo-guitarrada-noite.jpg';
          const resolvedCover = withBasePath(rawCover);

          return (
            <article key={story.slug} className="featured-story-card">
              <Link href={storyUrl} className="card-media-link" tabIndex={-1} aria-hidden="true">
                <div className="card-img-frame">
                  <img
                    src={resolvedCover}
                    alt={`Capa do ensaio: ${story.data.title}`}
                    className="card-img"
                    loading="lazy"
                    style={story.data.coverImagePosition ? { objectPosition: story.data.coverImagePosition } : undefined}
                  />
                  <div className="card-media-overlay" aria-hidden="true"></div>
                </div>
              </Link>

              <div className="card-content">
                <div className="meta-row">
                  {story.data.locality && (
                    <span className="badge-locality">
                      <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                      {story.data.locality}
                    </span>
                  )}
                  {story.data.locality && <span className="meta-bullet" aria-hidden="true">·</span>}
                  <span className="reading-time">
                    <i className="fa-regular fa-clock" aria-hidden="true"></i>
                    {story.readingTimeMinutes} min de leitura
                  </span>
                </div>

                <h3 className="card-title">
                  <Link href={storyUrl} className="title-link">
                    {story.data.title}
                  </Link>
                </h3>

                <p className="card-description">
                  {story.data.description}
                </p>

                <div className="card-footer">
                  <span className="story-date">{formatDate(story.data.pubDate)}</span>
                  <Link href={storyUrl} className="read-more-link">
                    <span>Ler ensaio</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
