import "server-only"

import { getDb, schema } from "@/db"
import { LOCALES, type Locale } from "@/i18n/config"
import { desc, eq, inArray } from "drizzle-orm"

import { getMediaItemsByIds } from "@/features/media/data/media"
import type { MediaItem } from "@/features/media/types"

import type { PostInput, PostStatus } from "./schema"

export type PostListItem = {
  id: string
  publishedAt: string
  pinned: boolean
  updatedAt: string
  translations: {
    locale: Locale
    title: string
    slug: string
    status: PostStatus
  }[]
}

export async function listPostsForAdmin(): Promise<PostListItem[]> {
  const db = getDb()
  const posts = await db
    .select()
    .from(schema.post)
    .orderBy(desc(schema.post.publishedAt), desc(schema.post.createdAt))

  if (posts.length === 0) return []

  const translations = await db
    .select()
    .from(schema.postTranslation)
    .where(
      inArray(
        schema.postTranslation.postId,
        posts.map((item) => item.id)
      )
    )

  return posts.map((item) => {
    const own = translations.filter((row) => row.postId === item.id)
    const lastEdit = Math.max(
      item.updatedAt.getTime(),
      ...own.map((row) => row.updatedAt.getTime())
    )

    return {
      id: item.id,
      publishedAt: item.publishedAt,
      pinned: item.pinned,
      updatedAt: new Date(lastEdit).toISOString(),
      translations: LOCALES.flatMap((locale) => {
        const row = own.find((translation) => translation.locale === locale)
        return row
          ? [
              {
                locale,
                title: row.title,
                slug: row.slug,
                status: row.status as PostStatus,
              },
            ]
          : []
      }),
    }
  })
}

export type PostFormData = {
  values: PostInput
  cover: MediaItem | null
}

export async function getPostForAdmin(
  id: string
): Promise<PostFormData | null> {
  const db = getDb()
  const [row] = await db
    .select()
    .from(schema.post)
    .where(eq(schema.post.id, id))
    .limit(1)

  if (!row) return null

  const translations = await db
    .select()
    .from(schema.postTranslation)
    .where(eq(schema.postTranslation.postId, id))

  const media = await getMediaItemsByIds([row.coverId])

  return {
    values: {
      coverId: row.coverId,
      publishedAt: row.publishedAt,
      pinned: row.pinned,
      translations: LOCALES.flatMap((locale) => {
        const translation = translations.find((item) => item.locale === locale)
        return translation
          ? [
              {
                locale,
                title: translation.title,
                slug: translation.slug,
                description: translation.description,
                content: translation.content,
                status: translation.status as PostStatus,
              },
            ]
          : []
      }),
    },
    cover: row.coverId ? (media.get(row.coverId) ?? null) : null,
  }
}
