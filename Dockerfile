# ==============================================================================
# Multi-stage Dockerfile para cult.thalyson.com (Astro SSG + Nginx unprivileged)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build da aplicação estática
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Instalação limpa e determinística de dependências
COPY package.json package-lock.json ./
RUN npm ci

# Cópia do código-fonte
COPY . .

# Compilação estática do Astro (saída em /app/dist)
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Runtime enxuto e seguro com Nginx desprivilegiado (non-root)
# ------------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Copia configuração otimizada do Nginx para porta 8080
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copia os artefatos estáticos compilados pelo Astro
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Expõe a porta desprivilegiada 8080
EXPOSE 8080

# Healthcheck do container para probes de orquestradores (Fly.io, K8s, Docker)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
