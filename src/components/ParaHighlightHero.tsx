import React from 'react';
import Link from 'next/link';
import { withBasePath } from '../domain/routes';

const paraPillars = [
  {
    title: 'Carimbó & Tradição',
    desc: 'O tambor curimbó, a ginga cabocla de Dona Onete e Mestre Verequete.',
    tag: 'Música',
    icon: 'fa-solid fa-drum',
    color: 'var(--color-fusion-red)',
    link: '/?categoria=musica'
  },
  {
    title: 'Guitarrada Elétrica',
    desc: 'O som amazônico das cordas de Mestre Vieira e o merengue das marés.',
    tag: 'Instrumental',
    icon: 'fa-solid fa-guitar',
    color: 'var(--color-orange-hibiscus)',
    link: '/?categoria=musica'
  },
  {
    title: 'O Círio & O Sagrado',
    desc: 'Dois milhões de vozes sob as mangueiras, a corda e os brinquedos de miriti.',
    tag: 'Patrimônio',
    icon: 'fa-solid fa-hands-praying',
    color: 'var(--color-sun-glow)',
    link: '/patrimonio/as-14-procissoes-do-cirio-de-nazare/'
  },
  {
    title: 'Abridores de Letras',
    desc: 'A tipografia vernacular pintada nos barcos fluviais que cruzam o Guajará.',
    tag: 'Artes Visuais',
    icon: 'fa-solid fa-paintbrush',
    color: 'var(--color-electric-cyan)',
    link: '/?categoria=artes'
  }
];

export default function ParaHighlightHero() {
  const bgImage = withBasePath('/images/carimbo-guitarrada-noite.jpg');

  return (
    <section className="para-hero">
      {/* Full-bleed image hero */}
      <div className="hero-fullbleed">
        <img
          src={bgImage}
          alt="Cena noturna de Carimbó e Guitarrada no Pará — cultura amazônica vibrante"
          className="hero-bg-img"
          loading="eager"
        />
        <div className="hero-overlay"></div>

        <div className="hero-inner">
          <div className="location-badge">
            <i className="fa-solid fa-water location-icon" aria-hidden="true"></i>
            <span>Belém do Pará · Amazônia Atlântica</span>
          </div>
          <h1 className="para-hero-title">
            O pulsar da cultura paraense, do banzeiro dos rios ao som das aparelhagens.
          </h1>
          <p className="para-hero-lead">
            Um acervo crítico e afetivo dedicado à música, cinema, literatura cabocla, saberes do Ver-o-Peso e artes visuais do Pará — com pontes e diálogos com o cenário nacional e global.
          </p>
          <div className="hero-cta-row">
            <Link href="/?territorio=para" className="hero-cta-primary">
              <i className="fa-solid fa-book-open" aria-hidden="true"></i>
              Explorar o Acervo
            </Link>
            <Link href="/?territorio=nacional" className="hero-cta-secondary">
              Arte Nacional & Global
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Rainbow accent bar */}
      <div className="accent-bar" aria-hidden="true"></div>

      {/* Pillars Grid */}
      <div className="pillars-grid">
        {paraPillars.map((pillar) => (
          <Link
            key={pillar.title}
            href={pillar.link}
            className="pillar-card"
            style={{ '--accent-color': pillar.color } as React.CSSProperties}
          >
            <div className="pillar-icon-wrap">
              <i className={`pillar-icon ${pillar.icon}`} aria-hidden="true"></i>
            </div>
            <div className="pillar-tag">{pillar.tag}</div>
            <h3 className="pillar-title">{pillar.title}</h3>
            <p className="pillar-desc">{pillar.desc}</p>
            <span className="pillar-link">
              Ler ensaio <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
