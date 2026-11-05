"use server"

import { Prose } from "@/components/ui/typography"
import { compileMarkdown } from "@/components/mdx"
import { requireAdmin } from "@/features/admin/lib/session"

/**
 * Renders Markdown with the same pipeline as the public post page, so the
 * editor preview matches the site exactly.
 */
export async function renderPreviewAction(markdown: string) {
  await requireAdmin()

  if (!markdown.trim()) {
    return null
  }

  try {
    return <Prose>{await compileMarkdown(markdown)}</Prose>
  } catch (error) {
    return (
      <p className="font-mono text-sm text-destructive">
        {error instanceof Error ? error.message : "Could not render preview."}
      </p>
    )
  }
}
