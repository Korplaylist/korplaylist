import { defineCollection, z } from "astro:content";

const travel = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    region: z.string(),
    locale: z.enum(["ko", "en", "ja"]).default("ko"),
    translationKey: z.string().optional(),
    regionSlug: z.string().optional(),
    urlSlug: z.string().optional(),
    tags: z.array(z.string()),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    heroImage: z.string(),
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    adsenseReady: z.boolean().default(true),
    draft: z.boolean().default(false)
  })
});

export const collections = { travel };
