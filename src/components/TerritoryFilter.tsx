import React from 'react';
import Link from 'next/link';

interface TerritoryFilterProps {
  currentTerritory?: string;
  currentCategory?: string;
  onSelectTerritory?: (territoryId: string) => void;
}

const territories = [
  { id: 'all', label: 'Todo o Acervo', icon: 'fa-solid fa-layer-group' },
  { id: 'para', label: 'Cultura Paraense & Belém', icon: 'fa-solid fa-water' },
  { id: 'nacional', label: 'Arte Nacional', icon: 'fa-solid fa-landmark' },
  { id: 'global', label: 'Mundo & Clássicos', icon: 'fa-solid fa-earth-americas' }
];

export default function TerritoryFilter({
  currentTerritory,
  currentCategory,
  onSelectTerritory
}: TerritoryFilterProps) {
  function buildUrl(territoryId: string) {
    const params = new URLSearchParams();
    if (territoryId !== 'all') {
      params.set('territorio', territoryId);
    }
    if (currentCategory) {
      params.set('categoria', currentCategory);
    }
    const qs = params.toString();
    return qs ? `/?${qs}#todas-historias` : '/#todas-historias';
  }

  return (
    <div className="territory-filter-bar">
      <div className="filter-lead">
        <span className="filter-label">Escopo Territorial:</span>
      </div>

      <nav className="territory-pills" aria-label="Filtrar ensaios por território">
        {territories.map((t) => {
          const isActive = currentTerritory === t.id || (!currentTerritory && t.id === 'all');
          return (
            <Link
              key={t.id}
              href={buildUrl(t.id)}
              onClick={(e) => {
                if (onSelectTerritory) {
                  e.preventDefault();
                  onSelectTerritory(t.id);
                }
              }}
              className={`territory-pill ${isActive ? 'active' : ''} ${t.id === 'para' ? 'pill-para' : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <i className={`pill-icon ${t.icon}`} aria-hidden="true"></i>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
