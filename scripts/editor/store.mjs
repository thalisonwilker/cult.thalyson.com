import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import matter from 'gray-matter';

export class EditorError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const fail = (message) => {
  throw new EditorError(message);
};

export function validateEssay(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    fail('Ensaio inválido.');
  }

  for (const key of ['slug', 'title', 'description', 'category', 'pubDate', 'body']) {
    if (typeof input[key] !== 'string' || !input[key].trim()) {
      fail(`Preencha o campo obrigatório ${key}.`);
    }
  }

  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail('Use apenas letras minúsculas, números e hífens no endereço (slug).');
  }

  const essay = {
    slug,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    territory: input.territory === 'nacional' || input.territory === 'global' ? input.territory : 'para',
    locality: input.locality ? String(input.locality).trim() : undefined,
    author: input.author ? String(input.author).trim() : 'Thalyson',
    pubDate: input.pubDate.trim(),
    tags: Array.isArray(input.tags)
      ? [...new Set(input.tags.map((t) => String(t).trim().replace(/^#/, '')).filter(Boolean))]
      : [],
    draft: Boolean(input.draft),
    featured: Boolean(input.featured),
    coverImage: input.coverImage ? String(input.coverImage).trim() : undefined,
    coverImagePosition: input.coverImagePosition ? String(input.coverImagePosition).trim() : undefined,
    sources: Array.isArray(input.sources) ? input.sources : [],
    body: input.body.trim(),
  };

  return essay;
}

export function createStore(contentDir) {
  let pending = Promise.resolve();

  async function list() {
    const entries = await readdir(contentDir, { withFileTypes: true });
    const files = entries.filter((e) => e.isFile() && e.name.endsWith('.md'));
    const essays = [];

    for (const file of files) {
      const slug = file.name.replace(/\.md$/, '');
      const filePath = path.join(contentDir, file.name);
      const raw = await readFile(filePath, 'utf8');
      const { data, content } = matter(raw);

      essays.push({
        slug,
        title: data.title || slug,
        category: data.category || 'cultura',
        territory: data.territory || 'para',
        pubDate: data.pubDate ? new Date(data.pubDate).toISOString().slice(0, 10) : '',
        draft: Boolean(data.draft),
        featured: Boolean(data.featured),
      });
    }

    return essays;
  }

  async function get(slug) {
    const filePath = path.join(contentDir, `${slug}.md`);
    try {
      const raw = await readFile(filePath, 'utf8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'cultura',
        territory: data.territory || 'para',
        locality: data.locality || '',
        author: data.author || 'Thalyson',
        pubDate: data.pubDate ? new Date(data.pubDate).toISOString().slice(0, 10) : '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        draft: Boolean(data.draft),
        featured: Boolean(data.featured),
        coverImage: data.coverImage || '',
        coverImagePosition: data.coverImagePosition || '',
        sources: Array.isArray(data.sources) ? data.sources : [],
        body: (content || '').trim(),
      };
    } catch {
      return null;
    }
  }

  async function save(payload) {
    const validated = validateEssay(payload);
    const filePath = path.join(contentDir, `${validated.slug}.md`);

    const frontmatter = {
      title: validated.title,
      description: validated.description,
      pubDate: validated.pubDate,
      category: validated.category,
      territory: validated.territory,
      ...(validated.locality ? { locality: validated.locality } : {}),
      author: validated.author,
      tags: validated.tags,
      draft: validated.draft,
      featured: validated.featured,
      ...(validated.coverImage ? { coverImage: validated.coverImage } : {}),
      ...(validated.coverImagePosition ? { coverImagePosition: validated.coverImagePosition } : {}),
      sources: validated.sources,
    };

    const markdownOutput = matter.stringify(`${validated.body}\n`, frontmatter);
    const tempFile = `${filePath}.${randomUUID()}.tmp`;

    try {
      await writeFile(tempFile, markdownOutput, 'utf8');
      await writeFile(filePath, markdownOutput, 'utf8');
    } finally {
      await unlink(tempFile).catch(() => {});
    }

    return validated;
  }

  async function remove(slug) {
    const filePath = path.join(contentDir, `${slug}.md`);
    await unlink(filePath);
    return { success: true };
  }

  return { list, get, save, remove };
}
