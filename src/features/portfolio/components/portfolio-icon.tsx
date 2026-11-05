import { getMediaUrl } from "@/features/media/lib/constants"

import type { IconRef } from "../data/types"
import { getSimpleIcon } from "../lib/simple-icons"

/**
 * Renders an icon picked in the admin: a Simple Icons glyph (inherits the
 * current color) or an uploaded image. Returns null when none is set.
 */
export function PortfolioIcon({ icon }: { icon: IconRef }) {
  if (icon.mediaKey) {
    return (
      <img
        src={getMediaUrl(icon.mediaKey)}
        alt=""
        aria-hidden
        className="object-contain"
      />
    )
  }

  const simpleIcon = icon.slug ? getSimpleIcon(icon.slug) : undefined

  if (simpleIcon) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d={simpleIcon.path} />
      </svg>
    )
  }

  return null
}

export function hasIcon(icon: IconRef) {
  return Boolean(icon.mediaKey || icon.slug)
}
