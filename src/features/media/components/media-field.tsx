"use client"

import { useState } from "react"
import { formatBytes } from "@/utils/format"
import { ImageIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { MediaKind } from "../lib/constants"
import type { MediaItem } from "../types"
import { MediaPicker } from "./media-picker"
import { MediaThumbnail } from "./media-thumbnail"

type MediaFieldProps = {
  value: MediaItem | null
  onChange: (value: MediaItem | null) => void
  kind?: MediaKind
  id?: string
  className?: string
  /** Shape of the preview, e.g. round for avatars. */
  previewClassName?: string
}

/** Form control that holds one file from the media library. */
export function MediaField({
  value,
  onChange,
  kind = "image",
  id,
  className,
  previewClassName,
}: MediaFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-line p-3",
        className
      )}
    >
      <button
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "size-16 shrink-0 overflow-hidden rounded-lg border border-line outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          previewClassName
        )}
        aria-label={value ? "Change file" : "Choose file"}
      >
        {value ? (
          <MediaThumbnail item={value} className="size-full" />
        ) : (
          <span className="flex size-full items-center justify-center bg-muted/40 text-muted-foreground">
            <ImageIcon className="size-5" />
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        {value ? (
          <>
            <span className="truncate text-sm font-medium">
              {value.fileName}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {formatBytes(value.size)}
              {value.width && value.height
                ? ` · ${value.width}×${value.height}`
                : ""}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            No file selected
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          {value ? "Change" : "Choose"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(null)}
            aria-label="Remove file"
          >
            <XIcon />
          </Button>
        )}
      </div>

      <MediaPicker
        open={open}
        onOpenChange={setOpen}
        onSelect={onChange}
        kind={kind}
      />
    </div>
  )
}
