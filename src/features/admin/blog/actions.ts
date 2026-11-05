"use server"

import { revalidatePath, updateTag } from "next/cache"
import { getDb, schema } from "@/db"
import { and, eq, ne, notInArray } from "drizzle-orm"
import { z } from "zod"

import { invalidResult, type ActionResult } from "@/features/admin/lib/actions"
import { requireAdmin } from "@/features/admin/lib/session"
import { BLOG_TAG } from "@/features/blog/data/queries"
import { clearMediaUsage, syncMediaUsage } from "@/features/media/data/media"

import { postSchema, type PostInput } from "./schema"

const uuid = z.uuid()

function refreshBlog() {
  updateTag(BLOG_TAG)
  revalidatePath("/admin/blog")
}

export async function savePostAction(
  id: string | null,
  input: PostInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const { translations, ...postValues } = parsed.data
  const db = getDb()
  const postId = id ? uuid.parse(id) : null

  // Slugs are unique per language across all posts.
  const fieldErrors: Record<string, string> = {}
  for (const [index, translation] of translations.entries()) {
    const [taken] = await db
      .select({ id: schema.postTranslation.id })
      .from(schema.postTranslation)
      .where(
        and(
          eq(schema.postTranslation.locale, translation.locale),
          eq(schema.postTranslation.slug, translation.slug),
          postId ? ne(schema.postTranslation.postId, postId) : undefined
        )
      )
      .limit(1)
    if (taken) {
      fieldErrors[`translations.${index}.slug`] =
        "Another post already uses this slug."
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "This slug is already taken.", fieldErrors }
  }

  const savedId = await db.transaction(async (tx) => {
    let rowId = postId

    if (rowId) {
      await tx
        .update(schema.post)
        .set(postValues)
        .where(eq(schema.post.id, rowId))
    } else {
      const [created] = await tx
        .insert(schema.post)
        .values(postValues)
        .returning({ id: schema.post.id })
      rowId = created.id
    }

    await tx.delete(schema.postTranslation).where(
      and(
        eq(schema.postTranslation.postId, rowId),
        notInArray(
          schema.postTranslation.locale,
          translations.map((item) => item.locale)
        )
      )
    )

    for (const translation of translations) {
      await tx
        .insert(schema.postTranslation)
        .values({ ...translation, postId: rowId })
        .onConflictDoUpdate({
          target: [
            schema.postTranslation.postId,
            schema.postTranslation.locale,
          ],
          set: {
            title: translation.title,
            slug: translation.slug,
            description: translation.description,
            content: translation.content,
            status: translation.status,
            updatedAt: new Date(),
          },
        })
    }

    return rowId
  })

  const mainTitle = translations[0].title
  await syncMediaUsage(
    {
      entityType: "post",
      entityId: savedId,
      label: mainTitle,
      href: `/admin/blog/${savedId}`,
    },
    {
      cover: { mediaId: postValues.coverId },
      ...Object.fromEntries(
        translations.map((translation) => [
          `content.${translation.locale}`,
          { markdown: translation.content },
        ])
      ),
    }
  )

  refreshBlog()
  return { ok: true, data: { id: savedId } }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  await requireAdmin()
  const postId = uuid.parse(id)
  await getDb().delete(schema.post).where(eq(schema.post.id, postId))
  await clearMediaUsage("post", postId)
  refreshBlog()
  return { ok: true }
}
