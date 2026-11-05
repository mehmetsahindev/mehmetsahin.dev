import { markdownResponse } from "@/lib/markdown-response"
import { getProjects } from "@/features/portfolio/data/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const projects = await getProjects()

  return markdownResponse(`# Projects

${projects
  .map((item) => {
    const url = item.url ? `\n\nProject URL: ${item.url}` : ""
    const skills = item.skills.length
      ? `\n\nSkills: ${item.skills.join(", ")}`
      : ""
    const description = item.description ? `\n\n${item.description.trim()}` : ""
    return `## ${item.title}${url}${skills}${description}`
  })
  .join("\n\n")}
`)
}
