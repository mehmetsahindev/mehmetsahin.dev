import { markdownResponse } from "@/lib/markdown-response"
import { getEducation } from "@/features/portfolio/data/queries"
import { formatMonth } from "@/features/portfolio/lib/dates"

export const dynamic = "force-dynamic"

export async function GET() {
  const education = await getEducation()

  return markdownResponse(`# Education

${education
  .map((item) => {
    const heading =
      [item.degree, item.fieldOfStudy].filter(Boolean).join(", ") || item.school
    const school = heading === item.school ? "" : ` | ${item.school}`
    const skills = item.skills.length
      ? `\n\nSkills: ${item.skills.join(", ")}`
      : ""
    const description = item.description ? `\n\n${item.description.trim()}` : ""
    const end = item.endDate ? formatMonth(item.endDate) : "Present"
    return `## ${heading}${school}\n\nDuration: ${formatMonth(item.startDate)} - ${end}${skills}${description}`
  })
  .join("\n\n")}
`)
}
