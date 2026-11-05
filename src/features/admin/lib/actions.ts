import "server-only"

import { revalidatePath, updateTag } from "next/cache"
import type { z } from "zod"

import { PORTFOLIO_TAG } from "@/features/portfolio/data/queries"

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

/** First message per field, keyed by dotted path (e.g. "positions.0.title"). */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".")
    fieldErrors[key] ??= issue.message
  }
  return fieldErrors
}

export function invalidResult(error: z.ZodError) {
  return {
    ok: false as const,
    error: "Please fix the highlighted fields.",
    fieldErrors: toFieldErrors(error),
  }
}

/**
 * Expire cached site data after a save so the change shows up immediately,
 * and refresh the admin page that was edited.
 */
export function refreshPortfolio(adminPath: string) {
  updateTag(PORTFOLIO_TAG)
  revalidatePath(adminPath)
}
