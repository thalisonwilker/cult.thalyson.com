import React from 'react';

interface CultLogoProps {
  variant?: 'header' | 'footer' | 'compact';
  className?: string;
  href?: string;
}

export function CultLogo({
  variant = 'header',
  className = '',
  href = '/',
}: CultLogoProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const finalHref = href.startsWith('/') ? `${basePath}${href}` : href;
  const imgSrc = `${basePath}/images/cult-logo-fluvial.png`;

  const variantClassMap = {
    header: 'cult-fluvial-logo--header',
    footer: 'cult-fluvial-logo--footer',
    compact: 'cult-fluvial-logo--compact',
  };

  return (
    <a
      href={finalHref}
      className={`cult-fluvial-logo ${variantClassMap[variant] || 'cult-fluvial-logo--header'} ${className}`}
      aria-label="CULT .thalyson.com — Início (Revista Cultural do Pará & Amazônia)"
    >
      <img
        src={imgSrc}
        alt="Logo CULT .thalyson.com — Pintura vernacular dos abridores de letras dos barcos da Amazônia paraense"
        width={1015}
        height={567}
        loading="eager"
        decoding="async"
        className="cult-logo-img"
      />
    </a>
  );
}

export default CultLogo;
