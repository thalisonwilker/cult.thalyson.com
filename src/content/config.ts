import { defineCollection, z } from 'astro:content';

const ensaiosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string({
      required_error: 'O título do ensaio é obrigatório'
    }),
    description: z.string({
      required_error: 'A descrição/lead do ensaio é obrigatória'
    }),
    pubDate: z.coerce.date(),
    category: z.enum(['cinema', 'literatura', 'musica', 'ensaios', 'artes'], {
      required_error: 'A categoria deve ser cinema, literatura, musica, ensaios ou artes'
    }),
    author: z.string().default('Thalyson'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional()
  })
});

export const collections = {
  ensaios: ensaiosCollection
};
