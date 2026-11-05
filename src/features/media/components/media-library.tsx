"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { useMediaUpload } from "../hooks/use-media-upload"
import type { MediaItem } from "../types"
import {
  MediaDropzone,
  MediaGrid,
  MediaToolbar,
  MediaUploadButton,
  useMediaFilters,
} from "./media-browser"
import { MediaDetailsSheet } from "./media-details-sheet"

/** The admin media page: browse, upload, inspect and delete files. */
export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { filter, setFilter, query, setQuery, visible } = useMediaFilters(
    items,
    "all"
  )

  const refresh = useCallback(() => router.refresh(), [router])
  const { upload, isUploading } = useMediaUpload({ onUploaded: refresh })

  // Derived from the latest server data so edits show up after refresh.
  const selected = items.find((item) => item.id === selectedId) ?? null

  return (
    <MediaDropzone onFiles={upload} className="flex flex-col gap-4">
      <MediaToolbar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        filters={["all", "image", "document", "unused"]}
      >
        <MediaUploadButton onFiles={upload} isUploading={isUploading} />
      </MediaToolbar>

      <MediaGrid
        items={visible}
        onItemClick={(item) => setSelectedId(item.id)}
        emptyAction={
          items.length === 0 ? (
            <MediaUploadButton
              onFiles={upload}
              isUploading={isUploading}
              size="default"
            />
          ) : undefined
        }
      />

      <MediaDetailsSheet
        item={selected}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        onChanged={refresh}
      />
    </MediaDropzone>
  )
}
