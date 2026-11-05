import Link from "next/link"
import { LOCALE_LABELS, LOCALE_TAGS, type Locale } from "@/i18n/config"
import { LanguagesIcon } from "lucide-react"

import { postPath } from "../lib/paths"

/**
 * Links to the other published languages of a post. Renders nothing when
 * the post exists in a single language.
 */
export function PostLanguageSwitcher({
  locale,
  translations,
  label,
}: {
  locale: Locale
  translations: { locale: Locale; slug: string }[]
  label: string
}) {
  const others = translations.filter((item) => item.locale !== locale)
  if (others.length === 0) return null

  return (
    <nav
      aria-label={label}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <LanguagesIcon className="size-4" aria-hidden />
      <span className="sr-only sm:not-sr-only">{label}</span>
      <ul className="flex items-center gap-1">
        {others.map((item) => (
          <li key={item.locale}>
            <Link
              href={postPath(item.locale, item.slug)}
              hrefLang={LOCALE_TAGS[item.locale]}
              lang={LOCALE_TAGS[item.locale]}
              className="rounded-md px-1.5 py-0.5 font-medium text-foreground underline-offset-4 hover:underline"
            >
              {LOCALE_LABELS[item.locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
