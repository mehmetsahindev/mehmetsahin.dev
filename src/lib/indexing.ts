import "server-only"

/**
 * True on deployments that must stay out of search engines (for example
 * dev.mehmetsahin.dev), so they do not compete with the live site. Read at
 * request time, so the same image can serve either role.
 */
export function isNoindex() {
  return process.env.SITE_NOINDEX === "true"
}
