import { enUS, tr } from "date-fns/locale"

import type { Locale } from "./config"

/** UI strings of localized pages. Add a key to every locale. */
const messages = {
  en: {
    blog: {
      title: "Blog",
      tagline: "Blog",
      heading: "Writing",
      description: "Stories, milestones, and things I learn along the way.",
      searchPlaceholder: "Search posts…",
      noResults: "No posts found.",
      empty: "No posts yet.",
      publishedOn: "Published on",
      updatedOn: "Updated on",
      previous: "Previous post",
      next: "Next post",
      allPosts: "All posts",
      readIn: "Read in",
      home: "Home",
    },
  },
  tr: {
    blog: {
      title: "Blog",
      tagline: "Blog",
      heading: "Yazılar",
      description: "Hikâyeler, kilometre taşları ve yol boyunca öğrendiklerim.",
      searchPlaceholder: "Yazılarda ara…",
      noResults: "Yazı bulunamadı.",
      empty: "Henüz yazı yok.",
      publishedOn: "Yayın tarihi",
      updatedOn: "Güncelleme tarihi",
      previous: "Önceki yazı",
      next: "Sonraki yazı",
      allPosts: "Tüm yazılar",
      readIn: "Bu yazıyı oku:",
      home: "Ana sayfa",
    },
  },
} satisfies Record<Locale, unknown>

export type Messages = (typeof messages)["en"]

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}

export const DATE_LOCALES = { en: enUS, tr } satisfies Record<Locale, unknown>
