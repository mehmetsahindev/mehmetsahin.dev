import { format } from "date-fns"
import { remarkHeading } from "fumadocs-core/mdx-plugins/remark-heading"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"

import type { PostDetail } from "../types"

const processor = remark().use(remarkMdx).use(remarkGfm).use(remarkHeading)

/** Plain Markdown version of a post for LLMs and "View as Markdown". */
export async function getPostLLMText(post: PostDetail) {
  const processed = await processor.process({ value: post.content })

  return `# ${post.title}

${post.summary}

${processed.value}

Last updated on ${format(new Date(post.updatedAt), "MMMM d, yyyy")}`
}
