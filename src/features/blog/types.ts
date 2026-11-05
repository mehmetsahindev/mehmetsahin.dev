import type { Locale } from "@/i18n/config"

export type PostSummary = {
  /** Id of the post (shared by all its translations). */
  id: string
  locale: Locale
  slug: string
  title: string
  /** As written; may be empty. */
  description: string
  /** Description, or an excerpt of the content when it is empty. */
  summary: string
  coverUrl: string | null
  /** "YYYY-MM-DD". */
  publishedAt: string
  /** ISO date of the translation's last edit. */
  updatedAt: string
  pinned: boolean
}

export type PostDetail = PostSummary & {
  content: string
  /** Cover size in pixels, for Open Graph. */
  coverWidth: number | null
  coverHeight: number | null
  /** Published versions of this post, including this one. */
  translations: { locale: Locale; slug: string }[]
}
