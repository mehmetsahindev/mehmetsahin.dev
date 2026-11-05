import { markdownResponse } from "@/lib/markdown-response"
import { getExperiences } from "@/features/portfolio/data/queries"
import { formatMonth } from "@/features/portfolio/lib/dates"

export const dynamic = "force-dynamic"

export async function GET() {
  const experiences = await getExperiences()

  return markdownResponse(`# Experience

${experiences
  .flatMap((item) =>
    item.positions.map((position) => {
      const skills = position.skills.join(", ") || "N/A"
      const end = position.endDate ? formatMonth(position.endDate) : "Present"
      return `## ${position.title} | ${item.companyName}\n\nDuration: ${formatMonth(position.startDate)} - ${end}\n\nSkills: ${skills}\n\n${position.description.trim()}`
    })
  )
  .join("\n\n")}
`)
}
