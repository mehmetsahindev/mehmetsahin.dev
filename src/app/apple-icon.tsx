import { ImageResponse } from "next/og"

import { MARK_PATH } from "@/components/site-mark"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
      }}
    >
      <svg width="108" height="60" viewBox="0 0 576 320">
        <path fill="#fafafa" d={MARK_PATH} />
      </svg>
    </div>,
    size
  )
}
