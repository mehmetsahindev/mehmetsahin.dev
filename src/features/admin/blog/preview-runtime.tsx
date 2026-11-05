import { compileMarkdown } from "@/components/mdx"

/**
 * The live preview is rendered by a Server Action, which can only send back
 * client components the page already knows. Rendering each Markdown
 * component that uses client components once here (hidden) registers them
 * for this page. Embeds are server components and need no entry.
 */
const SAMPLE = `
# Heading

\`inline\` and a [link](https://example.com)

| a | b |
| - | - |
| 1 | 2 |

\`\`\`ts title="example.ts"
const a = 1
\`\`\`

\`\`\`bash
npm install example
\`\`\`

<Callout>Callout</Callout>

<Steps><Step>Step</Step></Steps>

<Tabs defaultValue="a">
  <TabsList><TabsTrigger value="a">A</TabsTrigger><TabsIndicator /></TabsList>
  <TabsContent value="a">A</TabsContent>
</Tabs>

<CodeTabs><TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList></CodeTabs>

<CodeCollapsibleWrapper>x</CodeCollapsibleWrapper>

<DocPullQuote quote="q" author={{ name: "n" }} />

`

export async function MarkdownPreviewRuntime() {
  let content: React.ReactNode = null
  try {
    content = await compileMarkdown(SAMPLE)
  } catch {
    content = null
  }

  return (
    <div hidden aria-hidden>
      {content}
    </div>
  )
}
