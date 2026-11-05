/**
 * `card` is a server-rendered slot: icons are rendered on the server, so the
 * card crosses into the client filter list as markup, not data.
 */
export type BookmarkListEntry = {
  id: string
  /** Category slug, matched against the `category` search param. */
  category: string
  card: React.ReactNode
}

export type BookmarkFilterCategory = {
  slug: string
  name: string
}
