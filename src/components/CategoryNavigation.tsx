import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  accent: string;
}

const categories: CategoryItem[] = [
  {
    slug: 'musica',
    name: 'Música & Ritmos',
    desc: 'Do carimbó tradicional e da guitarrada aos sons de aparelhagens e jazz.',
    icon: 'fa-solid fa-drum',
    accent: 'var(--color-cult-gold)'
  },
  {
    slug: 'patrimonio',
    name: 'Círio & Patrimônio',
    desc: 'A fé ribeirinha, a corda, as mangueiras e os saberes orais de Belém.',
    icon: 'fa-solid fa-hands-praying',
    accent: 'var(--color-cult-coral)'
  },
  {
    slug: 'artes',
    name: 'Arte, Cinema & Imagem',
    desc: 'Narrativas audiovisuais, estética dos barcos e vanguardas visuais amazônicas.',
    icon: 'fa-solid fa-camera-retro',
    accent: 'var(--color-cult-cobalt)'
  },
  {
    slug: 'literatura',
    name: 'Literatura Paraense',
    desc: 'Vozes das marés, poéticas da floresta e diálogos com o cânone universal.',
    icon: 'fa-solid fa-book-open',
    accent: 'var(--color-cult-turquoise)'
  }
];

export default function CategoryNavigation() {
  return (
    <section className="explore-culture-section" aria-label="Explore as Vertentes Culturais">
      <div className="section-header-editorial">
        <div className="header-title-wrap">
          <span className="section-tag-editorial">
            <i className="fa-solid fa-compass" aria-hidden="true"></i> Horizontes Editoriais
          </span>
          <h2 className="section-title-editorial">Explore a Cultura</h2>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/?categoria=${cat.slug}`}
            className="category-editorial-card"
            style={{ '--card-accent': cat.accent } as React.CSSProperties}
          >
            <div className="card-accent-bar" aria-hidden="true"></div>
            <div className="card-header-row">
              <i className={`category-icon ${cat.icon}`} aria-hidden="true"></i>
              <span className="view-link-indicator">
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </span>
            </div>
            <h3 className="category-name">{cat.name}</h3>
            <p className="category-desc">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
