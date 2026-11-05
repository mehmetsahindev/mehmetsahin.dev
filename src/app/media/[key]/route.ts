import { getDb, schema } from "@/db"
import { eq } from "drizzle-orm"

import { isValidMediaKey } from "@/features/media/lib/references"
import { readMediaFile } from "@/features/media/lib/storage"

/**
 * Serves uploaded files. Keys never change once created, so responses can be
 * cached forever.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  if (!isValidMediaKey(key)) {
    return new Response("Not found", { status: 404 })
  }

  const [row] = await getDb()
    .select({
      mimeType: schema.media.mimeType,
      fileName: schema.media.fileName,
    })
    .from(schema.media)
    .where(eq(schema.media.key, key))
    .limit(1)

  if (!row) {
    return new Response("Not found", { status: 404 })
  }

  let data: Buffer
  try {
    data = await readMediaFile(key)
  } catch {
    return new Response("Not found", { status: 404 })
  }

  const headers = new Headers({
    "Content-Type": row.mimeType,
    "Content-Length": String(data.byteLength),
    "Content-Disposition": `inline; filename="${encodeURIComponent(row.fileName)}"`,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  })

  if (row.mimeType === "image/svg+xml") {
    // Opened directly, an uploaded SVG must never run scripts on this origin.
    // Not applied to PDFs: a sandboxed document blocks the browser viewer.
    headers.set(
      "Content-Security-Policy",
      "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox"
    )
  }

  return new Response(new Uint8Array(data), { headers })
}
