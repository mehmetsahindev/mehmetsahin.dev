import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "@/lib/env"

import * as schema from "./schema"

function createDb() {
  const client = postgres(env.DATABASE_URL, { max: 10, prepare: false })
  return drizzle(client, { schema, casing: "snake_case" })
}

type Db = ReturnType<typeof createDb>

// One pool per process (also survives hot reloads in development). Created on
// first use so `next build` never needs a database connection.
const globalForDb = globalThis as unknown as { db?: Db }

export function getDb(): Db {
  globalForDb.db ??= createDb()
  return globalForDb.db
}

export { schema }
