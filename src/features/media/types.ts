import type { MediaKind } from "./lib/constants"

/** Serializable media record passed to client components. */
export type MediaItem = {
  id: string
  key: string
  fileName: string
  mimeType: string
  kind: MediaKind
  size: number
  width: number | null
  height: number | null
  alt: string
  /** ISO date string. */
  createdAt: string
  usageCount: number
}

export type MediaUsageItem = {
  entityType: string
  entityId: string
  field: string
  label: string
  href: string
}

export type UploadMediaResponse = {
  items: MediaItem[]
  errors: string[]
}
