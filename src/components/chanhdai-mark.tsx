export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      aria-hidden
      {...props}
    >
      <defs>
        <pattern
          id="logo-pixel"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(40)"
        >
          <rect width="1" height="1" x="0" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="1" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="2" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="3" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="6" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="7" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="8" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="9" y="0" fill="currentColor"></rect>
          <rect width="1" height="1" x="0" y="1" fill="currentColor"></rect>
          <rect width="1" height="1" x="2" y="1" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="1" fill="currentColor"></rect>
          <rect width="1" height="1" x="6" y="1" fill="currentColor"></rect>
          <rect width="1" height="1" x="0" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="2" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="6" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="7" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="8" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="9" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="0" y="3" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="3" fill="currentColor"></rect>
          <rect width="1" height="1" x="9" y="3" fill="currentColor"></rect>
          <rect width="1" height="1" x="0" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="6" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="7" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="8" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="9" y="4" fill="currentColor"></rect>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#logo-pixel)"></rect>
    </svg>
  )
}

export function getMarkSVG(color: string) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
      <defs>
        <pattern id="logo-pixel" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="scale(40)">
          <rect width="1" height="1" x="0" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="1" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="2" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="3" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="4" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="6" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="7" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="8" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="9" y="0" fill="${color}"></rect>
          <rect width="1" height="1" x="0" y="1" fill="${color}"></rect>
          <rect width="1" height="1" x="2" y="1" fill="${color}"></rect>
          <rect width="1" height="1" x="4" y="1" fill="${color}"></rect>
          <rect width="1" height="1" x="6" y="1" fill="${color}"></rect>
          <rect width="1" height="1" x="0" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="2" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="4" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="6" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="7" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="8" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="9" y="2" fill="${color}"></rect>
          <rect width="1" height="1" x="0" y="3" fill="${color}"></rect>
          <rect width="1" height="1" x="4" y="3" fill="${color}"></rect>
          <rect width="1" height="1" x="9" y="3" fill="${color}"></rect>
          <rect width="1" height="1" x="0" y="4" fill="${color}"></rect>
          <rect width="1" height="1" x="4" y="4" fill="${color}"></rect>
          <rect width="1" height="1" x="6" y="4" fill="${color}"></rect>
          <rect width="1" height="1" x="7" y="4" fill="${color}"></rect>
          <rect width="1" height="1" x="8" y="4" fill="${color}"></rect>
          <rect width="1" height="1" x="9" y="4" fill="${color}"></rect>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#logo-pixel)"></rect>
    </svg>
  `
}
