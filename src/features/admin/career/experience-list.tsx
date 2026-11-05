"use client"

import type { Route } from "next"
import Link from "next/link"
import { BriefcaseBusinessIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ExperienceData } from "@/features/portfolio/data/types"
import { formatMonth } from "@/features/portfolio/lib/dates"

import { AdminPageHeader } from "../components/admin-page"
import { SortableList } from "../components/form/sortable-list"
import { ListEmpty } from "../components/list-empty"
import { useSortableItems } from "../hooks/use-sortable-items"
import { reorderExperiencesAction } from "./actions"

export function ExperienceList({ items }: { items: ExperienceData[] }) {
  const { ordered, onReorder, onCommit } = useSortableItems(
    items,
    reorderExperiencesAction
  )

  const addButton = (
    <Button nativeButton={false} render={<Link href="/admin/experience/new" />}>
      <PlusIcon />
      Add company
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Experience"
        description="Companies and the positions you held there. Drag to reorder."
        actions={items.length > 0 ? addButton : undefined}
      />

      {ordered.length === 0 ? (
        <ListEmpty
          icon={<BriefcaseBusinessIcon />}
          title="No experience yet"
          description="Add a company, then the positions you held there."
          action={addButton}
        />
      ) : (
        <SortableList
          items={ordered}
          getId={(item) => item.id}
          onReorder={onReorder}
          onCommit={onCommit}
          renderItem={(item) => {
            const first = item.positions.at(-1)
            const latest = item.positions[0]

            return (
              <Link
                href={`/admin/experience/${item.id}` as Route}
                className="group flex items-center gap-3 py-3 pr-3 pl-1"
              >
                <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-muted/40">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="size-full object-contain"
                    />
                  ) : (
                    <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {item.companyName}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {latest?.title}
                    {item.positions.length > 1 &&
                      ` +${item.positions.length - 1} more`}
                  </span>
                </div>
                {first && latest && (
                  <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:block">
                    {formatMonth(first.startDate)} —{" "}
                    {latest.endDate ? formatMonth(latest.endDate) : "Present"}
                  </span>
                )}
                <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            )
          }}
        />
      )}
    </>
  )
}
