import type { Metadata } from "next"
import { LOCALE_TAGS, LOCALES, type Locale } from "@/i18n/config"

import { getProfile, getXHandle } from "@/features/portfolio/data/queries"

/** `hreflang` alternates from a locale → path map, with x-default. */
export function languageAlternates(paths: Partial<Record<Locale, string>>) {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    const path = paths[locale]
    if (path) languages[LOCALE_TAGS[locale]] = path
  }
  const fallback = paths.en ?? Object.values(paths)[0]
  if (fallback) languages["x-default"] = fallback
  return languages
}

/** Twitter card fields; set per page because child metadata replaces it. */
export async function twitterCard(image: string): Promise<Metadata["twitter"]> {
  const handle = await getXHandle()
  return {
    card: "summary_large_image",
    site: handle,
    creator: handle,
    images: [image],
  }
}

export function ogImageUrl(title: string, description: string) {
  return `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
}

/**
 * Open Graph fields every localized page repeats: page-level `openGraph`
 * replaces the root one, so the site name would otherwise be lost.
 */
export async function openGraphBase(locale: Locale, otherLocales: Locale[]) {
  const profile = await getProfile()
  return {
    siteName: profile.displayName,
    locale: LOCALE_TAGS[locale].replace("-", "_"),
    alternateLocale: otherLocales.map((item) =>
      LOCALE_TAGS[item].replace("-", "_")
    ),
  }
}
