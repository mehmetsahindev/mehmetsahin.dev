import { useId } from "react"

import {
  MARK_HEIGHT,
  MARK_OUTLINE_PATH,
  MARK_PATH,
  MARK_WIDTH,
} from "@/components/site-mark"

/** Breathing room around the mark inside the cover. */
const PADDING = 20

/**
 * Cover artwork beside the avatar: the site mark drawn with a hatched fill
 * and a hairline outline, so it reads as a drafting detail rather than a logo.
 */
export function ProfileMark() {
  const patternId = `profile-mark-hatch-${useId()}`

  return (
    <svg
      className="h-auto w-full overflow-visible [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_24%,var(--background))]"
      viewBox={`${-PADDING} ${-PADDING} ${MARK_WIDTH + PADDING * 2} ${MARK_HEIGHT + PADDING * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <path d={MARK_PATH} fill={`url(#${patternId})`} />
      <path
        d={MARK_OUTLINE_PATH}
        stroke="var(--stroke)"
        strokeWidth="1"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
