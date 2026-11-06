import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { media } from "./media"

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}

/** Manual order set by drag and drop in the admin (ascending). */
const sortOrder = integer("sort_order").notNull().default(0)

/**
 * An icon chosen in the admin: a Simple Icons slug or an uploaded image.
 * At most one of the two is set.
 */
const iconColumns = {
  iconSlug: text("icon_slug"),
  iconMediaId: uuid("icon_media_id").references(() => media.id, {
    onDelete: "set null",
  }),
}

/* -------------------------------------------------------------------------- */
/* Profile and site settings (single rows)                                    */
/* -------------------------------------------------------------------------- */

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  displayName: text("display_name").notNull().default(""),
  username: text("username").notNull().default(""),
  jobTitle: text("job_title").notNull().default(""),
  /** One line, also used as the site description. */
  bio: text("bio").notNull().default(""),
  /** Phrases rotated under the name in the profile header. */
  taglines: text("taglines").array().notNull().default([]),
  /** Markdown. */
  about: text("about").notNull().default(""),
  location: text("location").notNull().default(""),
  email: text("email").notNull().default(""),
  /** E.164, e.g. +905551112233. */
  phone: text("phone").notNull().default(""),
  timeZone: text("time_zone").notNull().default("Europe/Istanbul"),
  avatarId: uuid("avatar_id").references(() => media.id, {
    onDelete: "set null",
  }),
  ogImageId: uuid("og_image_id").references(() => media.id, {
    onDelete: "set null",
  }),
  keywords: text("keywords").array().notNull().default([]),
  ...timestamps,
})

export type HomeSectionsSettings = Record<string, boolean>

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  /** Visibility per home page section id; missing ids are visible. */
  homeSections: jsonb("home_sections")
    .$type<HomeSectionsSettings>()
    .notNull()
    .default({}),
  /**
   * When the content in `seed/` was applied (or skipped because the database
   * already had content). Set once, so the seed never runs again.
   */
  contentSeededAt: timestamp("content_seeded_at", { withTimezone: true }),
  ...timestamps,
})

/* -------------------------------------------------------------------------- */
/* Social links                                                               */
/* -------------------------------------------------------------------------- */

export const socialLink = pgTable("social_link", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Key of a platform in SOCIAL_PLATFORMS, e.g. "github". */
  platform: text("platform").notNull(),
  handle: text("handle").notNull().default(""),
  url: text("url").notNull(),
  /** Include in the JSON-LD `sameAs` list of the person. */
  sameAs: boolean("same_as").notNull().default(true),
  sortOrder,
  ...timestamps,
})

/* -------------------------------------------------------------------------- */
/* Career                                                                     */
/* -------------------------------------------------------------------------- */

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: text("company_name").notNull(),
  companyWebsite: text("company_website").notNull().default(""),
  logoId: uuid("logo_id").references(() => media.id, { onDelete: "set null" }),
  location: text("location").notNull().default(""),
  /** "On-site" | "Hybrid" | "Remote" or empty. */
  locationType: text("location_type").notNull().default(""),
  sortOrder,
  ...timestamps,
})

export const experiencePosition = pgTable(
  "experience_position",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experienceId: uuid("experience_id")
      .notNull()
      .references(() => experience.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    employmentType: text("employment_type").notNull().default(""),
    /** "YYYY-MM". */
    startDate: text("start_date").notNull(),
    /** "YYYY-MM"; null while the position is current. */
    endDate: text("end_date"),
    /** Markdown. */
    description: text("description").notNull().default(""),
    skills: text("skills").array().notNull().default([]),
    /** Key of a POSITION_ICONS entry. */
    icon: text("icon").notNull().default("code"),
    isExpanded: boolean("is_expanded").notNull().default(false),
    /** Listed in the home page overview while the position is current. */
    showInOverview: boolean("show_in_overview").notNull().default(true),
    sortOrder,
    ...timestamps,
  },
  (table) => [
    index("experience_position_experience_idx").on(table.experienceId),
  ]
)

export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  school: text("school").notNull(),
  degree: text("degree").notNull().default(""),
  fieldOfStudy: text("field_of_study").notNull().default(""),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description").notNull().default(""),
  skills: text("skills").array().notNull().default([]),
  isExpanded: boolean("is_expanded").notNull().default(false),
  sortOrder,
  ...timestamps,
})

export const project = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  url: text("url").notNull().default(""),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description").notNull().default(""),
  skills: text("skills").array().notNull().default([]),
  ...iconColumns,
  isExpanded: boolean("is_expanded").notNull().default(false),
  sortOrder,
  ...timestamps,
})

export const techCategory = pgTable("tech_category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sortOrder,
  ...timestamps,
})

export const techItem = pgTable(
  "tech_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => techCategory.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    url: text("url").notNull().default(""),
    ...iconColumns,
    sortOrder,
    ...timestamps,
  },
  (table) => [index("tech_item_category_idx").on(table.categoryId)]
)

/* -------------------------------------------------------------------------- */
/* Bookmarks                                                                  */
/* -------------------------------------------------------------------------- */

export const bookmarkCategory = pgTable("bookmark_category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  /** URL filter value on /bookmarks, e.g. "ui-library". */
  slug: text("slug").notNull().unique(),
  sortOrder,
  ...timestamps,
})

export const bookmark = pgTable(
  "bookmark",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => bookmarkCategory.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    author: text("author").notNull().default(""),
    /** 1-2 first-person sentences shown on the card. */
    note: text("note").notNull().default(""),
    ...iconColumns,
    /** "YYYY-MM-DD". */
    bookmarkedAt: text("bookmarked_at").notNull(),
    sortOrder,
    ...timestamps,
  },
  (table) => [index("bookmark_category_idx").on(table.categoryId)]
)
