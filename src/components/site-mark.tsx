/** Path of the mark on its 576 x 320 grid. */
export const MARK_PATH =
  "M0 0h64v64h-64ZM256 0h64v64h-64ZM448 0h128v64h-128ZM0 64h128v64h-128ZM192 64h128v64h-128ZM384 64h64v64h-64ZM0 128h64v64h-64ZM128 128h64v64h-64ZM256 128h64v64h-64ZM448 128h64v64h-64ZM0 192h64v64h-64ZM256 192h64v64h-64ZM512 192h64v64h-64ZM0 256h64v64h-64ZM256 256h64v64h-64ZM384 256h128v64h-128Z"

/** Outer edges of the mark, without the seams between cells. */
export const MARK_OUTLINE_PATH =
  "M0 0h64M0 0v64M64 0v64M256 0h64M256 0v64M320 0v64M448 0h64M448 64h64M448 0v64M512 0h64M512 64h64M576 0v64M0 64v64M64 64h64M64 128h64M128 64v64M192 64h64M192 128h64M192 64v64M320 64v64M384 64h64M384 128h64M384 64v64M448 64v64M0 128v64M64 128v64M128 128h64M128 192h64M128 128v64M192 128v64M256 128v64M320 128v64M448 128h64M448 192h64M448 128v64M512 128v64M0 192v64M64 192v64M256 192v64M320 192v64M512 192h64M512 256h64M512 192v64M576 192v64M0 320h64M0 256v64M64 256v64M256 320h64M256 256v64M320 256v64M384 256h64M384 320h64M384 256v64M448 256h64M448 320h64M512 256v64"

/**
 * Pixel monogram used as the site mark. Drawn on a 64-unit grid
 * (9 x 5 cells) to match the stepped visual language of the layout.
 */
export function SiteMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 576 320"
      aria-hidden
      {...props}
    >
      <path fill="currentColor" d={MARK_PATH} />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 288 160"><path fill="currentColor" d="M0 0h32v32h-32ZM128 0h32v32h-32ZM224 0h64v32h-64ZM0 32h64v32h-64ZM96 32h64v32h-64ZM192 32h32v32h-32ZM0 64h32v32h-32ZM64 64h32v32h-32ZM128 64h32v32h-32ZM224 64h32v32h-32ZM0 96h32v32h-32ZM128 96h32v32h-32ZM256 96h32v32h-32ZM0 128h32v32h-32ZM128 128h32v32h-32ZM192 128h64v32h-64Z"/></svg>`
}
