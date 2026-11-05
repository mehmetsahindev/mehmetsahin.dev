import { notFound } from "next/navigation"

import { markdownResponse } from "@/lib/markdown-response"
import { getPublishedPost } from "@/features/blog/data/queries"
import { getPostLLMText } from "@/features/blog/lib/llm-text"
import { getRequestLocale } from "@/features/blog/lib/request-locale"

export const dynamic = "force-dynamic"

/** Reached through src/proxy.ts from `/blog/<slug>.md` and `/tr/blog/<slug>.md`. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getPublishedPost(
    getRequestLocale(request),
    decodeURIComponent(slug)
  )

  if (!post) notFound()

  return markdownResponse(await getPostLLMText(post))
}
