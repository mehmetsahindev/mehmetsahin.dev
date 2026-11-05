export async function register() {
  // Apply pending database migrations once per server start. Skipped during
  // `next build` (no database there) and in the Edge runtime.
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  if (process.env.NEXT_PHASE === "phase-production-build") return
  if (!process.env.DATABASE_URL) return

  const { runMigrations } = await import("@/db/migrate")
  await runMigrations()
}
