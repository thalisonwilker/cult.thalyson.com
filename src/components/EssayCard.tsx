import React from 'react';
import Link from 'next/link';
import { formatDate } from '../domain/reading-time';
import { getEssayUrl, withBasePath } from '../domain/routes';

export interface EssayCardProps {
  title: string;
  description: string;
  slug: string;
  pubDate: Date | string;
  category: string;
  territory?: 'para' | 'nacional' | 'global';
  locality?: string;
  readingTimeMinutes: number;
  coverImage?: string;
  coverImagePosition?: string;
  tags?: string[];
}

const categoryLabels: Record<string, string> = {
  cinema: 'Cinema',
  literatura: 'Literatura',
  musica: 'Música',
  ensaios: 'Ensaios',
  artes: 'Artes Visuais',
  patrimonio: 'Patrimônio',
  gastronomia: 'Gastronomia'
};

const categoryAccents: Record<string, string> = {
  musica: 'var(--color-cult-gold)',
  patrimonio: 'var(--color-cult-coral)',
  cinema: 'var(--color-cult-orange)',
  literatura: 'var(--color-cult-turquoise)',
  artes: 'var(--color-cult-cobalt)',
  ensaios: 'var(--color-cult-turquoise)',
  gastronomia: 'var(--color-cult-orange)'
};

export default function EssayCard({
  title,
  description,
  slug,
  pubDate,
  category,
  territory = 'para',
  locality,
  readingTimeMinutes,
  coverImage,
  coverImagePosition,
  tags = []
}: EssayCardProps) {
  const defaultImage = territory === 'para'
    ? '/images/carimbo-guitarrada-noite.jpg'
    : '/images/belem-noite-estrelada.jpg';

  const rawImageSrc = coverImage || defaultImage;
  const imageSrc = withBasePath(rawImageSrc);
  const essayUrl = getEssayUrl(category, slug);

  const dateObj = typeof pubDate === 'string' ? new Date(pubDate) : pubDate;
  const isoDate = dateObj instanceof Date && !isNaN(dateObj.getTime()) ? dateObj.toISOString() : String(pubDate);

  return (
    <article className="editorial-story-card" data-category={category}>
      <Link href={essayUrl} className="card-thumb-link" tabIndex={-1} aria-hidden="true">
        <div className="card-thumb-frame">
          <img
            src={imageSrc}
            alt={`Imagem de capa: ${title}`}
            className="card-thumb-img"
            loading="lazy"
            style={coverImagePosition ? { objectPosition: coverImagePosition } : undefined}
          />
          <div className="thumb-scrim" aria-hidden="true"></div>
          <span
            className="card-category-tag"
            style={{ '--tag-accent': categoryAccents[category] || 'var(--color-cult-turquoise)' } as React.CSSProperties}
          >
            {categoryLabels[category] || category}
          </span>
        </div>
      </Link>

      <div className="card-content-wrap">
        <div className="card-meta-line">
          {locality ? (
            <span className="badge-locality">
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              {locality}
            </span>
          ) : (
            <span className="badge-territory">
              {territory === 'para' ? 'Pará' : territory === 'nacional' ? 'Brasil' : 'Mundo'}
            </span>
          )}
          <span className="meta-dot" aria-hidden="true">·</span>
          <time dateTime={isoDate} className="card-date">
            {formatDate(dateObj)}
          </time>
          <span className="meta-dot" aria-hidden="true">·</span>
          <span className="card-time">{readingTimeMinutes} min</span>
        </div>

        <h3 className="card-headline">
          <Link href={essayUrl} className="headline-link">
            {title}
          </Link>
        </h3>

        <p className="card-summary">
          {description}
        </p>

        <div className="card-bottom-row">
          <Link href={essayUrl} className="read-action-link">
            <span>Ler ensaio</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </Link>

          {tags.length > 0 && (
            <div className="tags-cluster">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag-pill">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
