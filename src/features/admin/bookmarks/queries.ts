import "server-only"

import { getDb, schema } from "@/db"
import { asc, count, eq } from "drizzle-orm"

import { getMediaItemsByIds } from "@/features/media/data/media"
import { getSimpleIcon } from "@/features/portfolio/lib/simple-icons"

import type { IconValue } from "../components/form/icon-picker"

export type BookmarkCategoryAdmin = {
  id: string
  name: string
  slug: string
  bookmarkCount: number
}

export type BookmarkAdmin = {
  id: string
  categoryId: string
  title: string
  url: string
  author: string
  note: string
  bookmarkedAt: string
  icon: IconValue
}

export async function getBookmarkCategoriesForAdmin(): Promise<
  BookmarkCategoryAdmin[]
> {
  const rows = await getDb()
    .select({
      id: schema.bookmarkCategory.id,
      name: schema.bookmarkCategory.name,
      slug: schema.bookmarkCategory.slug,
      bookmarkCount: count(schema.bookmark.id),
    })
    .from(schema.bookmarkCategory)
    .leftJoin(
      schema.bookmark,
      eq(schema.bookmark.categoryId, schema.bookmarkCategory.id)
    )
    .groupBy(schema.bookmarkCategory.id)
    .orderBy(asc(schema.bookmarkCategory.sortOrder))

  return rows
}

export async function getBookmarksForAdmin(): Promise<BookmarkAdmin[]> {
  const rows = await getDb()
    .select()
    .from(schema.bookmark)
    .orderBy(asc(schema.bookmark.sortOrder))

  const media = await getMediaItemsByIds(rows.map((row) => row.iconMediaId))

  return rows.map((row) => {
    const simpleIcon = row.iconSlug ? getSimpleIcon(row.iconSlug) : undefined
    return {
      id: row.id,
      categoryId: row.categoryId,
      title: row.title,
      url: row.url,
      author: row.author,
      note: row.note,
      bookmarkedAt: row.bookmarkedAt,
      icon: {
        simpleIcon: simpleIcon
          ? {
              slug: simpleIcon.slug,
              title: simpleIcon.title,
              path: simpleIcon.path,
            }
          : null,
        media: row.iconMediaId ? (media.get(row.iconMediaId) ?? null) : null,
      },
    }
  })
}
