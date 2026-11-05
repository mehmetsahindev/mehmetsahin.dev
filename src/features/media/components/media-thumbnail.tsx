import { FileTextIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { getMediaUrl } from "../lib/constants"
import type { MediaItem } from "../types"

type MediaThumbnailProps = {
  item: Pick<MediaItem, "key" | "kind" | "alt" | "fileName" | "mimeType">
  className?: string
  /** `contain` keeps the whole image visible (details view). */
  fit?: "cover" | "contain"
}

export function MediaThumbnail({
  item,
  className,
  fit = "cover",
}: MediaThumbnailProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted/40 bg-[radial-gradient(var(--line)_1px,transparent_1px)] bg-size-[8px_8px]",
        className
      )}
    >
      {item.kind === "image" ? (
        // Plain img: admin previews show originals, including SVG.
        <img
          src={getMediaUrl(item.key)}
          alt={item.alt || item.fileName}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={cn(
            "size-full",
            fit === "cover" ? "object-cover" : "object-contain",
            item.mimeType === "image/svg+xml" && "object-contain p-[12%]"
          )}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <FileTextIcon className="size-8 stroke-1" />
          <span className="font-mono text-xs uppercase">
            {item.mimeType.split("/")[1]}
          </span>
        </div>
      )}
    </div>
  )
}
