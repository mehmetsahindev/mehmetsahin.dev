"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import { listMediaAction } from "../actions"
import { useMediaUpload } from "../hooks/use-media-upload"
import { MEDIA_ACCEPT, type MediaKind } from "../lib/constants"
import type { MediaItem } from "../types"
import {
  MediaDropzone,
  MediaGrid,
  MediaToolbar,
  MediaUploadButton,
  useMediaFilters,
  type MediaFilter,
} from "./media-browser"

type MediaPickerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: MediaItem) => void
  /** Restrict the choice to one kind of file. */
  kind?: MediaKind
  title?: string
  description?: string
}

/**
 * Chooses a file from the media library. New files can be uploaded from here
 * too; they land in the library and are preselected.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  kind,
  title = "Choose a file",
  description = "Pick a file from your media library or upload a new one.",
}: MediaPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90svh,48rem)] flex-col gap-0 p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-line p-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {open && (
          <MediaPickerBody
            kind={kind}
            onCancel={() => onOpenChange(false)}
            onSelect={(item) => {
              onSelect(item)
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function MediaPickerBody({
  kind,
  onCancel,
  onSelect,
}: {
  kind?: MediaKind
  onCancel: () => void
  onSelect: (item: MediaItem) => void
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    listMediaAction().then((result) => {
      if (active) setItems(result)
    })
    return () => {
      active = false
    }
  }, [])

  const allowed = useMemo(
    () => (items ?? []).filter((item) => !kind || item.kind === kind),
    [items, kind]
  )

  const filters: MediaFilter[] = kind ? ["all"] : ["all", "image", "document"]
  const { filter, setFilter, query, setQuery, visible } = useMediaFilters(
    allowed,
    "all"
  )

  const onUploaded = useCallback((uploaded: MediaItem[]) => {
    setItems((current) => [...uploaded, ...(current ?? [])])
    setSelectedId(uploaded[0]?.id ?? null)
  }, [])
  const { upload, isUploading } = useMediaUpload({ onUploaded })

  const accept =
    kind === "image"
      ? MEDIA_ACCEPT.split(",")
          .filter((type) => type.startsWith("image/"))
          .join(",")
      : MEDIA_ACCEPT

  const selected = allowed.find((item) => item.id === selectedId)

  return (
    <>
      <MediaDropzone
        onFiles={upload}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4"
      >
        <MediaToolbar
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          filters={filters}
        >
          <MediaUploadButton
            onFiles={upload}
            isUploading={isUploading}
            accept={accept}
          />
        </MediaToolbar>

        {items === null ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <MediaGrid
            items={visible}
            className="lg:grid-cols-4 xl:grid-cols-4"
            selectedIds={new Set(selectedId ? [selectedId] : [])}
            onItemClick={(item) =>
              setSelectedId((current) => (current === item.id ? null : item.id))
            }
          />
        )}
      </MediaDropzone>

      <DialogFooter className="m-0 items-center rounded-b-xl border-t border-line p-4">
        <p className="mr-auto hidden truncate text-sm text-muted-foreground sm:block">
          {selected ? selected.fileName : "No file selected"}
        </p>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Select
        </Button>
      </DialogFooter>
    </>
  )
}
