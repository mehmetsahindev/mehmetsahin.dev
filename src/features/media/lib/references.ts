import { MEDIA_URL_PREFIX } from "./constants"

const KEY_PATTERN = "[A-Za-z0-9][A-Za-z0-9._-]*"

const MEDIA_URL_REGEX = new RegExp(
  `${MEDIA_URL_PREFIX.replace(/\//g, "\\/")}(${KEY_PATTERN})`,
  "g"
)

/**
 * Media keys referenced in a piece of Markdown (or any text), via URLs like
 * `/media/<key>` or `https://site/media/<key>`. Duplicates are removed.
 */
export function extractMediaKeys(text: string): string[] {
  const keys = new Set<string>()

  for (const match of text.matchAll(MEDIA_URL_REGEX)) {
    // Trailing dots come from sentence punctuation, not the key.
    keys.add(match[1].replace(/\.+$/, ""))
  }

  return [...keys]
}

export function isValidMediaKey(key: string) {
  return new RegExp(`^${KEY_PATTERN}$`).test(key) && !key.includes("..")
}
