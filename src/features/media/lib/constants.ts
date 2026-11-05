/** Accepted upload types, mapped to the extension used on disk. */
export const MEDIA_MIME_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
} as const

export type MediaMimeType = keyof typeof MEDIA_MIME_TYPES

export const MEDIA_MAX_SIZE = 10 * 1024 * 1024

export const MEDIA_ACCEPT = Object.keys(MEDIA_MIME_TYPES).join(",")

/** Public URL prefix that serves uploaded files. */
export const MEDIA_URL_PREFIX = "/media/"

export type MediaKind = "image" | "document"

export function isAllowedMimeType(type: string): type is MediaMimeType {
  return type in MEDIA_MIME_TYPES
}

export function getMediaKind(mimeType: string): MediaKind {
  return mimeType.startsWith("image/") ? "image" : "document"
}

export function getMediaUrl(key: string) {
  return `${MEDIA_URL_PREFIX}${key}`
}
