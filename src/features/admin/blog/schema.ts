import { LOCALES } from "@/i18n/config"
import { z } from "zod"

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const POST_STATUSES = ["draft", "published"] as const
export type PostStatus = (typeof POST_STATUSES)[number]

export const translationSchema = z.object({
  locale: z.enum(LOCALES),
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(120)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and dashes."),
  description: z.string().trim().max(300),
  content: z.string().max(200_000),
  status: z.enum(POST_STATUSES),
})

export const postSchema = z
  .object({
    coverId: z.uuid().nullable(),
    publishedAt: z.iso.date("Pick a date."),
    pinned: z.boolean(),
    translations: z.array(translationSchema).min(1),
  })
  .refine(
    (value) =>
      new Set(value.translations.map((item) => item.locale)).size ===
      value.translations.length,
    { path: ["translations"], message: "Each language can appear once." }
  )

export type TranslationInput = z.infer<typeof translationSchema>
export type PostInput = z.infer<typeof postSchema>
