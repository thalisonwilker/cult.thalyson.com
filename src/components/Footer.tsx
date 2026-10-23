import React from 'react';
import CultLogo from './CultLogo';

export default function Footer() {
  const year = new Date().getFullYear();
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <footer className="site-footer">
      <div className="signature-bar" aria-hidden="true"></div>

      <div className="footer-container">
        {/* Destaque Central da Marca Fluvial no Rodapé */}
        <div className="footer-brand-spotlight">
          <div className="footer-brand-center">
            <CultLogo variant="footer" />
          </div>
          <p className="manifesto-text-center">
            Espaço pessoal para compartilhar a memória viva, os saberes caboclos, a música, literatura e artes visuais de Belém e da Amazônia Atlântica.
          </p>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {year} <strong>CULT.thalyson.com</strong> — Compartilhando a cultura, a música e as histórias do Pará por Thalyson.
          </p>
          <div className="footer-extra-links">
            {isDev && (
              <a href="http://localhost:3001/admin/" className="dev-admin-link" title="Acessar Painel Administrativo Local">
                Painel Admin [DEV]
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
