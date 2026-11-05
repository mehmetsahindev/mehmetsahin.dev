import { describe, expect, it } from "vitest"

import { extractMediaKeys, isValidMediaKey } from "./references"

describe("extractMediaKeys", () => {
  it("finds keys in Markdown images and links", () => {
    const markdown = [
      "![Cover](/media/cover-a1b2c3.webp)",
      "See [my CV](https://mehmetsahin.dev/media/cv-x9y8z7.pdf).",
    ].join("\n")

    expect(extractMediaKeys(markdown)).toEqual([
      "cover-a1b2c3.webp",
      "cv-x9y8z7.pdf",
    ])
  })

  it("removes duplicates", () => {
    expect(extractMediaKeys("/media/a-1.png and again /media/a-1.png")).toEqual(
      ["a-1.png"]
    )
  })

  it("strips trailing sentence punctuation", () => {
    expect(extractMediaKeys("Download /media/file-1.pdf.")).toEqual([
      "file-1.pdf",
    ])
  })

  it("ignores unrelated paths", () => {
    expect(extractMediaKeys("/blog/media-tips and /mediafile.png")).toEqual([])
  })
})

describe("isValidMediaKey", () => {
  it("accepts generated keys", () => {
    expect(isValidMediaKey("avatar-k3j2h1.jpg")).toBe(true)
  })

  it("rejects path traversal and separators", () => {
    expect(isValidMediaKey("../secret")).toBe(false)
    expect(isValidMediaKey("a/b.png")).toBe(false)
    expect(isValidMediaKey(".env")).toBe(false)
  })
})
