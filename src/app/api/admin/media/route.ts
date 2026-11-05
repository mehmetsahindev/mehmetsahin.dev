import { NextResponse } from "next/server"

import { getAdminSession } from "@/features/admin/lib/session"
import { createMedia, MediaError } from "@/features/media/data/media"
import type { UploadMediaResponse } from "@/features/media/types"

/** Multipart upload (`files` field, one or more). */
export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File)

  if (files.length === 0) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }

  const result: UploadMediaResponse = { items: [], errors: [] }

  for (const file of files) {
    try {
      result.items.push(await createMedia(file))
    } catch (error) {
      if (!(error instanceof MediaError)) throw error
      result.errors.push(error.message)
    }
  }

  return NextResponse.json(result, {
    status: result.items.length > 0 ? 201 : 400,
  })
}
