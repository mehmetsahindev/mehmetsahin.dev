import { z } from "zod"

const optionalEmail = z.union([z.literal(""), z.email("Enter a valid email.")])
const optionalPhone = z.union([
  z.literal(""),
  z
    .string()
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Use international format, e.g. +905551112233."
    ),
])

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required.").max(80),
  firstName: z.string().trim().max(60),
  lastName: z.string().trim().max(60),
  username: z.string().trim().max(60),
  jobTitle: z.string().trim().max(80),
  bio: z.string().trim().max(200),
  taglines: z.array(z.string().trim().min(1).max(120)).max(10),
  about: z.string().max(10_000),
  location: z.string().trim().max(100),
  email: optionalEmail,
  phone: optionalPhone,
  timeZone: z.string().trim().min(1, "Time zone is required."),
  avatarId: z.uuid().nullable(),
  ogImageId: z.uuid().nullable(),
  keywords: z.array(z.string().trim().min(1).max(60)).max(30),
})

export type ProfileInput = z.infer<typeof profileSchema>
