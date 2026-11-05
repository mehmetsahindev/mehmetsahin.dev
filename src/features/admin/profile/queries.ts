import "server-only"

import { getDb, schema } from "@/db"
import { eq } from "drizzle-orm"

import { getMediaItemsByIds } from "@/features/media/data/media"
import type { MediaItem } from "@/features/media/types"

import type { ProfileInput } from "./schema"

export type ProfileFormData = {
  values: ProfileInput
  avatar: MediaItem | null
  ogImage: MediaItem | null
}

export async function getProfileForAdmin(): Promise<ProfileFormData> {
  const [row] = await getDb()
    .select()
    .from(schema.profile)
    .where(eq(schema.profile.id, 1))
    .limit(1)

  if (!row) throw new Error("Profile row is missing.")

  const media = await getMediaItemsByIds([row.avatarId, row.ogImageId])

  return {
    values: {
      displayName: row.displayName,
      firstName: row.firstName,
      lastName: row.lastName,
      username: row.username,
      jobTitle: row.jobTitle,
      bio: row.bio,
      taglines: row.taglines,
      about: row.about,
      location: row.location,
      email: row.email,
      phone: row.phone,
      timeZone: row.timeZone,
      avatarId: row.avatarId,
      ogImageId: row.ogImageId,
      keywords: row.keywords,
    },
    avatar: row.avatarId ? (media.get(row.avatarId) ?? null) : null,
    ogImage: row.ogImageId ? (media.get(row.ogImageId) ?? null) : null,
  }
}
