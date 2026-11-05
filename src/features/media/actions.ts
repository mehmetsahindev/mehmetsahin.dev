"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAdmin } from "@/features/admin/lib/session"

import {
  deleteMedia,
  getMediaUsages,
  listMedia,
  MediaError,
  updateMediaAlt,
} from "./data/media"
import type { MediaItem, MediaUsageItem } from "./types"

export type ActionResult = { ok: true } | { ok: false; error: string }

const idSchema = z.uuid()

export async function listMediaAction(): Promise<MediaItem[]> {
  await requireAdmin()
  return listMedia()
}

export async function getMediaUsagesAction(
  id: string
): Promise<MediaUsageItem[]> {
  await requireAdmin()
  return getMediaUsages(idSchema.parse(id))
}

export async function updateMediaAltAction(
  id: string,
  alt: string
): Promise<ActionResult> {
  await requireAdmin()

  const parsed = z
    .object({ id: idSchema, alt: z.string().max(500) })
    .safeParse({ id, alt })

  if (!parsed.success) {
    return { ok: false, error: "Alt text must be 500 characters or fewer." }
  }

  await updateMediaAlt(parsed.data.id, parsed.data.alt)
  revalidatePath("/admin/media")

  return { ok: true }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  await requireAdmin()

  try {
    await deleteMedia(idSchema.parse(id))
  } catch (error) {
    if (error instanceof MediaError) {
      return { ok: false, error: error.message }
    }
    throw error
  }

  revalidatePath("/admin/media")

  return { ok: true }
}
