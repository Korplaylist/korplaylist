import { defineCollection, z } from "astro:content";

const travel = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    region: z.string(),
    tags: z.array(z.string()),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    heroImage: z.string(),
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { travel };
