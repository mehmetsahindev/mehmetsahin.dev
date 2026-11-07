import Link from "next/link"
import { LOCALE_LABELS, LOCALE_TAGS, type Locale } from "@/i18n/config"

import { cn } from "@/lib/utils"

import { postPath } from "../lib/paths"

// Display order in the switch.
const SWITCH_ORDER: Locale[] = ["en", "tr"]

/**
 * Segmented TR/EN switch between the published languages of a post. Renders
 * nothing when the post exists in a single language.
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
  if (!translations.some((item) => item.locale !== locale)) return null

  const items = [...translations].sort(
    (a, b) => SWITCH_ORDER.indexOf(a.locale) - SWITCH_ORDER.indexOf(b.locale)
  )

  return (
    <nav
      aria-label={label}
      className="flex h-7 items-center rounded-md bg-secondary p-0.5"
    >
      {items.map((item) => {
        const isCurrent = item.locale === locale
        const className = cn(
          "flex h-6 items-center rounded-[5px] px-2 text-xs font-medium transition-colors",
          isCurrent
            ? "bg-background text-foreground shadow-xs dark:bg-foreground/15"
            : "text-muted-foreground hover:text-foreground"
        )

        return isCurrent ? (
          <span
            key={item.locale}
            aria-current="page"
            title={LOCALE_LABELS[item.locale]}
            className={className}
          >
            {item.locale.toUpperCase()}
          </span>
        ) : (
          <Link
            key={item.locale}
            href={postPath(item.locale, item.slug)}
            hrefLang={LOCALE_TAGS[item.locale]}
            lang={LOCALE_TAGS[item.locale]}
            title={LOCALE_LABELS[item.locale]}
            aria-label={LOCALE_LABELS[item.locale]}
            className={className}
          >
            {item.locale.toUpperCase()}
          </Link>
        )
      })}
    </nav>
  )
}
