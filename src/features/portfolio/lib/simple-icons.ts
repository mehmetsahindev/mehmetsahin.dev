import "server-only"

import * as simpleIcons from "simple-icons"

export type SimpleIconSummary = {
  slug: string
  title: string
  path: string
  hex: string
}

let bySlug: Map<string, SimpleIconSummary> | undefined

// ~3.5k icons; built once per server process and kept out of client bundles.
function getIndex() {
  bySlug ??= new Map(
    Object.values(simpleIcons)
      .filter((icon): icon is simpleIcons.SimpleIcon =>
        Boolean(icon && typeof icon === "object" && "slug" in icon)
      )
      .map((icon) => [
        icon.slug,
        { slug: icon.slug, title: icon.title, path: icon.path, hex: icon.hex },
      ])
  )
  return bySlug
}

export function getSimpleIcon(slug: string) {
  return getIndex().get(slug)
}

export function searchSimpleIcons(query: string, limit = 60) {
  const q = query.trim().toLowerCase()
  const results: SimpleIconSummary[] = []

  for (const icon of getIndex().values()) {
    if (!q || icon.title.toLowerCase().includes(q) || icon.slug.includes(q)) {
      results.push(icon)
    }
  }

  // Exact and prefix matches first.
  results.sort((a, b) => rank(a, q) - rank(b, q))
  return results.slice(0, limit)
}

function rank(icon: SimpleIconSummary, q: string) {
  const title = icon.title.toLowerCase()
  if (title === q || icon.slug === q) return 0
  if (title.startsWith(q)) return 1
  return 2
}
