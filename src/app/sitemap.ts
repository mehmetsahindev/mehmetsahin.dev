import type { MetadataRoute } from "next"
import { getDb, schema } from "@/db"
import { LOCALE_TAGS, LOCALES } from "@/i18n/config"
import { and, eq } from "drizzle-orm"

import { SITE_URL } from "@/config/site"
import { blogPath, postPath } from "@/features/blog/lib/paths"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await getDb()
    .select({
      postId: schema.postTranslation.postId,
      locale: schema.postTranslation.locale,
      slug: schema.postTranslation.slug,
      updatedAt: schema.postTranslation.updatedAt,
    })
    .from(schema.postTranslation)
    .where(and(eq(schema.postTranslation.status, "published")))

  const languagesFor = (postId: string) =>
    Object.fromEntries(
      rows
        .filter((row) => row.postId === postId)
        .map((row) => [
          LOCALE_TAGS[row.locale as keyof typeof LOCALE_TAGS],
          `${SITE_URL}${postPath(row.locale as (typeof LOCALES)[number], row.slug)}`,
        ])
    )

  const posts = rows.map((row) => ({
    url: `${SITE_URL}${postPath(row.locale as (typeof LOCALES)[number], row.slug)}`,
    lastModified: row.updatedAt.toISOString(),
    alternates: { languages: languagesFor(row.postId) },
  }))

  const blogIndexes = LOCALES.map((locale) => ({
    url: `${SITE_URL}${blogPath(locale)}`,
    lastModified: new Date().toISOString(),
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((item) => [
          LOCALE_TAGS[item],
          `${SITE_URL}${blogPath(item)}`,
        ])
      ),
    },
  }))

  const routes = ["", "/bookmarks"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...blogIndexes, ...posts]
}
