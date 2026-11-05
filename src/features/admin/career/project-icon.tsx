import { BoxIcon } from "lucide-react"

import { MediaThumbnail } from "@/features/media/components/media-thumbnail"

import type { IconValue } from "../components/form/icon-picker"

/** Small preview of an IconValue for admin lists. */
export function IconPreview({
  icon,
  fallback = <BoxIcon className="size-4 text-muted-foreground" />,
}: {
  icon: IconValue
  fallback?: React.ReactNode
}) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-muted/40">
      {icon.media ? (
        <MediaThumbnail item={icon.media} className="size-full" fit="contain" />
      ) : icon.simpleIcon ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden
        >
          <path d={icon.simpleIcon.path} />
        </svg>
      ) : (
        fallback
      )}
    </div>
  )
}
