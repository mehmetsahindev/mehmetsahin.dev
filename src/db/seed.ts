import { existsSync } from "node:fs"
import { copyFile, mkdir, readFile } from "node:fs/promises"
import path from "node:path"
import postgres from "postgres"

import { SEED_TABLES } from "./seed-tables.mjs"

type SeedData = {
  version: number
  tables: Record<string, Record<string, unknown>[]>
}

const SEED_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "seed")

/**
 * Fills a fresh database with the content exported to `seed/` (see
 * `pnpm db:seed:export`), so a new deployment does not start empty.
 *
 * Runs at most once per database: `site_settings.content_seeded_at` is set
 * whether the seed was applied or skipped because the database already had
 * content. Existing content is never overwritten.
 */
export async function seedIfEmpty() {
  const dataPath = path.join(/* turbopackIgnore: true */ SEED_DIR, "data.json")
  const client = postgres(process.env.DATABASE_URL!, { max: 1 })

  try {
    await client.begin(async (sql) => {
      const [settings] = await sql`
        select content_seeded_at from site_settings where id = 1 for update`
      if (!settings || settings.content_seeded_at) return

      const [{ hasContent }] = await sql`
        select (exists (select 1 from media)
          or exists (select 1 from experience)
          or exists (select 1 from post)) as "hasContent"`

      if (!hasContent && existsSync(dataPath)) {
        const data = JSON.parse(await readFile(dataPath, "utf8")) as SeedData
        await copyMediaFiles(data.tables.media ?? [])

        // Rows created by the migrations (profile, settings, default social
        // links and bookmark categories) are replaced by the exported ones.
        for (const table of [...SEED_TABLES].reverse()) {
          await sql`delete from ${sql(table)}`
        }

        for (const table of SEED_TABLES) {
          const rows = data.tables[table] ?? []
          if (rows.length === 0) continue

          // Only the exported columns, so columns added later keep defaults.
          const columns = Object.keys(rows[0])
          await sql`
            insert into ${sql(table)} ${sql(columns)}
            select ${sql(columns)}
            from json_populate_recordset(null::${sql(table)}, ${JSON.stringify(rows)}::text::json)`
        }

        console.log("[seed] Applied the content from seed/data.json")
      }

      await sql`update site_settings set content_seeded_at = now() where id = 1`
    })
  } finally {
    await client.end()
  }
}

async function copyMediaFiles(rows: Record<string, unknown>[]) {
  const uploadsDir = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    process.env.UPLOADS_DIR || "./uploads"
  )
  await mkdir(uploadsDir, { recursive: true })

  for (const row of rows) {
    const key = String(row.key)
    const target = path.join(/* turbopackIgnore: true */ uploadsDir, key)
    if (existsSync(target)) continue
    await copyFile(
      path.join(/* turbopackIgnore: true */ SEED_DIR, "media", key),
      target
    )
  }
}
