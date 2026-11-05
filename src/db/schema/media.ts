import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

/** An uploaded file. The file itself lives in `UPLOADS_DIR/<key>`. */
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** File name on disk and the last segment of its public URL (`/media/<key>`). */
  key: text("key").notNull().unique(),
  /** Name of the file as it was uploaded, shown in the admin. */
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Where a media file is referenced. Rows are rewritten every time the owning
 * record is saved, so `label` and `href` stay in sync with it. A file with
 * usages cannot be deleted (`restrict`).
 */
export const mediaUsage = pgTable(
  "media_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "restrict" }),
    /** Kind of record, e.g. "profile" or "post". */
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    /** Field on the record, e.g. "avatar" or "content.tr". */
    field: text("field").notNull(),
    /** Human-readable name of the record, e.g. the post title. */
    label: text("label").notNull(),
    /** Admin URL of the record. */
    href: text("href").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("media_usage_unique_idx").on(
      table.mediaId,
      table.entityType,
      table.entityId,
      table.field
    ),
    index("media_usage_entity_idx").on(table.entityType, table.entityId),
  ]
)

export type Media = typeof media.$inferSelect
export type MediaUsage = typeof mediaUsage.$inferSelect
