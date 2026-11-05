"use client"

import { useBookmarkFilters } from "../lib/search-params"
import type { BookmarkFilterCategory } from "../types"

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="border-r border-line p-4 font-mono text-[.8125rem]/4 font-medium tracking-wide text-muted-foreground uppercase transition-[color,background-color] ease-out hover:bg-accent-muted aria-pressed:bg-accent-muted aria-pressed:text-foreground"
    >
      {children}
    </button>
  )
}

export function BookmarkFilters({
  categories,
}: {
  categories: BookmarkFilterCategory[]
}) {
  const [filters, setFilters] = useBookmarkFilters()

  return (
    <div className="no-scrollbar scroll-fade-x overflow-x-auto">
      <div
        className="flex w-max items-center pr-2 whitespace-nowrap"
        role="group"
        aria-labelledby="bookmark-category-filter-label"
      >
        <span id="bookmark-category-filter-label" className="sr-only">
          Filter by category
        </span>

        <FilterTab
          active={filters.category === null}
          onClick={() => setFilters({ category: null })}
        >
          All
        </FilterTab>

        {categories.map((category) => (
          <FilterTab
            key={category.slug}
            active={filters.category === category.slug}
            onClick={() => setFilters({ category: category.slug })}
          >
            {category.name}
          </FilterTab>
        ))}
      </div>
    </div>
  )
}
