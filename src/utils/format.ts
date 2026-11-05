/**
 * Always `en-US`, never the runtime locale: a client component would pick up
 * the visitor's locale while a server component picks up the host's, so the
 * same figure could render as `1,234` in one place and `1.234` in another on
 * the same page.
 *
 * Module-level because constructing an `Intl` formatter is the expensive part,
 * not formatting with it.
 */
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
})

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value)
}

export function formatCompactNumber(value: number): string {
  return COMPACT_NUMBER_FORMATTER.format(value)
}

/**
 * Formats a duration given in seconds into a compact `Xh Ym Zs` string.
 * Zero-valued units are omitted; a zero duration renders as `0s`.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.round(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0) parts.push(`${secs}s`)

  return parts.length > 0 ? parts.join(" ") : "0s"
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}
