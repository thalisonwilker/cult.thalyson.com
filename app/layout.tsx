import type { Metadata } from 'next';
import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import '../src/styles/tokens.css';
import '../src/styles/global.css';
import '../src/styles/components.css';

export const metadata: Metadata = {
  title: 'CULT — Compartilhando a Cultura do Pará, Belém & Artes',
  description: 'Espaço pessoal para compartilhar a música, tradições, literatura cabocla, cinema e artes visuais do Pará e de Belém com o mundo.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://cult.thalyson.com',
    title: 'CULT — Compartilhando a Cultura do Pará, Belém & Artes',
    description: 'Espaço pessoal para compartilhar a música, tradições, literatura cabocla, cinema e artes visuais do Pará e de Belém com o mundo.',
    siteName: 'CULT',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var saved = localStorage.getItem('cult-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body>
        <Header />
        <main className="site-main site-main--full-bleed">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
