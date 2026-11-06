// Writes the content of the local database to `seed/`, which a fresh
// deployment applies on its first start (see src/db/seed.ts).
//
// Usage: pnpm db:seed:export
// Media files that nothing uses are skipped.
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import postgres from "postgres"

import { SEED_EXCLUDED_COLUMNS, SEED_TABLES } from "../src/db/seed-tables.mjs"

const root = process.cwd()
const seedDir = path.join(root, "seed")
const uploadsDir = path.resolve(root, process.env.UPLOADS_DIR || "./uploads")

const sql = postgres(process.env.DATABASE_URL, { max: 1 })

try {
  const tables = {}

  for (const table of SEED_TABLES) {
    const where =
      table === "media"
        ? sql`where exists (select 1 from media_usage u where u.media_id = t.id)`
        : sql``
    const [{ rows }] = await sql`
      select coalesce(json_agg(t), '[]'::json) as rows
      from ${sql(table)} t ${where}`
    const excluded = SEED_EXCLUDED_COLUMNS[table] ?? []
    tables[table] = rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).filter(([column]) => !excluded.includes(column))
      )
    )
  }

  await rm(seedDir, { recursive: true, force: true })
  await mkdir(path.join(seedDir, "media"), { recursive: true })

  for (const { key } of tables.media) {
    await copyFile(path.join(uploadsDir, key), path.join(seedDir, "media", key))
  }

  await writeFile(
    path.join(seedDir, "data.json"),
    JSON.stringify({ version: 1, tables }, null, 2) + "\n"
  )

  for (const [table, rows] of Object.entries(tables)) {
    console.log(`${table.padEnd(20)} ${rows.length}`)
  }
  console.log(`\nWrote ${path.relative(root, seedDir)}/`)
} finally {
  await sql.end()
}
