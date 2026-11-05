"use server"

import { getDb, schema } from "@/db"
import { eq } from "drizzle-orm"

import {
  invalidResult,
  refreshPortfolio,
  type ActionResult,
} from "@/features/admin/lib/actions"
import { requireAdmin } from "@/features/admin/lib/session"
import { syncMediaUsage } from "@/features/media/data/media"

import { profileSchema, type ProfileInput } from "./schema"

export async function saveProfileAction(
  input: ProfileInput
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const values = parsed.data

  await getDb()
    .update(schema.profile)
    .set(values)
    .where(eq(schema.profile.id, 1))

  await syncMediaUsage(
    {
      entityType: "profile",
      entityId: "profile",
      label: "Profile",
      href: "/admin/profile",
    },
    {
      avatar: { mediaId: values.avatarId },
      "og-image": { mediaId: values.ogImageId },
      about: { markdown: values.about },
    }
  )

  refreshPortfolio("/admin/profile")
  return { ok: true }
}
