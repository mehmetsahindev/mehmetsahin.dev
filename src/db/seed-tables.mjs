/**
 * Content tables in `seed/data.json`, in insert order (foreign keys first).
 * Auth tables are left out on purpose: sessions and accounts belong to each
 * deployment.
 */
export const SEED_TABLES = [
  "media",
  "profile",
  "site_settings",
  "social_link",
  "experience",
  "experience_position",
  "education",
  "project",
  "tech_category",
  "tech_item",
  "bookmark_category",
  "bookmark",
  "post",
  "post_translation",
  "media_usage",
]

/** Per-deployment columns that are never exported. */
export const SEED_EXCLUDED_COLUMNS = {
  site_settings: ["content_seeded_at"],
}
