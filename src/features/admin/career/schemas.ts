import { z } from "zod"

import { MONTH_PATTERN } from "@/features/portfolio/lib/dates"
import { POSITION_ICONS } from "@/features/portfolio/lib/position-icons"

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Self-employed",
] as const

export const LOCATION_TYPES = ["On-site", "Hybrid", "Remote"] as const

const month = z.string().regex(MONTH_PATTERN, "Pick a month.")
const optionalUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/, error: "Enter a full URL (https://…)." }),
])
const skills = z.array(z.string().trim().min(1).max(60)).max(40)
const markdown = z.string().max(20_000)

/** End must not be before start; a null end means "present". */
function withPeriodCheck<
  T extends z.ZodType<{ startDate: string; endDate: string | null }>,
>(schema: T) {
  return schema.refine(
    (value) => !value.endDate || value.endDate >= value.startDate,
    { path: ["endDate"], message: "End must be after start." }
  )
}

const period = {
  startDate: month,
  endDate: month.nullable(),
}

export const positionSchema = withPeriodCheck(
  z.object({
    id: z.uuid().nullable(),
    title: z.string().trim().min(1, "Title is required.").max(100),
    employmentType: z.string().max(40),
    ...period,
    description: markdown,
    skills,
    icon: z.enum(Object.keys(POSITION_ICONS) as [string, ...string[]]),
    isExpanded: z.boolean(),
  })
)

export const experienceSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required.").max(100),
  companyWebsite: optionalUrl,
  logoId: z.uuid().nullable(),
  location: z.string().trim().max(100),
  locationType: z.union([z.literal(""), z.enum(LOCATION_TYPES)]),
  positions: z.array(positionSchema).min(1, "Add at least one position."),
})

export type PositionInput = z.infer<typeof positionSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>

export const educationSchema = withPeriodCheck(
  z.object({
    school: z.string().trim().min(1, "School is required.").max(120),
    degree: z.string().trim().max(120),
    fieldOfStudy: z.string().trim().max(120),
    ...period,
    description: markdown,
    skills,
    isExpanded: z.boolean(),
  })
)

export type EducationInput = z.infer<typeof educationSchema>

const iconSchema = z.object({
  slug: z.string().max(100).nullable(),
  mediaId: z.uuid().nullable(),
})

export const projectSchema = withPeriodCheck(
  z.object({
    title: z.string().trim().min(1, "Title is required.").max(120),
    url: optionalUrl,
    ...period,
    description: markdown,
    skills,
    icon: iconSchema,
    isExpanded: z.boolean(),
  })
)

export type ProjectInput = z.infer<typeof projectSchema>

export const techItemSchema = z.object({
  categoryId: z.uuid("Pick a category."),
  name: z.string().trim().min(1, "Name is required.").max(60),
  url: optionalUrl,
  icon: iconSchema,
})

export type TechItemInput = z.infer<typeof techItemSchema>

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(60)
