"use server"

import { requireAdmin } from "@/features/admin/lib/session"
import {
  searchSimpleIcons,
  type SimpleIconSummary,
} from "@/features/portfolio/lib/simple-icons"

export async function searchSimpleIconsAction(
  query: string
): Promise<SimpleIconSummary[]> {
  await requireAdmin()
  return searchSimpleIcons(query.slice(0, 50), 48)
}
