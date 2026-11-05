"use client"

import { useEffect, useState } from "react"
import { ImageIcon, SearchIcon, ShapesIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaPicker } from "@/features/media/components/media-picker"
import { MediaThumbnail } from "@/features/media/components/media-thumbnail"
import type { MediaItem } from "@/features/media/types"
import type { SimpleIconSummary } from "@/features/portfolio/lib/simple-icons"

import { searchSimpleIconsAction } from "../../actions/icons"

/** Icon chosen from Simple Icons, an uploaded image, or nothing. */
export type IconValue = {
  simpleIcon: Pick<SimpleIconSummary, "slug" | "title" | "path"> | null
  media: MediaItem | null
}

export const EMPTY_ICON: IconValue = { simpleIcon: null, media: null }

export function IconPicker({
  value,
  onChange,
  id,
}: {
  value: IconValue
  onChange: (value: IconValue) => void
  id?: string
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const hasValue = Boolean(value.simpleIcon || value.media)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-muted/40 text-foreground">
        {value.media ? (
          <MediaThumbnail
            item={value.media}
            className="size-full"
            fit="contain"
          />
        ) : value.simpleIcon ? (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
            aria-hidden
          >
            <path d={value.simpleIcon.path} />
          </svg>
        ) : (
          <ShapesIcon className="size-4 text-muted-foreground" />
        )}
      </div>

      <span className="min-w-0 flex-1 truncate text-sm">
        {value.media?.fileName ?? value.simpleIcon?.title ?? (
          <span className="text-muted-foreground">No icon</span>
        )}
      </span>

      <div className="flex items-center gap-1">
        <Button
          id={id}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon />
          Brand icon
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMediaOpen(true)}
        >
          <ImageIcon />
          Upload
        </Button>
        {hasValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(EMPTY_ICON)}
            aria-label="Remove icon"
          >
            <XIcon />
          </Button>
        )}
      </div>

      <SimpleIconDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        selectedSlug={value.simpleIcon?.slug}
        onSelect={(icon) => {
          onChange({ simpleIcon: icon, media: null })
          setSearchOpen(false)
        }}
      />
      <MediaPicker
        open={mediaOpen}
        onOpenChange={setMediaOpen}
        kind="image"
        title="Choose an icon image"
        description="SVG or PNG files work best."
        onSelect={(item) => onChange({ simpleIcon: null, media: item })}
      />
    </div>
  )
}

function SimpleIconDialog({
  open,
  onOpenChange,
  selectedSlug,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSlug?: string
  onSelect: (icon: SimpleIconSummary) => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SimpleIconSummary[] | null>(null)

  useEffect(() => {
    if (!open) return
    let active = true
    const timer = setTimeout(() => {
      searchSimpleIconsAction(query).then((icons) => {
        if (active) setResults(icons)
      })
    }, 200)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [open, query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90svh,40rem)] flex-col gap-4 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Brand icon</DialogTitle>
          <DialogDescription>
            Search 3,000+ brand icons from Simple Icons.
          </DialogDescription>
        </DialogHeader>

        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            autoFocus
            placeholder="React, PostgreSQL, Figma…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>

        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
          {results === null ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 12 }, (_, index) => (
                <Skeleton key={index} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No icons found.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {results.map((icon) => (
                <li key={icon.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(icon)}
                    className={cn(
                      "flex h-20 w-full flex-col items-center justify-center gap-2 rounded-lg border border-line p-2 text-center transition-colors outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      icon.slug === selectedSlug &&
                        "border-foreground/60 ring-1 ring-foreground/60"
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                      aria-hidden
                    >
                      <path d={icon.path} />
                    </svg>
                    <span className="w-full truncate text-xs">
                      {icon.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
