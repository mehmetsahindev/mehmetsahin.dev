"use client"

import type { Route } from "next"
import Link from "next/link"
import { ChevronRightIcon, FolderGit2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatMonth } from "@/features/portfolio/lib/dates"

import { AdminPageHeader } from "../components/admin-page"
import { SortableList } from "../components/form/sortable-list"
import { ListEmpty } from "../components/list-empty"
import { useSortableItems } from "../hooks/use-sortable-items"
import { reorderProjectsAction } from "./actions"
import { IconPreview } from "./project-icon"
import type { ProjectListItem } from "./queries"

export function ProjectList({ items }: { items: ProjectListItem[] }) {
  const { ordered, onReorder, onCommit } = useSortableItems(
    items,
    reorderProjectsAction
  )

  const addButton = (
    <Button nativeButton={false} render={<Link href="/admin/projects/new" />}>
      <PlusIcon />
      Add project
    </Button>
  )

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Things you have built. Drag to reorder."
        actions={items.length > 0 ? addButton : undefined}
      />

      {ordered.length === 0 ? (
        <ListEmpty
          icon={<FolderGit2Icon />}
          title="No projects yet"
          description="Show off what you have built."
          action={addButton}
        />
      ) : (
        <SortableList
          items={ordered}
          getId={(item) => item.id}
          onReorder={onReorder}
          onCommit={onCommit}
          renderItem={(item) => (
            <Link
              href={`/admin/projects/${item.id}` as Route}
              className="group flex items-center gap-3 py-3 pr-3 pl-1"
            >
              <IconPreview icon={item.icon} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {item.title}
                </span>
                {item.url && (
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {item.url}
                  </span>
                )}
              </div>
              <span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:block">
                {formatMonth(item.startDate)} —{" "}
                {item.endDate ? formatMonth(item.endDate) : "Present"}
              </span>
              <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        />
      )}
    </>
  )
}
