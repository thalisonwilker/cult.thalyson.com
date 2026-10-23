import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { EssaySchema, type Essay } from '../domain/essay';
import { calculateReadingTime } from '../domain/reading-time';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/ensaios');

export async function getAllEssays(includeDrafts = false): Promise<Essay[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith('.md'));

  const essays: Essay[] = [];

  for (const file of mdFiles) {
    const slug = file.name.replace(/\.md$/, '');
    const fullPath = path.join(CONTENT_DIR, file.name);
    const rawContent = await fs.readFile(fullPath, 'utf8');
    const { data: rawFrontmatter, content: body } = matter(rawContent);

    const parsedData = EssaySchema.parse(rawFrontmatter);

    if (!includeDrafts && parsedData.draft) {
      continue;
    }

    const readingTimeMinutes = calculateReadingTime(body);

    essays.push({
      slug,
      data: parsedData,
      body,
      readingTimeMinutes,
    });
  }

  // Ordena decrescente por data de publicação
  essays.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return essays;
}

export async function getEssayBySlug(slug: string): Promise<Essay | null> {
  const essays = await getAllEssays(true);
  return essays.find((e) => e.slug === slug) || null;
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
