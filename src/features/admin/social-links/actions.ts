"use server"

import { getDb, schema } from "@/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

import {
  invalidResult,
  refreshPortfolio,
  type ActionResult,
} from "@/features/admin/lib/actions"
import { nextSortOrder, saveOrder } from "@/features/admin/lib/order"
import { requireAdmin } from "@/features/admin/lib/session"

import { socialLinkSchema, type SocialLinkInput } from "./schema"

const PATH = "/admin/social-links"

export async function saveSocialLinkAction(
  id: string | null,
  input: SocialLinkInput
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = socialLinkSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const db = getDb()
  if (id) {
    await db
      .update(schema.socialLink)
      .set(parsed.data)
      .where(eq(schema.socialLink.id, z.uuid().parse(id)))
  } else {
    await db.insert(schema.socialLink).values({
      ...parsed.data,
      sortOrder: await nextSortOrder(schema.socialLink),
    })
  }

  refreshPortfolio(PATH)
  return { ok: true }
}

export async function deleteSocialLinkAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin()
  await getDb()
    .delete(schema.socialLink)
    .where(eq(schema.socialLink.id, z.uuid().parse(id)))
  refreshPortfolio(PATH)
  return { ok: true }
}

export async function reorderSocialLinksAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.socialLink, ids)
  refreshPortfolio(PATH)
  return { ok: true }
}
