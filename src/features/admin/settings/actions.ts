"use server"

import { getDb, schema } from "@/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

import {
  refreshPortfolio,
  type ActionResult,
} from "@/features/admin/lib/actions"
import { requireAdmin } from "@/features/admin/lib/session"
import { HOME_SECTIONS } from "@/features/portfolio/lib/home-sections"

const sectionIds = HOME_SECTIONS.map((section) => section.id) as [
  string,
  ...string[],
]

// Partial: sections never toggled are simply visible.
const homeSectionsSchema = z.partialRecord(z.enum(sectionIds), z.boolean())

export async function saveHomeSectionsAction(
  homeSections: Record<string, boolean>
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = homeSectionsSchema.safeParse(homeSections)
  if (!parsed.success) return { ok: false, error: "Invalid sections." }

  await getDb()
    .update(schema.siteSettings)
    .set({
      homeSections: Object.fromEntries(
        Object.entries(parsed.data).filter(
          (entry): entry is [string, boolean] => entry[1] !== undefined
        )
      ),
    })
    .where(eq(schema.siteSettings.id, 1))

  refreshPortfolio("/admin/settings")
  return { ok: true }
}
