// src/domain/routes.ts

/**
 * Constrói a URL canônica e padronizada de uma publicação cultural,
 * organizada pela sua respectiva categoria.
 *
 * Sempre inclui barra final (trailing slash) para prevenir redirecionamentos
 * 301 do servidor web e eliminar problemas de portas de acesso em ambientes proxy/Docker.
 */
export function getEssayUrl(category: string, slug: string): string {
  if (!category || !slug) {
    throw new Error('Categoria e slug são obrigatórios para construir a URL do ensaio.');
  }

  const cleanCategory = category.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');

  return `/${cleanCategory}/${cleanSlug}/`;
}

/**
 * Prefixa um caminho relativo ao host com o NEXT_PUBLIC_BASE_PATH se configurado.
 * Ideal para imagens e assets estáticos exportados.
 */
export function withBasePath(path: string): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return path;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}

