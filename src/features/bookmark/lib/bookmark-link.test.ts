import { describe, expect, it } from "vitest"

import { getBookmarkExternalHref } from "./bookmark-link"

describe("getBookmarkExternalHref", () => {
  it("appends utm_source", () => {
    expect(getBookmarkExternalHref("https://example.com/page")).toBe(
      "https://example.com/page?utm_source=mehmetsahin.dev"
    )
  })

  it("preserves params already on the url", () => {
    const href = getBookmarkExternalHref("https://example.com?atp=example")

    expect(href).toContain("atp=example")
    expect(href).toContain("utm_source=mehmetsahin.dev")
    expect(href.indexOf("atp=example")).toBeLessThan(
      href.indexOf("utm_source=mehmetsahin.dev")
    )
  })

  it("returns invalid urls unchanged", () => {
    expect(getBookmarkExternalHref("not a url")).toBe("not a url")
  })

  it("normalizes bare origins with a trailing slash", () => {
    expect(getBookmarkExternalHref("https://animations.dev")).toBe(
      "https://animations.dev/?utm_source=mehmetsahin.dev"
    )
  })
})
