import "server-only"

import { randomBytes } from "node:crypto"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { slugify } from "@/utils/slugify"

import { env } from "@/lib/env"

import { MEDIA_MIME_TYPES, type MediaMimeType } from "./constants"
import { isValidMediaKey } from "./references"

function getUploadsDir() {
  // The uploads directory is a runtime volume, not part of the build output.
  return path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    env.UPLOADS_DIR
  )
}

function resolveKeyPath(key: string) {
  if (!isValidMediaKey(key)) {
    throw new Error(`Invalid media key: ${key}`)
  }
  return path.join(/* turbopackIgnore: true */ getUploadsDir(), key)
}

/** `<readable-name>-<random>.<ext>`, unique enough to cache forever. */
export function createMediaKey(fileName: string, mimeType: MediaMimeType) {
  const baseName = fileName.replace(/\.[^.]+$/, "")
  const slug = slugify(baseName).slice(0, 60) || "file"
  const suffix = randomBytes(4).toString("hex")
  return `${slug}-${suffix}.${MEDIA_MIME_TYPES[mimeType]}`
}

export async function writeMediaFile(key: string, data: Buffer) {
  await mkdir(getUploadsDir(), { recursive: true })
  // `wx` refuses to overwrite: keys are immutable once published.
  await writeFile(resolveKeyPath(key), data, { flag: "wx" })
}

export async function readMediaFile(key: string) {
  return readFile(resolveKeyPath(key))
}

export async function deleteMediaFile(key: string) {
  await rm(resolveKeyPath(key), { force: true })
}
