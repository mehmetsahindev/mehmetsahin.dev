import "server-only"

import { getDb, schema } from "@/db"
import { and, count, desc, eq, inArray } from "drizzle-orm"
import sharp from "sharp"

import {
  getMediaKind,
  isAllowedMimeType,
  MEDIA_MAX_SIZE,
} from "../lib/constants"
import { extractMediaKeys } from "../lib/references"
import { createMediaKey, deleteMediaFile, writeMediaFile } from "../lib/storage"
import type { MediaItem, MediaUsageItem } from "../types"

const { media, mediaUsage } = schema

export class MediaError extends Error {}

function toMediaItem(
  row: typeof media.$inferSelect,
  usageCount: number
): MediaItem {
  return {
    id: row.id,
    key: row.key,
    fileName: row.fileName,
    mimeType: row.mimeType,
    kind: getMediaKind(row.mimeType),
    size: row.size,
    width: row.width,
    height: row.height,
    alt: row.alt,
    createdAt: row.createdAt.toISOString(),
    usageCount,
  }
}

export async function listMedia(): Promise<MediaItem[]> {
  const db = getDb()

  const rows = await db
    .select({ media, usageCount: count(mediaUsage.id) })
    .from(media)
    .leftJoin(mediaUsage, eq(mediaUsage.mediaId, media.id))
    .groupBy(media.id)
    .orderBy(desc(media.createdAt))

  return rows.map((row) => toMediaItem(row.media, row.usageCount))
}

/** Media records by id, for showing picked files in admin forms. */
export async function getMediaItemsByIds(
  ids: (string | null | undefined)[]
): Promise<Map<string, MediaItem>> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))]
  if (unique.length === 0) return new Map()

  const rows = await getDb()
    .select({ media, usageCount: count(mediaUsage.id) })
    .from(media)
    .leftJoin(mediaUsage, eq(mediaUsage.mediaId, media.id))
    .where(inArray(media.id, unique))
    .groupBy(media.id)

  return new Map(
    rows.map((row) => [row.media.id, toMediaItem(row.media, row.usageCount)])
  )
}

export async function getMediaUsages(
  mediaId: string
): Promise<MediaUsageItem[]> {
  const rows = await getDb()
    .select()
    .from(mediaUsage)
    .where(eq(mediaUsage.mediaId, mediaId))
    .orderBy(mediaUsage.label)

  return rows.map((row) => ({
    entityType: row.entityType,
    entityId: row.entityId,
    field: row.field,
    label: row.label,
    href: row.href,
  }))
}

async function readImageSize(data: Buffer, mimeType: string) {
  if (getMediaKind(mimeType) !== "image") {
    return { width: null, height: null }
  }

  try {
    const { width, height } = await sharp(data).metadata()
    return { width: width ?? null, height: height ?? null }
  } catch {
    return { width: null, height: null }
  }
}

export async function createMedia(file: File): Promise<MediaItem> {
  if (!isAllowedMimeType(file.type)) {
    throw new MediaError(`${file.name}: file type is not supported.`)
  }

  if (file.size > MEDIA_MAX_SIZE) {
    throw new MediaError(`${file.name}: file is larger than 10 MB.`)
  }

  const data = Buffer.from(await file.arrayBuffer())
  const key = createMediaKey(file.name, file.type)
  const { width, height } = await readImageSize(data, file.type)

  await writeMediaFile(key, data)

  try {
    const [row] = await getDb()
      .insert(media)
      .values({
        key,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
      })
      .returning()

    return toMediaItem(row, 0)
  } catch (error) {
    await deleteMediaFile(key)
    throw error
  }
}

export async function updateMediaAlt(id: string, alt: string) {
  await getDb().update(media).set({ alt: alt.trim() }).where(eq(media.id, id))
}

export async function deleteMedia(id: string) {
  const db = getDb()

  const [usage] = await db
    .select({ value: count() })
    .from(mediaUsage)
    .where(eq(mediaUsage.mediaId, id))

  if (usage.value > 0) {
    throw new MediaError(
      "This file is in use. Remove it from those places first."
    )
  }

  const [row] = await db.delete(media).where(eq(media.id, id)).returning()

  if (row) {
    await deleteMediaFile(row.key)
  }
}

/* -------------------------------------------------------------------------- */
/* Usage tracking                                                             */
/* -------------------------------------------------------------------------- */

export type MediaUsageOwner = {
  /** Kind of record, e.g. "profile" or "post". */
  entityType: string
  entityId: string
  /** Shown in the media library, e.g. the post title. */
  label: string
  /** Admin URL of the record. */
  href: string
}

/**
 * Per-field references held by a record: a media id, a list of ids, or
 * Markdown text whose `/media/<key>` URLs are extracted.
 */
export type MediaUsageFields = Record<
  string,
  | { mediaId: string | null | undefined }
  | { mediaIds: string[] }
  | { markdown: string | null | undefined }
>

/**
 * Replaces every usage row of a record with the references it holds now.
 * Call it whenever the record is saved.
 */
export async function syncMediaUsage(
  owner: MediaUsageOwner,
  fields: MediaUsageFields
) {
  const db = getDb()

  const keysByField = new Map<string, string[]>()
  const idsByField = new Map<string, string[]>()

  for (const [field, value] of Object.entries(fields)) {
    if ("mediaId" in value) {
      idsByField.set(field, value.mediaId ? [value.mediaId] : [])
    } else if ("mediaIds" in value) {
      idsByField.set(field, value.mediaIds)
    } else {
      keysByField.set(field, extractMediaKeys(value.markdown ?? ""))
    }
  }

  const allKeys = [...new Set([...keysByField.values()].flat())]
  const keyRows = allKeys.length
    ? await db
        .select({ id: media.id, key: media.key })
        .from(media)
        .where(inArray(media.key, allKeys))
    : []
  const idByKey = new Map(keyRows.map((row) => [row.key, row.id]))

  for (const [field, keys] of keysByField) {
    idsByField.set(
      field,
      keys.flatMap((key) => idByKey.get(key) ?? [])
    )
  }

  const rows = [...idsByField].flatMap(([field, ids]) =>
    [...new Set(ids)].map((mediaId) => ({ ...owner, field, mediaId }))
  )

  await db.transaction(async (tx) => {
    await clearUsage(tx, owner.entityType, owner.entityId)
    if (rows.length > 0) {
      await tx.insert(mediaUsage).values(rows).onConflictDoNothing()
    }
  })
}

/** Call when a record is deleted so its files can be removed again. */
export async function clearMediaUsage(entityType: string, entityId: string) {
  await clearUsage(getDb(), entityType, entityId)
}

function clearUsage(
  db: Pick<ReturnType<typeof getDb>, "delete">,
  entityType: string,
  entityId: string
) {
  return db
    .delete(mediaUsage)
    .where(
      and(
        eq(mediaUsage.entityType, entityType),
        eq(mediaUsage.entityId, entityId)
      )
    )
}
