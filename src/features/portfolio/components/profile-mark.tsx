import { cn } from "@/lib/utils"
import { MARK_HEIGHT, MARK_PATH, MARK_WIDTH } from "@/components/site-mark"

/** Faint site mark shown in the cover above the profile name. */
export function ProfileMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-auto fill-foreground/10", className)}
      viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={MARK_PATH} />
    </svg>
  )
}
