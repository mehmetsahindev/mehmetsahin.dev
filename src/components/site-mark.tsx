/**
 * Mehmet Şahin's pixel "MS" mark (from mehmetsahin.dev): a 10 x 5 grid of
 * 40-unit cells, drawn at 400 x 200.
 */
export const MARK_WIDTH = 400
export const MARK_HEIGHT = 200

/** Filled cells, merged per row. */
export const MARK_PATH =
  "M0 0h200v40h-200ZM240 0h160v40h-160ZM0 40h40v40h-40ZM80 40h40v40h-40ZM160 40h40v40h-40ZM240 40h40v40h-40ZM0 80h40v40h-40ZM80 80h40v40h-40ZM160 80h40v40h-40ZM240 80h160v40h-160ZM0 120h40v40h-40ZM160 120h40v40h-40ZM360 120h40v40h-40ZM0 160h40v40h-40ZM160 160h40v40h-40ZM240 160h160v40h-160Z"

/** Outer edges of the mark, without the seams between cells. */
export const MARK_OUTLINE_PATH =
  "M0 0h40M0 0v40M40 0h40M40 40h40M80 0h40M120 0h40M120 40h40M160 0h40M200 0v40M240 0h40M240 0v40M280 0h40M280 40h40M320 0h40M320 40h40M360 0h40M360 40h40M400 0v40M0 40v40M40 40v40M80 40v40M120 40v40M160 40v40M200 40v40M240 40v40M280 40v40M0 80v40M40 80v40M80 120h40M80 80v40M120 80v40M160 80v40M200 80v40M240 120h40M240 80v40M280 80h40M280 120h40M320 80h40M320 120h40M360 80h40M400 80v40M0 120v40M40 120v40M160 120v40M200 120v40M360 120v40M400 120v40M0 200h40M0 160v40M40 160v40M160 200h40M160 160v40M200 160v40M240 160h40M240 200h40M240 160v40M280 160h40M280 200h40M320 160h40M320 200h40M360 200h40M400 160v40"

export function SiteMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`}
      aria-hidden
      {...props}
    >
      <path fill="currentColor" d={MARK_PATH} />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 ${MARK_WIDTH} ${MARK_HEIGHT}"><path fill="currentColor" d="${MARK_PATH}"/></svg>`
}
