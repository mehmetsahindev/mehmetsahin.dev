"use server"

import { getDb, schema } from "@/db"
import { and, eq, inArray, notInArray } from "drizzle-orm"
import { z } from "zod"

import {
  invalidResult,
  refreshPortfolio,
  type ActionResult,
} from "@/features/admin/lib/actions"
import { nextSortOrder, saveOrder } from "@/features/admin/lib/order"
import { requireAdmin } from "@/features/admin/lib/session"
import { clearMediaUsage, syncMediaUsage } from "@/features/media/data/media"

import {
  categoryNameSchema,
  educationSchema,
  experienceSchema,
  projectSchema,
  techItemSchema,
  type EducationInput,
  type ExperienceInput,
  type ProjectInput,
  type TechItemInput,
} from "./schemas"

const uuid = z.uuid()

/* -------------------------------------------------------------------------- */
/* Experience                                                                 */
/* -------------------------------------------------------------------------- */

export async function saveExperienceAction(
  id: string | null,
  input: ExperienceInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = experienceSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const { positions, ...company } = parsed.data
  const db = getDb()
  const sortOrder = id ? undefined : await nextSortOrder(schema.experience)

  const experienceId = await db.transaction(async (tx) => {
    let rowId = id ? uuid.parse(id) : null

    if (rowId) {
      await tx
        .update(schema.experience)
        .set(company)
        .where(eq(schema.experience.id, rowId))
    } else {
      const [created] = await tx
        .insert(schema.experience)
        .values({ ...company, sortOrder })
        .returning({ id: schema.experience.id })
      rowId = created.id
    }

    const keptIds = positions.flatMap((position) =>
      position.id ? [position.id] : []
    )
    await tx
      .delete(schema.experiencePosition)
      .where(
        and(
          eq(schema.experiencePosition.experienceId, rowId),
          keptIds.length
            ? notInArray(schema.experiencePosition.id, keptIds)
            : undefined
        )
      )

    for (const [
      index,
      { id: positionId, ...position },
    ] of positions.entries()) {
      const values = { ...position, experienceId: rowId, sortOrder: index }
      if (positionId) {
        await tx
          .update(schema.experiencePosition)
          .set(values)
          .where(eq(schema.experiencePosition.id, positionId))
      } else {
        await tx.insert(schema.experiencePosition).values(values)
      }
    }

    return rowId
  })

  await syncMediaUsage(
    {
      entityType: "experience",
      entityId: experienceId,
      label: company.companyName,
      href: `/admin/experience/${experienceId}`,
    },
    {
      logo: { mediaId: company.logoId },
      ...Object.fromEntries(
        positions.map((position, index) => [
          `position-${index + 1}`,
          { markdown: position.description },
        ])
      ),
    }
  )

  refreshPortfolio("/admin/experience")
  return { ok: true, data: { id: experienceId } }
}

export async function deleteExperienceAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin()
  const rowId = uuid.parse(id)
  await getDb().delete(schema.experience).where(eq(schema.experience.id, rowId))
  await clearMediaUsage("experience", rowId)
  refreshPortfolio("/admin/experience")
  return { ok: true }
}

export async function reorderExperiencesAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.experience, ids)
  refreshPortfolio("/admin/experience")
  return { ok: true }
}

/* -------------------------------------------------------------------------- */
/* Education                                                                  */
/* -------------------------------------------------------------------------- */

export async function saveEducationAction(
  id: string | null,
  input: EducationInput
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = educationSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const db = getDb()
  let rowId = id ? uuid.parse(id) : null

  if (rowId) {
    await db
      .update(schema.education)
      .set(parsed.data)
      .where(eq(schema.education.id, rowId))
  } else {
    const [created] = await db
      .insert(schema.education)
      .values({
        ...parsed.data,
        sortOrder: await nextSortOrder(schema.education),
      })
      .returning({ id: schema.education.id })
    rowId = created.id
  }

  await syncMediaUsage(
    {
      entityType: "education",
      entityId: rowId,
      label: parsed.data.school,
      href: "/admin/education",
    },
    { description: { markdown: parsed.data.description } }
  )

  refreshPortfolio("/admin/education")
  return { ok: true }
}

export async function deleteEducationAction(id: string): Promise<ActionResult> {
  await requireAdmin()
  const rowId = uuid.parse(id)
  await getDb().delete(schema.education).where(eq(schema.education.id, rowId))
  await clearMediaUsage("education", rowId)
  refreshPortfolio("/admin/education")
  return { ok: true }
}

export async function reorderEducationAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.education, ids)
  refreshPortfolio("/admin/education")
  return { ok: true }
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export async function saveProjectAction(
  id: string | null,
  input: ProjectInput
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()

  const parsed = projectSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const { icon, ...rest } = parsed.data
  const values = { ...rest, iconSlug: icon.slug, iconMediaId: icon.mediaId }
  const db = getDb()
  let rowId = id ? uuid.parse(id) : null

  if (rowId) {
    await db
      .update(schema.project)
      .set(values)
      .where(eq(schema.project.id, rowId))
  } else {
    const [created] = await db
      .insert(schema.project)
      .values({ ...values, sortOrder: await nextSortOrder(schema.project) })
      .returning({ id: schema.project.id })
    rowId = created.id
  }

  await syncMediaUsage(
    {
      entityType: "project",
      entityId: rowId,
      label: rest.title,
      href: `/admin/projects/${rowId}`,
    },
    {
      icon: { mediaId: icon.mediaId },
      description: { markdown: rest.description },
    }
  )

  refreshPortfolio("/admin/projects")
  return { ok: true, data: { id: rowId } }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireAdmin()
  const rowId = uuid.parse(id)
  await getDb().delete(schema.project).where(eq(schema.project.id, rowId))
  await clearMediaUsage("project", rowId)
  refreshPortfolio("/admin/projects")
  return { ok: true }
}

export async function reorderProjectsAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.project, ids)
  refreshPortfolio("/admin/projects")
  return { ok: true }
}

/* -------------------------------------------------------------------------- */
/* Tech stack                                                                 */
/* -------------------------------------------------------------------------- */

const TECH_PATH = "/admin/tech-stack"

export async function saveTechCategoryAction(
  id: string | null,
  name: string
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = categoryNameSchema.safeParse(name)
  if (!parsed.success) return invalidResult(parsed.error)

  const db = getDb()
  if (id) {
    await db
      .update(schema.techCategory)
      .set({ name: parsed.data })
      .where(eq(schema.techCategory.id, uuid.parse(id)))
  } else {
    await db.insert(schema.techCategory).values({
      name: parsed.data,
      sortOrder: await nextSortOrder(schema.techCategory),
    })
  }

  refreshPortfolio(TECH_PATH)
  return { ok: true }
}

/** Deletes the category and every technology in it. */
export async function deleteTechCategoryAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin()
  const categoryId = uuid.parse(id)
  const db = getDb()

  const items = await db
    .select({ id: schema.techItem.id })
    .from(schema.techItem)
    .where(eq(schema.techItem.categoryId, categoryId))

  await db
    .delete(schema.techCategory)
    .where(eq(schema.techCategory.id, categoryId))
  for (const item of items) {
    await clearMediaUsage("tech-item", item.id)
  }

  refreshPortfolio(TECH_PATH)
  return { ok: true }
}

export async function reorderTechCategoriesAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  await saveOrder(schema.techCategory, ids)
  refreshPortfolio(TECH_PATH)
  return { ok: true }
}

export async function saveTechItemAction(
  id: string | null,
  input: TechItemInput
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = techItemSchema.safeParse(input)
  if (!parsed.success) return invalidResult(parsed.error)

  const { icon, ...rest } = parsed.data
  const values = { ...rest, iconSlug: icon.slug, iconMediaId: icon.mediaId }
  const db = getDb()
  let rowId = id ? uuid.parse(id) : null

  if (rowId) {
    await db
      .update(schema.techItem)
      .set(values)
      .where(eq(schema.techItem.id, rowId))
  } else {
    const [created] = await db
      .insert(schema.techItem)
      .values({ ...values, sortOrder: await nextSortOrder(schema.techItem) })
      .returning({ id: schema.techItem.id })
    rowId = created.id
  }

  await syncMediaUsage(
    {
      entityType: "tech-item",
      entityId: rowId,
      label: rest.name,
      href: TECH_PATH,
    },
    { icon: { mediaId: icon.mediaId } }
  )

  refreshPortfolio(TECH_PATH)
  return { ok: true }
}

export async function deleteTechItemAction(id: string): Promise<ActionResult> {
  await requireAdmin()
  const rowId = uuid.parse(id)
  await getDb().delete(schema.techItem).where(eq(schema.techItem.id, rowId))
  await clearMediaUsage("tech-item", rowId)
  refreshPortfolio(TECH_PATH)
  return { ok: true }
}

/** Order of technologies inside one category. */
export async function reorderTechItemsAction(
  ids: string[]
): Promise<ActionResult> {
  await requireAdmin()
  const parsed = z.array(uuid).parse(ids)
  if (parsed.length > 0) {
    // Guard: only rows that exist are touched.
    const existing = await getDb()
      .select({ id: schema.techItem.id })
      .from(schema.techItem)
      .where(inArray(schema.techItem.id, parsed))
    if (existing.length !== parsed.length) {
      return { ok: false, error: "Some items no longer exist." }
    }
  }
  await saveOrder(schema.techItem, parsed)
  refreshPortfolio(TECH_PATH)
  return { ok: true }
}
