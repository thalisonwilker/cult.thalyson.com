import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllEssays, getEssayBySlug, renderMarkdownToHtml } from '../../../src/infrastructure/content-repository';
import { formatDate } from '../../../src/domain/reading-time';
import { normalizeSources } from '../../../src/infrastructure/editor-storage';
import { withBasePath } from '../../../src/domain/routes';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

const categoryLabels: Record<string, string> = {
  cinema: 'Arte, Cinema & Imagem',
  literatura: 'Literatura Paraense',
  musica: 'Música & Ritmos',
  ensaios: 'Ensaios & Crítica',
  artes: 'Arte, Cinema & Imagem',
  patrimonio: 'Círio & Patrimônio',
  gastronomia: 'Gastronomia & Saberes',
  cultura: 'Cultura Geral'
};

const territoryLabels: Record<string, string> = {
  para: 'Cultura Paraense',
  nacional: 'Arte Nacional',
  global: 'Mundo'
};

export async function generateStaticParams() {
  const essays = await getAllEssays();
  return essays.map((essay) => ({
    category: essay.data.category.trim().toLowerCase(),
    slug: essay.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay) {
    return {
      title: 'Ensaio não encontrado — CULT',
    };
  }

  return {
    title: `${essay.data.title} — CULT`,
    description: essay.data.description,
    openGraph: {
      type: 'article',
      title: `${essay.data.title} — CULT`,
      description: essay.data.description,
      publishedTime: essay.data.pubDate.toISOString(),
      authors: [essay.data.author],
      tags: essay.data.tags,
    },
  };
}

export default async function EssayDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = await getEssayBySlug(slug);

  if (!essay) {
    notFound();
  }

  const contentHtml = await renderMarkdownToHtml(essay.body);
  const sources = normalizeSources(essay.data.sources);
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <article className="essay-article">
      <header className="article-header">
        <div className="article-meta-top">
          <div className="badges-row">
            <Link
              href={`/?categoria=${essay.data.category}`}
              className="badge-category"
              data-category={essay.data.category}
            >
              {categoryLabels[essay.data.category] || essay.data.category}
            </Link>

            {essay.data.locality ? (
              <span className="badge-locality">
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i> {essay.data.locality}
              </span>
            ) : (
              <span className="badge-territory">{territoryLabels[essay.data.territory]}</span>
            )}

            {isDev && (
              <a
                href={`http://localhost:3001/editor/?slug=${essay.slug}`}
                className="dev-edit-btn"
                title="Editar esta publicação no Editor Local (DEV)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Editar Publicação</span>
              </a>
            )}
          </div>

          <span className="reading-meta">
            <time dateTime={essay.data.pubDate.toISOString()}>
              {formatDate(essay.data.pubDate)}
            </time>
            <span className="separator">·</span>
            <span>{essay.readingTimeMinutes} min de leitura</span>
          </span>
        </div>

        <h1 className="article-title">
          {essay.data.title}
        </h1>

        <p className="article-lead">
          {essay.data.description}
        </p>

        <div className="article-author-bar">
          <span className="author-label">
            Por <strong>{essay.data.author}</strong>
          </span>
          {essay.data.tags.length > 0 && (
            <div className="article-tags">
              {essay.data.tags.map((tag) => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {essay.data.coverImage && (
          <div className="article-cover-wrapper">
            <img
              src={withBasePath(essay.data.coverImage)}
              alt={`Ilustração artística para o ensaio ${essay.data.title}`}
              className="article-cover-img"
              style={essay.data.coverImagePosition ? { objectPosition: essay.data.coverImagePosition } : undefined}
            />
          </div>
        )}
      </header>

      <div className="article-divider"></div>

      <div
        className="article-content prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {sources.length > 0 && (
        <section className="article-sources" aria-label="Fontes e referências consultadas">
          <div className="sources-header">
            <i className="fa-solid fa-book-bookmark" aria-hidden="true"></i>
            <h2 className="sources-title">Fontes &amp; Referências</h2>
          </div>
          <ul className="sources-list">
            {sources.map((s, idx) => (
              <li key={idx} className="source-item">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    <span>{s.title}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  </a>
                ) : (
                  <span className="source-text">{s.title}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="article-footer">
        <div className="back-nav">
          <Link href="/" className="back-link">
            ← Voltar para o acervo cultural
          </Link>
        </div>
      </footer>
    </article>
  );
}
