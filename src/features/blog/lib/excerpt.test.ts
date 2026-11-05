import { describe, expect, it } from "vitest"

import { markdownExcerpt, postDescription } from "./excerpt"

describe("markdownExcerpt", () => {
  it("strips Markdown syntax", () => {
    const markdown = [
      "## Giriş",
      "",
      "Bu yazı **Markdown** ile yazıldı, [link](https://a.com) ve `kod` içerir.",
      "",
      "![kapak](/media/cover.png)",
      "",
      "```ts",
      "const hidden = true",
      "```",
      "",
      "<Callout>Not</Callout>",
    ].join("\n")

    expect(markdownExcerpt(markdown)).toBe(
      "Bu yazı Markdown ile yazıldı, link ve kod içerir. Not"
    )
  })

  it("cuts long text on a word boundary", () => {
    const text = "word ".repeat(60)
    const result = markdownExcerpt(text, 50)

    expect(result.length).toBeLessThanOrEqual(50)
    expect(result.endsWith("word…")).toBe(true)
  })
})

describe("postDescription", () => {
  it("prefers the written description", () => {
    expect(postDescription({ description: "Own", content: "Body" })).toBe("Own")
  })

  it("falls back to an excerpt", () => {
    expect(
      postDescription({ description: " ", content: "## Hi\n\nBody" })
    ).toBe("Body")
  })
})
