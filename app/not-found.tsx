import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-badge">Erro 404</div>
      <h1 className="not-found-title">Caminho pelas águas não encontrado</h1>
      <p className="not-found-text">
        Assim como um barco que desvia da rota na Baía do Guajará, esta página não pôde ser localizada.
        Retorne à margem segura para continuar navegando pelos saberes e artes do Pará.
      </p>
      <Link href="/" className="not-found-button">
        <i className="fa-solid fa-house" aria-hidden="true"></i>
        Voltar para o Início
      </Link>
    </div>
  );
}
