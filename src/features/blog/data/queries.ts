import "server-only"

import { unstable_cache } from "next/cache"
import { getDb, schema } from "@/db"
import type { Locale } from "@/i18n/config"
import { and, desc, eq } from "drizzle-orm"

import { getMediaUrl } from "@/features/media/lib/constants"

import type { PostDetail, PostSummary } from "../types"

/** Cache tag for blog content; admin actions expire it after saving. */
export const BLOG_TAG = "blog"

const { post, postTranslation, media } = schema

/** Published translations of one locale, pinned first, newest first. */
export const getPublishedPosts = unstable_cache(
  async (locale: Locale): Promise<PostSummary[]> => {
    const rows = await getDb()
      .select({
        id: post.id,
        slug: postTranslation.slug,
        title: postTranslation.title,
        description: postTranslation.description,
        publishedAt: post.publishedAt,
        updatedAt: postTranslation.updatedAt,
        pinned: post.pinned,
        coverKey: media.key,
      })
      .from(postTranslation)
      .innerJoin(post, eq(post.id, postTranslation.postId))
      .leftJoin(media, eq(media.id, post.coverId))
      .where(
        and(
          eq(postTranslation.locale, locale),
          eq(postTranslation.status, "published")
        )
      )
      .orderBy(desc(post.pinned), desc(post.publishedAt), desc(post.createdAt))

    return rows.map(({ coverKey, updatedAt, ...row }) => ({
      ...row,
      locale,
      updatedAt: updatedAt.toISOString(),
      coverUrl: coverKey ? getMediaUrl(coverKey) : null,
    }))
  },
  ["published-posts"],
  { tags: [BLOG_TAG] }
)

export const getPublishedPost = unstable_cache(
  async (locale: Locale, slug: string): Promise<PostDetail | null> => {
    const db = getDb()

    const [row] = await db
      .select({
        id: post.id,
        slug: postTranslation.slug,
        title: postTranslation.title,
        description: postTranslation.description,
        content: postTranslation.content,
        publishedAt: post.publishedAt,
        updatedAt: postTranslation.updatedAt,
        pinned: post.pinned,
        coverKey: media.key,
      })
      .from(postTranslation)
      .innerJoin(post, eq(post.id, postTranslation.postId))
      .leftJoin(media, eq(media.id, post.coverId))
      .where(
        and(
          eq(postTranslation.locale, locale),
          eq(postTranslation.slug, slug),
          eq(postTranslation.status, "published")
        )
      )
      .limit(1)

    if (!row) return null

    const translations = await db
      .select({ locale: postTranslation.locale, slug: postTranslation.slug })
      .from(postTranslation)
      .where(
        and(
          eq(postTranslation.postId, row.id),
          eq(postTranslation.status, "published")
        )
      )

    const { coverKey, updatedAt, ...rest } = row

    return {
      ...rest,
      locale,
      updatedAt: updatedAt.toISOString(),
      coverUrl: coverKey ? getMediaUrl(coverKey) : null,
      translations: translations as PostDetail["translations"],
    }
  },
  ["published-post"],
  { tags: [BLOG_TAG] }
)

/** Posts before and after `slug` in the list order of its locale. */
export async function getPostNeighbours(locale: Locale, slug: string) {
  const posts = await getPublishedPosts(locale)
  const index = posts.findIndex((item) => item.slug === slug)

  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  }
}
