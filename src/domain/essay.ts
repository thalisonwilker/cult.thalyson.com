import { z } from 'zod';

export const EssaySchema = z.object({
  name: z.string().optional(),
  alwaysApply: z.boolean().optional(),
  title: z.string({
    required_error: 'O título do ensaio é obrigatório',
  }),
  description: z.string({
    required_error: 'A descrição/lead do ensaio é obrigatória',
  }),
  pubDate: z.coerce.date(),
  category: z.string({
    required_error: 'A categoria cultural do ensaio é obrigatória',
  }).min(1, 'A categoria cultural não pode ser vazia'),
  territory: z.enum(['para', 'nacional', 'global']).default('para'),
  locality: z.string().optional(),
  author: z.string().default('Thalyson'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  coverImage: z.string().optional(),
  coverImagePosition: z.string().optional(),
  sources: z.array(
    z.union([
      z.string(),
      z.object({
        title: z.string(),
        url: z.string().optional(),
      }),
    ])
  ).default([]),
});

export type EssayFrontmatter = z.infer<typeof EssaySchema>;

export interface Essay {
  slug: string;
  data: EssayFrontmatter;
  body: string;
  readingTimeMinutes: number;
}
