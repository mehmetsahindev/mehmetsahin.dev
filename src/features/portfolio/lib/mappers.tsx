import { hasIcon, PortfolioIcon } from "../components/portfolio-icon"
import type { EducationData, ExperienceData, ProjectData } from "../data/types"
import type { Education } from "../types/education"
import type { Experience } from "../types/experiences"
import type { Project } from "../types/projects"
import { formatPeriod } from "./dates"
import { getPositionIcon } from "./position-icons"

/** Maps database records to the shapes the section components render. */

export function toExperience(data: ExperienceData): Experience {
  return {
    id: data.id,
    companyName: data.companyName,
    companyLogo: data.logoUrl ?? undefined,
    companyWebsite: data.companyWebsite || undefined,
    location: data.location || undefined,
    locationType:
      (data.locationType as Experience["locationType"]) || undefined,
    isCurrentEmployer: data.positions.some((position) => !position.endDate),
    positions: data.positions.map((position) => ({
      id: position.id,
      title: position.title,
      employmentPeriod: formatPeriod(position.startDate, position.endDate),
      employmentType: position.employmentType || undefined,
      description: position.description || undefined,
      icon: getPositionIcon(position.icon),
      skills: position.skills,
      isExpanded: position.isExpanded,
    })),
  }
}

export function toEducation(data: EducationData): Education {
  return {
    id: data.id,
    school: data.school,
    degree: data.degree || undefined,
    fieldOfStudy: data.fieldOfStudy || undefined,
    period: formatPeriod(data.startDate, data.endDate),
    description: data.description || undefined,
    skills: data.skills,
    isExpanded: data.isExpanded,
  }
}

export function toProject(data: ProjectData): Project {
  return {
    id: data.id,
    title: data.title,
    period: formatPeriod(data.startDate, data.endDate),
    link: data.url,
    skills: data.skills,
    description: data.description || undefined,
    icon: hasIcon(data.icon) ? <PortfolioIcon icon={data.icon} /> : undefined,
    isExpanded: data.isExpanded,
  }
}
