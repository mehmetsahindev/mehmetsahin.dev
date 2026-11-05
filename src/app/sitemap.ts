import type { MetadataRoute } from "next"
import { getDb, schema } from "@/db"
import { isLocale, LOCALE_TAGS, LOCALES, type Locale } from "@/i18n/config"
import { eq } from "drizzle-orm"

import { SITE_URL } from "@/config/site"
import { blogPath, postPath } from "@/features/blog/lib/paths"

export const dynamic = "force-dynamic"

/** hreflang map including x-default (the default-locale URL when present). */
function languages(urls: Partial<Record<Locale, string>>) {
  const result: Record<string, string> = {}
  for (const locale of LOCALES) {
    const url = urls[locale]
    if (url) result[LOCALE_TAGS[locale]] = url
  }
  const fallback = urls.en ?? Object.values(urls)[0]
  if (fallback) result["x-default"] = fallback
  return result
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = (
    await getDb()
      .select({
        postId: schema.postTranslation.postId,
        locale: schema.postTranslation.locale,
        slug: schema.postTranslation.slug,
        updatedAt: schema.postTranslation.updatedAt,
      })
      .from(schema.postTranslation)
      .where(eq(schema.postTranslation.status, "published"))
  ).flatMap((row) =>
    isLocale(row.locale) ? [{ ...row, locale: row.locale }] : []
  )

  const urlOf = (locale: Locale, slug: string) =>
    `${SITE_URL}${postPath(locale, slug)}`

  const posts = rows.map((row) => ({
    url: urlOf(row.locale, row.slug),
    lastModified: row.updatedAt.toISOString(),
    alternates: {
      languages: languages(
        Object.fromEntries(
          rows
            .filter((item) => item.postId === row.postId)
            .map((item) => [item.locale, urlOf(item.locale, item.slug)])
        )
      ),
    },
  }))

  const blogLanguages = languages(
    Object.fromEntries(
      LOCALES.map((locale) => [locale, `${SITE_URL}${blogPath(locale)}`])
    )
  )

  // A blog index changes when one of its posts does.
  const blogIndexes = LOCALES.map((locale) => {
    const latest = rows
      .filter((row) => row.locale === locale)
      .reduce<Date | null>(
        (max, row) => (!max || row.updatedAt > max ? row.updatedAt : max),
        null
      )
    return {
      url: `${SITE_URL}${blogPath(locale)}`,
      lastModified: latest?.toISOString(),
      alternates: { languages: blogLanguages },
    }
  })

  const routes = ["", "/bookmarks"].map((route) => ({
    url: `${SITE_URL}${route}`,
  }))

  return [...routes, ...blogIndexes, ...posts]
}
