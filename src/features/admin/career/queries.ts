import "server-only"

import { getDb, schema } from "@/db"
import { asc, eq } from "drizzle-orm"

import { getMediaItemsByIds } from "@/features/media/data/media"
import type { MediaItem } from "@/features/media/types"
import { getSimpleIcon } from "@/features/portfolio/lib/simple-icons"

import type { IconValue } from "../components/form/icon-picker"
import type { EducationInput, ExperienceInput, ProjectInput } from "./schemas"

function toIconValue(
  slug: string | null,
  mediaId: string | null,
  media: Map<string, MediaItem>
): IconValue {
  const icon = slug ? getSimpleIcon(slug) : undefined
  return {
    simpleIcon: icon
      ? { slug: icon.slug, title: icon.title, path: icon.path }
      : null,
    media: mediaId ? (media.get(mediaId) ?? null) : null,
  }
}

/* -------------------------------------------------------------------------- */

export type ExperienceFormData = {
  values: ExperienceInput
  logo: MediaItem | null
}

export async function getExperienceForAdmin(
  id: string
): Promise<ExperienceFormData | null> {
  const db = getDb()
  const [row] = await db
    .select()
    .from(schema.experience)
    .where(eq(schema.experience.id, id))
    .limit(1)

  if (!row) return null

  const positions = await db
    .select()
    .from(schema.experiencePosition)
    .where(eq(schema.experiencePosition.experienceId, id))
    .orderBy(asc(schema.experiencePosition.sortOrder))

  const media = await getMediaItemsByIds([row.logoId])

  return {
    values: {
      companyName: row.companyName,
      companyWebsite: row.companyWebsite,
      logoId: row.logoId,
      location: row.location,
      locationType: row.locationType as ExperienceInput["locationType"],
      positions: positions.map((position) => ({
        id: position.id,
        title: position.title,
        employmentType: position.employmentType,
        startDate: position.startDate,
        endDate: position.endDate,
        description: position.description,
        skills: position.skills,
        icon: position.icon,
        isExpanded: position.isExpanded,
        showInOverview: position.showInOverview,
      })),
    },
    logo: row.logoId ? (media.get(row.logoId) ?? null) : null,
  }
}

/* -------------------------------------------------------------------------- */

export type EducationListItem = EducationInput & { id: string }

export async function listEducationForAdmin(): Promise<EducationListItem[]> {
  const rows = await getDb()
    .select()
    .from(schema.education)
    .orderBy(asc(schema.education.sortOrder))

  return rows.map((row) => ({
    id: row.id,
    school: row.school,
    degree: row.degree,
    fieldOfStudy: row.fieldOfStudy,
    startDate: row.startDate,
    endDate: row.endDate,
    description: row.description,
    skills: row.skills,
    isExpanded: row.isExpanded,
  }))
}

/* -------------------------------------------------------------------------- */

export type ProjectFormData = {
  values: ProjectInput
  icon: IconValue
}

export async function getProjectForAdmin(
  id: string
): Promise<ProjectFormData | null> {
  const [row] = await getDb()
    .select()
    .from(schema.project)
    .where(eq(schema.project.id, id))
    .limit(1)

  if (!row) return null

  const media = await getMediaItemsByIds([row.iconMediaId])

  return {
    values: {
      title: row.title,
      url: row.url,
      startDate: row.startDate,
      endDate: row.endDate,
      description: row.description,
      skills: row.skills,
      icon: { slug: row.iconSlug, mediaId: row.iconMediaId },
      isExpanded: row.isExpanded,
    },
    icon: toIconValue(row.iconSlug, row.iconMediaId, media),
  }
}

export type ProjectListItem = {
  id: string
  title: string
  url: string
  startDate: string
  endDate: string | null
  icon: IconValue
}

export async function listProjectsForAdmin(): Promise<ProjectListItem[]> {
  const rows = await getDb()
    .select()
    .from(schema.project)
    .orderBy(asc(schema.project.sortOrder))

  const media = await getMediaItemsByIds(rows.map((row) => row.iconMediaId))

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    url: row.url,
    startDate: row.startDate,
    endDate: row.endDate,
    icon: toIconValue(row.iconSlug, row.iconMediaId, media),
  }))
}

/* -------------------------------------------------------------------------- */

export type TechItemAdmin = {
  id: string
  categoryId: string
  name: string
  url: string
  icon: IconValue
}

export type TechCategoryAdmin = {
  id: string
  name: string
  items: TechItemAdmin[]
}

export async function getTechStackForAdmin(): Promise<TechCategoryAdmin[]> {
  const db = getDb()
  const [categories, items] = await Promise.all([
    db
      .select()
      .from(schema.techCategory)
      .orderBy(asc(schema.techCategory.sortOrder)),
    db.select().from(schema.techItem).orderBy(asc(schema.techItem.sortOrder)),
  ])

  const media = await getMediaItemsByIds(items.map((item) => item.iconMediaId))

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    items: items
      .filter((item) => item.categoryId === category.id)
      .map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        url: item.url,
        icon: toIconValue(item.iconSlug, item.iconMediaId, media),
      })),
  }))
}
