import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const CATEGORIES_PATH = path.join(ROOT_DIR, 'src', 'data', 'categories.json');
const ESSAYS_DIR = path.join(ROOT_DIR, 'src', 'content', 'ensaios');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');

export interface CategoryItem {
  value: string;
  label: string;
}

export interface EssayData {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  category: string;
  territory: 'para' | 'nacional' | 'global';
  locality?: string;
  author: string;
  tags: string[];
  draft: boolean;
  coverImage?: string;
  coverImagePosition?: string;
  body: string;
}

export interface EssaySummary {
  slug: string;
  title: string;
  category: string;
  territory: string;
  pubDate: string;
  author: string;
  draft: boolean;
}

/** Lê as categorias do arquivo JSON */
export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const raw = await fs.readFile(CATEGORIES_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [
      { value: 'cinema', label: 'Cinema' },
      { value: 'literatura', label: 'Literatura' },
      { value: 'musica', label: 'Música' },
      { value: 'ensaios', label: 'Ensaios' },
      { value: 'artes', label: 'Artes' },
      { value: 'patrimonio', label: 'Patrimônio' },
      { value: 'gastronomia', label: 'Gastronomia' }
    ];
  }
}

/** Salva as categorias no arquivo JSON */
export async function saveCategories(categories: CategoryItem[]): Promise<CategoryItem[]> {
  if (!Array.isArray(categories)) {
    throw new Error('Categorias devem ser um array no formato JSON.');
  }

  const cleaned = categories
    .map((item) => ({
      value: String(item.value || '').trim().toLowerCase(),
      label: String(item.label || '').trim()
    }))
    .filter((item) => item.value.length > 0 && item.label.length > 0);

  // Evita duplicatas por value
  const seen = new Set<string>();
  const uniqueCategories: CategoryItem[] = [];
  for (const cat of cleaned) {
    if (!seen.has(cat.value)) {
      seen.add(cat.value);
      uniqueCategories.push(cat);
    }
  }

  await fs.mkdir(path.dirname(CATEGORIES_PATH), { recursive: true });
  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(uniqueCategories, null, 2) + '\n', 'utf-8');
  return uniqueCategories;
}

/** Adiciona uma categoria ao JSON de categorias */
export async function addCategory(item: CategoryItem): Promise<CategoryItem[]> {
  const current = await getCategories();
  const val = String(item.value || '').trim().toLowerCase();
  const lab = String(item.label || '').trim();

  if (!val || !lab) {
    throw new Error('Identificador (slug) e Nome da categoria são obrigatórios.');
  }

  if (current.some((c) => c.value === val)) {
    throw new Error(`A categoria com identificador "${val}" já existe.`);
  }

  const updated = [...current, { value: val, label: lab }];
  return saveCategories(updated);
}

/** Atualiza o nome (label) de uma categoria existente */
export async function updateCategory(value: string, newLabel: string): Promise<CategoryItem[]> {
  const current = await getCategories();
  const val = String(value || '').trim().toLowerCase();
  const lab = String(newLabel || '').trim();

  if (!val || !lab) {
    throw new Error('Identificador e Novo Nome são obrigatórios.');
  }

  const idx = current.findIndex((c) => c.value === val);
  if (idx === -1) {
    throw new Error(`Categoria "${val}" não encontrada.`);
  }

  current[idx].label = lab;
  return saveCategories(current);
}

/** Remove uma categoria do JSON de categorias */
export async function deleteCategory(value: string): Promise<CategoryItem[]> {
  const current = await getCategories();
  const val = String(value || '').trim().toLowerCase();
  const filtered = current.filter((c) => c.value !== val);
  return saveCategories(filtered);
}

/** Parse simples e determinístico de frontmatter YAML de um ensaio */
export function parseEssayMarkdown(raw: string, slug: string): EssayData {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return {
      slug,
      title: slug,
      description: '',
      pubDate: new Date().toISOString().split('T')[0],
      category: 'ensaios',
      territory: 'para',
      author: 'Thalyson',
      tags: [],
      draft: false,
      body: raw
    };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  let title = slug;
  let description = '';
  let pubDate = new Date().toISOString().split('T')[0];
  let category = 'ensaios';
  let territory: 'para' | 'nacional' | 'global' = 'para';
  let locality: string | undefined;
  let author = 'Thalyson';
  let tags: string[] = [];
  let draft = false;
  let coverImage: string | undefined;
  let coverImagePosition: string | undefined;

  for (const line of frontmatterStr.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();

    // Remove aspas simples ou duplas ao redor do valor
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    switch (key) {
      case 'title':
        title = val;
        break;
      case 'description':
        description = val;
        break;
      case 'pubDate': {
        const d = new Date(val);
        pubDate = isNaN(d.getTime()) ? val : d.toISOString().split('T')[0];
        break;
      }
      case 'category':
        category = val;
        break;
      case 'territory':
        if (val === 'para' || val === 'nacional' || val === 'global') {
          territory = val;
        }
        break;
      case 'locality':
        locality = val || undefined;
        break;
      case 'author':
        author = val || 'Thalyson';
        break;
      case 'draft':
        draft = val.toLowerCase() === 'true';
        break;
      case 'coverImage':
        coverImage = val || undefined;
        break;
      case 'coverImagePosition':
        coverImagePosition = val || undefined;
        break;
      case 'tags':
        try {
          if (val.startsWith('[') && val.endsWith(']')) {
            const parsedTags = JSON.parse(val);
            if (Array.isArray(parsedTags)) {
              tags = parsedTags.map(String);
            }
          } else {
            tags = val.split(',').map((t) => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
          }
        } catch {
          tags = val.replace(/[\[\]"]/g, '').split(',').map((t) => t.trim()).filter(Boolean);
        }
        break;
    }
  }

  return {
    slug,
    title,
    description,
    pubDate,
    category,
    territory,
    locality,
    author,
    tags,
    draft,
    coverImage,
    coverImagePosition,
    body
  };
}

/** Formata dados de ensaio em Markdown completo com frontmatter */
export function formatEssayMarkdown(data: EssayData): string {
  const safeTitle = (data.title || '').replace(/"/g, '\\"');
  const safeDesc = (data.description || '').replace(/"/g, '\\"');
  const safeAuthor = (data.author || 'Thalyson').replace(/"/g, '\\"');
  const safeCategory = (data.category || 'ensaios').trim();
  const safeTerritory = data.territory || 'para';
  const safePubDate = data.pubDate || new Date().toISOString().split('T')[0];
  const safeDraft = Boolean(data.draft);
  const safeTags = (data.tags || []).map((t) => `"${t.replace(/"/g, '')}"`).join(', ');

  let fm = `---\n`;
  fm += `title: "${safeTitle}"\n`;
  fm += `description: "${safeDesc}"\n`;
  fm += `pubDate: ${safePubDate}\n`;
  fm += `category: "${safeCategory}"\n`;
  fm += `territory: "${safeTerritory}"\n`;
  if (data.locality && data.locality.trim()) {
    fm += `locality: "${data.locality.trim().replace(/"/g, '\\"')}"\n`;
  }
  fm += `author: "${safeAuthor}"\n`;
  fm += `tags: [${safeTags}]\n`;
  fm += `draft: ${safeDraft}\n`;
  if (data.coverImage && data.coverImage.trim()) {
    fm += `coverImage: "${data.coverImage.trim()}"\n`;
  }
  if (data.coverImagePosition && data.coverImagePosition.trim()) {
    fm += `coverImagePosition: "${data.coverImagePosition.trim()}"\n`;
  }
  fm += `---\n\n`;
  fm += (data.body || '').trimStart();
  return fm;
}

/** Lista todos os ensaios em src/content/ensaios/ */
export async function listEssays(): Promise<EssaySummary[]> {
  try {
    const files = await fs.readdir(ESSAYS_DIR);
    const mdFiles = files.filter((f: string) => f.endsWith('.md'));

    const list: EssaySummary[] = [];
    for (const filename of mdFiles) {
      const slug = filename.replace(/\.md$/, '');
      const filepath = path.join(ESSAYS_DIR, filename);
      const raw = await fs.readFile(filepath, 'utf-8');
      const parsed = parseEssayMarkdown(raw, slug);
      list.push({
        slug,
        title: parsed.title,
        category: parsed.category,
        territory: parsed.territory,
        pubDate: parsed.pubDate,
        author: parsed.author,
        draft: parsed.draft
      });
    }

    // Ordena do mais recente ao mais antigo
    list.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    return list;
  } catch {
    return [];
  }
}

/** Obtém um ensaio específico pelo slug */
export async function getEssay(slug: string): Promise<EssayData | null> {
  const safeSlug = slug.replace(/[^a-z0-9_-]/gi, '').toLowerCase();
  const filepath = path.join(ESSAYS_DIR, `${safeSlug}.md`);
  try {
    const raw = await fs.readFile(filepath, 'utf-8');
    return parseEssayMarkdown(raw, safeSlug);
  } catch {
    return null;
  }
}

/** Salva ou atualiza um ensaio no filesystem local */
export async function saveEssay(
  data: EssayData,
  originalSlug?: string
): Promise<{ ok: boolean; slug: string; path: string }> {
  if (!data.title || !data.title.trim()) {
    throw new Error('O título do ensaio é obrigatório.');
  }

  const generatedSlug = data.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const slug = (data.slug && data.slug.trim()) ? data.slug.trim() : generatedSlug;
  const safeSlug = slug.replace(/[^a-z0-9_-]/gi, '').toLowerCase();
  if (!safeSlug) {
    throw new Error('Slug inválido para o arquivo.');
  }

  const markdownContent = formatEssayMarkdown({
    ...data,
    slug: safeSlug
  });

  await fs.mkdir(ESSAYS_DIR, { recursive: true });
  const targetPath = path.join(ESSAYS_DIR, `${safeSlug}.md`);
  await fs.writeFile(targetPath, markdownContent, 'utf-8');

  // Se o slug mudou em relação ao original, remove o arquivo anterior para não duplicar
  if (originalSlug && originalSlug.trim() && originalSlug !== safeSlug) {
    const safeOriginal = originalSlug.replace(/[^a-z0-9_-]/gi, '').toLowerCase();
    const oldPath = path.join(ESSAYS_DIR, `${safeOriginal}.md`);
    try {
      await fs.unlink(oldPath);
    } catch {
      // Ignora se o arquivo antigo não existir
    }
  }

  return {
    ok: true,
    slug: safeSlug,
    path: `src/content/ensaios/${safeSlug}.md`
  };
}

/** Salva uma imagem recebida via upload local em public/images/ */
export async function saveImageLocally(
  filename: string,
  buffer: Buffer
): Promise<{ ok: boolean; path: string }> {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-');

  const safeFilename = `${base}${ext}`;
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const targetPath = path.join(IMAGES_DIR, safeFilename);
  await fs.writeFile(targetPath, buffer);

  return {
    ok: true,
    path: `/images/${safeFilename}`
  };
}

/** Exclui um ensaio/publicação do filesystem local */
export async function deleteEssay(slug: string): Promise<boolean> {
  const safeSlug = slug.replace(/[^a-z0-9_-]/gi, '').toLowerCase();
  if (!safeSlug) {
    throw new Error('Slug inválido para exclusão.');
  }
  const filepath = path.join(ESSAYS_DIR, `${safeSlug}.md`);
  try {
    await fs.unlink(filepath);
    return true;
  } catch (err: any) {
    if (err && err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
