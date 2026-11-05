import "server-only"

import { unstable_cache } from "next/cache"
import { getDb, schema } from "@/db"
import { asc, eq, inArray } from "drizzle-orm"

import { getMediaUrl } from "@/features/media/lib/constants"

import type {
  BookmarkCategoryData,
  BookmarkData,
  EducationData,
  ExperienceData,
  IconRef,
  ProfileData,
  ProjectData,
  SiteSettingsData,
  SocialLinkData,
  TechCategoryData,
} from "./types"

/**
 * Cache tag for everything managed in the admin outside the blog. Admin
 * actions call `updateTag(PORTFOLIO_TAG)` after saving.
 */
export const PORTFOLIO_TAG = "portfolio"

function cached<T>(key: string, fn: () => Promise<T>) {
  return unstable_cache(fn, [key], { tags: [PORTFOLIO_TAG] })
}

async function getMediaKeys(ids: (string | null)[]) {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))]
  if (unique.length === 0) return new Map<string, string>()

  const rows = await getDb()
    .select({ id: schema.media.id, key: schema.media.key })
    .from(schema.media)
    .where(inArray(schema.media.id, unique))

  return new Map(rows.map((row) => [row.id, row.key]))
}

function toIconRef(
  row: { iconSlug: string | null; iconMediaId: string | null },
  keys: Map<string, string>
): IconRef {
  return {
    slug: row.iconSlug,
    mediaKey: row.iconMediaId ? (keys.get(row.iconMediaId) ?? null) : null,
  }
}

/* -------------------------------------------------------------------------- */

export const getProfile = cached("profile", async (): Promise<ProfileData> => {
  const [row] = await getDb()
    .select()
    .from(schema.profile)
    .where(eq(schema.profile.id, 1))
    .limit(1)

  if (!row) {
    throw new Error("Profile row is missing; migrations have not run.")
  }

  const keys = await getMediaKeys([row.avatarId, row.ogImageId])
  const url = (id: string | null) => {
    const key = id ? keys.get(id) : undefined
    return key ? getMediaUrl(key) : null
  }

  return {
    firstName: row.firstName,
    lastName: row.lastName,
    displayName: row.displayName,
    username: row.username,
    jobTitle: row.jobTitle,
    bio: row.bio,
    taglines: row.taglines,
    about: row.about,
    location: row.location,
    email: row.email,
    phone: row.phone,
    timeZone: row.timeZone,
    avatarUrl: url(row.avatarId),
    ogImageUrl: url(row.ogImageId),
    keywords: row.keywords,
    createdAt: row.createdAt.toISOString(),
  }
})

export const getSiteSettings = cached(
  "site-settings",
  async (): Promise<SiteSettingsData> => {
    const [row] = await getDb().select().from(schema.siteSettings).limit(1)
    return { homeSections: row?.homeSections ?? {} }
  }
)

export const getSocialLinks = cached(
  "social-links",
  async (): Promise<SocialLinkData[]> => {
    const rows = await getDb()
      .select()
      .from(schema.socialLink)
      .orderBy(asc(schema.socialLink.sortOrder))

    return rows.map((row) => ({
      id: row.id,
      platform: row.platform,
      handle: row.handle,
      url: row.url,
      sameAs: row.sameAs,
    }))
  }
)

export const getExperiences = cached(
  "experiences",
  async (): Promise<ExperienceData[]> => {
    const db = getDb()

    const [companies, positions] = await Promise.all([
      db
        .select()
        .from(schema.experience)
        .orderBy(asc(schema.experience.sortOrder)),
      db
        .select()
        .from(schema.experiencePosition)
        .orderBy(asc(schema.experiencePosition.sortOrder)),
    ])

    const keys = await getMediaKeys(companies.map((row) => row.logoId))

    return companies.map((row) => {
      const logoKey = row.logoId ? keys.get(row.logoId) : undefined

      return {
        id: row.id,
        companyName: row.companyName,
        companyWebsite: row.companyWebsite,
        logoUrl: logoKey ? getMediaUrl(logoKey) : null,
        location: row.location,
        locationType: row.locationType,
        positions: positions
          .filter((position) => position.experienceId === row.id)
          .map((position) => ({
            id: position.id,
            title: position.title,
            employmentType: position.employmentType,
            startDate: position.startDate,
            endDate: position.endDate,
            description: position.description,
            skills: position.skills,
            icon: position.icon,
            isExpanded: position.isExpanded,
          })),
      }
    })
  }
)

export const getEducation = cached(
  "education",
  async (): Promise<EducationData[]> => {
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
)

export const getProjects = cached(
  "projects",
  async (): Promise<ProjectData[]> => {
    const rows = await getDb()
      .select()
      .from(schema.project)
      .orderBy(asc(schema.project.sortOrder))

    const keys = await getMediaKeys(rows.map((row) => row.iconMediaId))

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      startDate: row.startDate,
      endDate: row.endDate,
      description: row.description,
      skills: row.skills,
      icon: toIconRef(row, keys),
      isExpanded: row.isExpanded,
    }))
  }
)

export const getTechStack = cached(
  "tech-stack",
  async (): Promise<TechCategoryData[]> => {
    const db = getDb()

    const [categories, items] = await Promise.all([
      db
        .select()
        .from(schema.techCategory)
        .orderBy(asc(schema.techCategory.sortOrder)),
      db.select().from(schema.techItem).orderBy(asc(schema.techItem.sortOrder)),
    ])

    const keys = await getMediaKeys(items.map((row) => row.iconMediaId))

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      items: items
        .filter((item) => item.categoryId === category.id)
        .map((item) => ({
          id: item.id,
          name: item.name,
          url: item.url,
          icon: toIconRef(item, keys),
        })),
    }))
  }
)

export const getBookmarkCategories = cached(
  "bookmark-categories",
  async (): Promise<BookmarkCategoryData[]> => {
    return getDb()
      .select({
        id: schema.bookmarkCategory.id,
        name: schema.bookmarkCategory.name,
        slug: schema.bookmarkCategory.slug,
      })
      .from(schema.bookmarkCategory)
      .orderBy(asc(schema.bookmarkCategory.sortOrder))
  }
)

export const getBookmarks = cached(
  "bookmarks",
  async (): Promise<BookmarkData[]> => {
    const rows = await getDb()
      .select({
        bookmark: schema.bookmark,
        category: {
          id: schema.bookmarkCategory.id,
          name: schema.bookmarkCategory.name,
          slug: schema.bookmarkCategory.slug,
        },
      })
      .from(schema.bookmark)
      .innerJoin(
        schema.bookmarkCategory,
        eq(schema.bookmark.categoryId, schema.bookmarkCategory.id)
      )
      .orderBy(asc(schema.bookmark.sortOrder))

    const keys = await getMediaKeys(rows.map((row) => row.bookmark.iconMediaId))

    return rows.map(({ bookmark, category }) => ({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      author: bookmark.author,
      note: bookmark.note,
      icon: toIconRef(bookmark, keys),
      bookmarkedAt: bookmark.bookmarkedAt,
      category,
    }))
  }
)

/** X handle for Twitter card metadata, if an X profile is linked. */
export async function getXHandle() {
  const links = await getSocialLinks()
  const x = links.find((link) => link.platform === "x")
  return x?.handle || undefined
}
