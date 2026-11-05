"use client"

import { useMemo, useRef, useState } from "react"
import { formatBytes } from "@/utils/format"
import { CheckIcon, ImageIcon, SearchIcon, UploadIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { MEDIA_ACCEPT } from "../lib/constants"
import type { MediaItem } from "../types"
import { MediaThumbnail } from "./media-thumbnail"

export type MediaFilter = "all" | "image" | "document" | "unused"

const FILTER_LABELS: Record<MediaFilter, string> = {
  all: "All",
  image: "Images",
  document: "Documents",
  unused: "Unused",
}

export function filterMedia(
  items: MediaItem[],
  filter: MediaFilter,
  query: string
) {
  const q = query.trim().toLowerCase()

  return items.filter((item) => {
    if (filter === "unused" && item.usageCount > 0) return false
    if ((filter === "image" || filter === "document") && item.kind !== filter)
      return false
    if (!q) return true
    return (
      item.fileName.toLowerCase().includes(q) ||
      item.alt.toLowerCase().includes(q)
    )
  })
}

/* -------------------------------------------------------------------------- */

export function MediaToolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  filters,
  children,
}: {
  query: string
  onQueryChange: (value: string) => void
  filter: MediaFilter
  onFilterChange: (value: MediaFilter) => void
  filters: MediaFilter[]
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.length > 1 && (
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[filter]}
          onValueChange={(value) => {
            if (value[0]) onFilterChange(value[0] as MediaFilter)
          }}
        >
          {filters.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {FILTER_LABELS[value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}

      <InputGroup className="h-8 w-full sm:ml-auto sm:w-56">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search files"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </InputGroup>

      {children}
    </div>
  )
}

export function MediaUploadButton({
  onFiles,
  isUploading,
  accept = MEDIA_ACCEPT,
  size = "sm",
}: {
  onFiles: (files: FileList) => void
  isUploading: boolean
  accept?: string
  size?: "sm" | "default"
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        size={size}
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? <Spinner /> : <UploadIcon />}
        Upload
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files?.length) onFiles(event.target.files)
          event.target.value = ""
        }}
      />
    </>
  )
}

/** Highlights while files are dragged over it and uploads them on drop. */
export function MediaDropzone({
  onFiles,
  className,
  children,
}: {
  onFiles: (files: FileList) => void
  className?: string
  children: React.ReactNode
}) {
  const [isOver, setIsOver] = useState(false)
  const depth = useRef(0)

  const hasFiles = (event: React.DragEvent) =>
    event.dataTransfer.types.includes("Files")

  return (
    <div
      className={cn("relative", className)}
      onDragEnter={(event) => {
        if (!hasFiles(event)) return
        event.preventDefault()
        depth.current++
        setIsOver(true)
      }}
      onDragOver={(event) => {
        if (hasFiles(event)) event.preventDefault()
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setIsOver(false)
      }}
      onDrop={(event) => {
        if (!hasFiles(event)) return
        event.preventDefault()
        depth.current = 0
        setIsOver(false)
        if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files)
      }}
    >
      {children}

      {isOver && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-foreground/30 bg-background/80 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2 text-sm font-medium">
            <UploadIcon className="size-5" />
            Drop files to upload
          </div>
        </div>
      )}
    </div>
  )
}

export function MediaGrid({
  items,
  selectedIds,
  onItemClick,
  emptyAction,
  className,
}: {
  items: MediaItem[]
  selectedIds?: ReadonlySet<string>
  onItemClick: (item: MediaItem) => void
  emptyAction?: React.ReactNode
  className?: string
}) {
  if (items.length === 0) {
    return (
      <Empty className="border border-dashed border-line">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>No files</EmptyTitle>
          <EmptyDescription>
            Upload images, SVG icons or PDFs, or drop them here.
          </EmptyDescription>
        </EmptyHeader>
        {emptyAction}
      </Empty>
    )
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      {items.map((item) => {
        const isSelected = selectedIds?.has(item.id) ?? false

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onItemClick(item)}
              aria-pressed={selectedIds ? isSelected : undefined}
              className={cn(
                "group flex w-full flex-col overflow-hidden rounded-xl border border-line text-left transition-[border-color,box-shadow] outline-none hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                isSelected && "border-foreground/60 ring-1 ring-foreground/60"
              )}
            >
              <div className="relative">
                <MediaThumbnail
                  item={item}
                  className="aspect-square border-b border-line"
                />
                {isSelected && (
                  <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                    <CheckIcon className="size-3.5" />
                  </span>
                )}
                {!selectedIds && item.usageCount === 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 font-mono text-[10px] uppercase"
                  >
                    Unused
                  </Badge>
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5 px-3 py-2">
                <span className="truncate text-sm font-medium">
                  {item.fileName}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatBytes(item.size)}
                  {item.width && item.height
                    ? ` · ${item.width}×${item.height}`
                    : ""}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function useMediaFilters(items: MediaItem[], initial: MediaFilter) {
  const [filter, setFilter] = useState<MediaFilter>(initial)
  const [query, setQuery] = useState("")

  const visible = useMemo(
    () => filterMedia(items, filter, query),
    [items, filter, query]
  )

  return { filter, setFilter, query, setQuery, visible }
}
