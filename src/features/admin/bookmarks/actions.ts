"use server"

import { getDb, schema } from "@/db"
import { slugify } from "@/utils/slugify"
import { and, count, eq, ne } from "drizzle-orm"
import { z } from "zod"

import {
  invalidResult,
  refreshPortfolio,
  type ActionResult,
} from "@/features/admin/lib/actions"
import { nextSortOrder, saveOrder } from "@/features/admin/lib/order"
import { requireAdmin } from "@/features/admin/lib/session"
import { clearMediaUsage, syncMediaUsage } from "@/features/media/data/media"

import { categoryNameSchema } from "../career/schemas"
import { bookmarkSchema, type BookmarkInput } from "./schema"

const PATH = "/admin/bookmarks"
const uuid = z.uuid()

/* -------------------------------------------------------------------------- */
/* Bookmarks                                                                  */
/* -------------------------------------------------------------------------- */

export async function saveBookmarkAction(
  id: string | null,
  input: BookmarkInput
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = bookmarkSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const { icon, ...rest } = parsed.data
  const values = { ...rest, iconSlug: icon.slug, iconMediaId: icon.mediaId }
  const db = getDb()
  let rowId = id ? uuid.parse(id) : null

  if (rowId) {
    await db
      .update(schema.bookmark)
      .set(values)
      .where(eq(schema.bookmark.id, rowId))
  } else {
    // New bookmarks go to the top: they are usually the most relevant.
    const [created] = await db.transaction(async (tx) => {
      const rows = await tx
        .select({ id: schema.bookmark.id })
        .from(schema.bookmark)
        .orderBy(schema.bookmark.sortOrder)
      for (const [index, row] of rows.entries()) {
        await tx
          .update(schema.bookmark)
          .set({ sortOrder: index + 1 })
          .where(eq(schema.bookmark.id, row.id))
      }
      return tx
        .insert(schema.bookmark)
        .values({ ...values, sortOrder: 0 })
        .returning({ id: schema.bookmark.id })
    })
    rowId = created.id
  }

  await syncMediaUsage(
    {
      entityType: "bookmark",
      entityId: rowId,
      label: rest.title,
      href: PATH,
    },
    { icon: { mediaId: icon.mediaId } }
  )

  refreshPortfolio(PATH)
  return { ok: true }
}

export async function deleteBookmarkAction(id: string): Promise<ActionResult> {
  await requireAdmin()
  const rowId = uuid.parse(id)
  await getDb().delete(schema.bookmark).where(eq(schema.bookmark.id, rowId))
  await clearMediaUsage("bookmark", rowId)
  refreshPortfolio(PATH)
  return { ok: true }
}

export async function reorderBookmarksAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.bookmark, ids)
  refreshPortfolio(PATH)
  return { ok: true }
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

async function uniqueSlug(name: string, exceptId: string | null) {
  const base = slugify(name) || "category"
  const db = getDb()

  for (let attempt = 1; ; attempt++) {
    const slug = attempt === 1 ? base : `${base}-${attempt}`
    const [taken] = await db
      .select({ id: schema.bookmarkCategory.id })
      .from(schema.bookmarkCategory)
      .where(
        and(
          eq(schema.bookmarkCategory.slug, slug),
          exceptId ? ne(schema.bookmarkCategory.id, exceptId) : undefined
        )
      )
      .limit(1)
    if (!taken) return slug
  }
}

export async function saveBookmarkCategoryAction(
  id: string | null,
  name: string
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = categoryNameSchema.safeParse(name)
  if (!parsed.success) return invalidResult(parsed.error)

  const db = getDb()
  const rowId = id ? uuid.parse(id) : null
  const slug = await uniqueSlug(parsed.data, rowId)

  if (rowId) {
    await db
      .update(schema.bookmarkCategory)
      .set({ name: parsed.data, slug })
      .where(eq(schema.bookmarkCategory.id, rowId))
  } else {
    await db.insert(schema.bookmarkCategory).values({
      name: parsed.data,
      slug,
      sortOrder: await nextSortOrder(schema.bookmarkCategory),
    })
  }

  refreshPortfolio(PATH)
  return { ok: true }
}

export async function deleteBookmarkCategoryAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin()
  const rowId = uuid.parse(id)
  const db = getDb()

  const [usage] = await db
    .select({ value: count() })
    .from(schema.bookmark)
    .where(eq(schema.bookmark.categoryId, rowId))

  if (usage.value > 0) {
    return {
      ok: false,
      error: "Move or delete the bookmarks in this category first.",
    }
  }

  await db
    .delete(schema.bookmarkCategory)
    .where(eq(schema.bookmarkCategory.id, rowId))
  refreshPortfolio(PATH)
  return { ok: true }
}

export async function reorderBookmarkCategoriesAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.bookmarkCategory, ids)
  refreshPortfolio(PATH)
  return { ok: true }
}
