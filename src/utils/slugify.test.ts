import { describe, expect, it } from "vitest"

import { slugify } from "./slugify"

describe("slugify", () => {
  it("transliterates Turkish letters", () => {
    expect(slugify("Şahin'in İlk Yazısı: Çiğ Köfte & Ötesi")).toBe(
      "sahin-in-ilk-yazisi-cig-kofte-otesi"
    )
  })

  it("trims separators", () => {
    expect(slugify("  --Hello, World!--  ")).toBe("hello-world")
  })

  it("returns an empty string when nothing is left", () => {
    expect(slugify("!!!")).toBe("")
  })
})
