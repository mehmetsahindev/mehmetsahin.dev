import type { Route } from "next"
import { localizePath, type Locale } from "@/i18n/config"

export function blogPath(locale: Locale) {
  return localizePath(locale, "/blog") as Route
}

export function postPath(locale: Locale, slug: string) {
  return localizePath(locale, `/blog/${slug}`) as Route
}
