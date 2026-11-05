import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { media } from "./media"

/** Language-independent part of a blog post. */
export const post = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  coverId: uuid("cover_id").references(() => media.id, {
    onDelete: "set null",
  }),
  /** "YYYY-MM-DD", shown as the publish date and used for ordering. */
  publishedAt: text("published_at").notNull(),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/** One language version of a post, with its own slug and status. */
export const postTranslation = pgTable(
  "post_translation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    /** Key of LOCALES in src/i18n/config.ts. */
    locale: text("locale").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    /** Markdown with a few MDX components (Callout, Tabs…). */
    content: text("content").notNull().default(""),
    /** "draft" | "published". */
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("post_translation_post_locale_idx").on(
      table.postId,
      table.locale
    ),
    uniqueIndex("post_translation_locale_slug_idx").on(
      table.locale,
      table.slug
    ),
    index("post_translation_status_idx").on(table.locale, table.status),
  ]
)
