/**
 * URL-safe slug: lowercase ASCII words joined by dashes. Handles Turkish
 * letters that do not decompose under NFKD (ı, İ).
 */
export function slugify(value: string): string {
  return value
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
