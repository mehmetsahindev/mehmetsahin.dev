import type { Person, WebSite, WithContext } from "schema-dts"

import { SITE_URL } from "@/config/site"
import { getProfile, getSocialLinks } from "@/features/portfolio/data/queries"

/**
 * Stable @id anchors so Google can merge JSON-LD nodes across separate
 * <script> blocks (and pages) into a single entity in the Knowledge Graph.
 * The "#fragment" keeps each node id distinct from the page URL itself.
 */
export const JSON_LD_ID = {
  website: `${SITE_URL}/#website`,
  person: `${SITE_URL}/#person`,
} as const

export async function getPersonJsonLd(): Promise<Person> {
  const [profile, socialLinks] = await Promise.all([
    getProfile(),
    getSocialLinks(),
  ])

  return {
    "@type": "Person",
    "@id": JSON_LD_ID.person,
    name: profile.displayName,
    alternateName: profile.username ? [profile.username] : undefined,
    identifier: profile.username || undefined,
    image: profile.avatarUrl ? `${SITE_URL}${profile.avatarUrl}` : undefined,
    url: SITE_URL,
    // Public profiles opt in via their `sameAs` flag (Knowledge Graph).
    sameAs: socialLinks.filter((link) => link.sameAs).map((link) => link.url),
  }
}

export async function getWebSiteJsonLd(): Promise<WithContext<WebSite>> {
  const profile = await getProfile()

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": JSON_LD_ID.website,
    name: profile.displayName,
    url: SITE_URL,
    author: await getPersonJsonLd(),
  }
}
