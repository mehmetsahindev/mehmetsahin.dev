/**
 * Site languages. The default locale has no URL prefix (`/blog`), the others
 * do (`/tr/blog`). Only the blog is localized for now; other routes can move
 * under `[locale]` later and reuse this config and `src/proxy.ts`.
 */
export const LOCALES = ["en", "tr"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

/** Request header set by src/proxy.ts on localized routes. */
export const LOCALE_HEADER = "x-site-locale"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
}

/** BCP 47 tags for `lang`, `hreflang` and Open Graph. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-US",
  tr: "tr-TR",
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Prefixes a path with the locale unless it is the default one. */
export function localizePath(locale: Locale, path: string) {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`
}
