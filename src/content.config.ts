import { defineCollection, z } from "astro:content";
import { categoryAliases } from "./site.config";

const travel = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().transform((value) => categoryAliases[value] ?? value),
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
    imageVerified: z.boolean().default(true),
    adsenseReady: z.boolean().default(true),
    draft: z.boolean().default(false)
  })
});

export const collections = { travel };
