import { z } from "zod"

export const bookmarkSchema = z.object({
  categoryId: z.uuid("Pick a category."),
  title: z.string().trim().min(1, "Title is required.").max(200),
  url: z.url({ protocol: /^https?$/, error: "Enter a full URL (https://…)." }),
  author: z.string().trim().max(100),
  note: z.string().trim().max(400),
  icon: z.object({
    slug: z.string().max(100).nullable(),
    mediaId: z.uuid().nullable(),
  }),
  bookmarkedAt: z.iso.date("Pick a date."),
})

export type BookmarkInput = z.infer<typeof bookmarkSchema>
