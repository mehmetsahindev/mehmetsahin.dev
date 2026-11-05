"use server"

import { Prose } from "@/components/ui/typography"
import { Markdown } from "@/components/markdown"
import { compileMarkdown } from "@/components/mdx"
import { requireAdmin } from "@/features/admin/lib/session"

/**
 * How a field is shown on the site, so the editor preview matches it:
 * - `post`: blog posts, MDX with the site's components.
 * - `description`: About and career descriptions, plain Markdown in the
 *   compact `typeset-description` style.
 */
export type MarkdownRenderer = "post" | "description"

export async function renderPreviewAction(
  markdown: string,
  renderer: MarkdownRenderer
) {
  await requireAdmin()

  if (!markdown.trim()) {
    return null
  }

  try {
    if (renderer === "description") {
      return (
        <div className="typeset typeset-description [&_li]:ps-0.5 [&_ul]:ps-3.5">
          <Markdown>{markdown}</Markdown>
        </div>
      )
    }

    return <Prose>{await compileMarkdown(markdown)}</Prose>
  } catch (error) {
    return (
      <p className="font-mono text-sm text-destructive">
        {error instanceof Error ? error.message : "Could not render preview."}
      </p>
    )
  }
}
