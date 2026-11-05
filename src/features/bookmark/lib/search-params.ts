import type { Options } from "nuqs"
import { useQueryStates } from "nuqs"
import { parseAsString } from "nuqs/server"

const bookmarkSearchParams = {
  /** Slug of a bookmark category managed in the admin. */
  category: parseAsString,
}

export function useBookmarkFilters(options: Options = {}) {
  const [filters, setFilters] = useQueryStates(bookmarkSearchParams, options)

  return [filters, setFilters] as const
}
