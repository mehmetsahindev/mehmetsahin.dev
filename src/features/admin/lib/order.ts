import "server-only"

import { getDb } from "@/db"
import { eq, max } from "drizzle-orm"
import type { PgColumn, PgTable } from "drizzle-orm/pg-core"
import { z } from "zod"

type SortableTable = PgTable & { id: PgColumn; sortOrder: PgColumn }

const idsSchema = z.array(z.uuid()).max(500)

/** Persists a drag-and-drop order: each id gets its index as sort order. */
export async function saveOrder(table: SortableTable, ids: string[]) {
  const parsed = idsSchema.parse(ids)

  await getDb().transaction(async (tx) => {
    for (const [index, id] of parsed.entries()) {
      await tx
        .update(table)
        .set({ sortOrder: index } as never)
        .where(eq(table.id, id))
    }
  })
}

/** Sort order that places a new row at the end of the list. */
export async function nextSortOrder(table: SortableTable) {
  const [row] = await getDb()
    .select({ value: max(table.sortOrder) })
    .from(table)
  return row?.value == null ? 0 : Number(row.value) + 1
}
