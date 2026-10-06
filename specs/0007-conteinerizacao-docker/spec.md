---
name: spec
description: Contrato da feature de conteinerização em imagem única Docker para exportação e deploy.
alwaysApply: true
---

# Spec — 0007 Conteinerização da Aplicação em Imagem Docker Única

> **Fonte da verdade.** Status: aprovado
> Contrato de entrega para empacotamento, exportação e execução do portal cult.thalyson.com em contêiner Docker autossuficiente e seguro.

## Resumo
Empacotar o portal cult.thalyson.com em uma única imagem Docker multi-stage enxuta (~25MB) baseada em Alpine Linux e Nginx desprivilegiado (non-root), capaz de compilar a aplicação estática Astro SSG, servir páginas e mídias com compressão, cache otimizado e cabeçalhos de segurança, e estar pronta para exportação e deploy em ambientes como Fly.io, Docker Compose e Kubernetes.

## Critérios de aceite

### AC-1: Multi-stage Build Determinístico e Enxuto
- **Dado** o código-fonte do portal com suas dependências declaradas em `package.json` e `package-lock.json`
- **Quando** o comando `docker build -t cult-thalyson:latest .` for executado na raiz do projeto
- **Então** o processo de build multi-stage deve compilar o site estático via Node Alpine (`npm ci` e `npm run build`), transferir estritamente os artefatos compilados de `dist/` para a imagem final Nginx Alpine desprivilegiada, ignorando arquivos de desenvolvimento via `.dockerignore`, gerando uma imagem única com tamanho reduzido (< 50MB).

### AC-2: Execução Segura em Modo Desprivilegiado (Non-Root)
- **Dado** a imagem Docker construída
- **Quando** o contêiner for iniciado na porta padrão (8080)
- **Então** o processo principal do Nginx deve rodar sob um usuário desprivilegiado (non-root / UID 101 `nginx`), expondo e respondendo requisições HTTP na porta 8080 sem requerer privilégios de superusuário (`root`).

### AC-3: Roteamento Estático e Suporte a URLs Limpas do Astro
- **Dado** o contêiner em execução
- **Quando** uma requisição HTTP for enviada para a raiz (`/`), para uma subpágina com trailing slash ou sem (`/ensaios/` ou `/ensaios`), ou para uma rota não existente
- **Então** o Nginx deve resolver corretamente os diretórios e arquivos indexados (`$uri $uri/ $uri.html =404`), responder com status 200 para páginas válidas e retornar a página customizada de erro 404 do Astro com status 404 quando o recurso não for encontrado.

### AC-4: Otimização de Performance, Compressão e Cache de Assets
- **Dado** o contêiner servindo os arquivos
- **Quando** o cliente solicitar páginas HTML, fontes, scripts ou imagens
- **Então** o Nginx deve fornecer compressão gzip habilitada para tipos de texto/código (HTML, CSS, JS, SVG, JSON) e aplicar políticas de cache diferenciadas:
  - Assets com hash em `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable`
  - Documentos HTML: `Cache-Control: public, max-age=0, must-revalidate`

### AC-5: Cabeçalhos de Segurança e Endpoint de Healthcheck
- **Dado** o contêiner em execução
- **Quando** qualquer requisição for processada ou uma verificação for feita no endpoint `/healthz`
- **Então** as respostas devem conter os cabeçalhos de segurança fundamentais (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`) e o endpoint `/healthz` deve retornar status HTTP 200 imediato para probes de orquestradores (Fly.io, K8s, Docker Healthcheck).

### AC-6: Scripts e Comandos de Suporte no package.json
- **Dado** o ambiente local de desenvolvimento com Docker instalado
- **Quando** o desenvolvedor executar `npm run docker:build` ou `npm run docker:run`
- **Então** a imagem deve ser compilada e executada localmente de forma padronizada mapeando a porta 8080.

## Matriz de decisão

| Cenário de Requisição | Rota solicitada | Arquivo correspondente | Status HTTP | Cabeçalho Cache-Control | AC |
|-----------------------|-----------------|------------------------|-------------|-------------------------|------|
| Home Portal | `/` | `/usr/share/nginx/html/index.html` | 200 OK | `public, max-age=0, must-revalidate` | AC-3, AC-4 |
| Página de Conteúdo | `/ensaios` | `/usr/share/nginx/html/ensaios/index.html` | 200 OK | `public, max-age=0, must-revalidate` | AC-3, AC-4 |
| Asset estático com hash | `/_astro/foo.123.css` | `/usr/share/nginx/html/_astro/foo.123.css` | 200 OK | `public, max-age=31536000, immutable` | AC-4 |
| Imagem pública | `/images/docas-belem.jpg` | `/usr/share/nginx/html/images/docas-belem.jpg` | 200 OK | `public, max-age=86400` | AC-4 |
| Rota inexistente | `/pagina-fantasma` | `/usr/share/nginx/html/404.html` | 404 Not Found | `no-cache` | AC-3 |
| Healthcheck Probe | `/healthz` | Direct Nginx inline return | 200 OK | `no-cache` | AC-5 |

## Casos de borda e erros
- Falha de compilação do Astro no stage de build: o build do Docker deve falhar com código de saída diferente de zero, sem gerar imagem final inconsistente.
- Arquivos de desenvolvimento vazando na imagem final: o `.dockerignore` deve filtrar estritamente diretórios como `node_modules`, `.astro`, `docs`, `specs`, `.git`, `.gemini`.
- Requisições malformadas ou com path traversal: o Nginx deve rejeitar ou normalizar sem expor o sistema de arquivos interno.

## Fora de escopo
- Implementação de autenticação básica HTTP dentro do container de produção (o portal é estático e público).
- Servidor de SSR dinâmico em Node.js (o Astro opera como SSG estático).
- Configuração de certificados SSL/TLS dentro do container (o SSL é terminado no proxy de borda / CDN / Fly.io).

## Rastreabilidade
- ADR relacionado: [ADR-0005: Infraestrutura e Deploy com Docker no Fly.io](../../docs/architecture/adr/0005-infra-docker-flyio.md)
- Stack: Astro SSG + Docker Multi-Stage + Nginx unprivileged Alpine
