"use client"

import { useRef, useState } from "react"
import { ImagePlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MediaPicker } from "@/features/media/components/media-picker"
import { getMediaUrl } from "@/features/media/lib/constants"
import type { MediaItem } from "@/features/media/types"

/**
 * Markdown text with a button that inserts a file from the media library at
 * the cursor. Media referenced here is tracked as "used" when saved.
 */
export function MarkdownField({
  id,
  value,
  onChange,
  rows = 5,
  placeholder,
  className,
  "aria-invalid": ariaInvalid,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  className?: string
  "aria-invalid"?: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const insertMedia = (item: MediaItem) => {
    const url = getMediaUrl(item.key)
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? value.length
    const end = textarea?.selectionEnd ?? value.length

    // Images are blocks: give them their own paragraph.
    const before = value.slice(0, start)
    const after = value.slice(end)
    const snippet =
      item.kind === "image"
        ? `${before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : ""}![${item.alt || ""}](${url})${after && !after.startsWith("\n") ? "\n\n" : ""}`
        : `[${item.fileName}](${url})`
    const next = value.slice(0, start) + snippet + value.slice(end)
    onChange(next)

    requestAnimationFrame(() => {
      textarea?.focus()
      const cursor = start + snippet.length
      textarea?.setSelectionRange(cursor, cursor)
    })
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        ariaInvalid && "border-destructive",
        className
      )}
    >
      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={ariaInvalid}
        className="min-h-24 rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="flex items-center justify-between gap-2 border-t border-line bg-muted/30 px-2 py-1">
        <span className="font-mono text-xs text-muted-foreground">
          Markdown
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setPickerOpen(true)}
        >
          <ImagePlusIcon />
          Insert media
        </Button>
      </div>
      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={insertMedia}
        title="Insert media"
      />
    </div>
  )
}
