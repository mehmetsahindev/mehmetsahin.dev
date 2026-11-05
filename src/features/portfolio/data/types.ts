/** Plain, serializable records read from the database for the public site. */

export type IconRef = {
  slug: string | null
  mediaKey: string | null
}

export type ProfileData = {
  firstName: string
  lastName: string
  displayName: string
  username: string
  jobTitle: string
  bio: string
  taglines: string[]
  about: string
  location: string
  email: string
  phone: string
  timeZone: string
  avatarUrl: string | null
  ogImageUrl: string | null
  keywords: string[]
  createdAt: string
}

export type SocialLinkData = {
  id: string
  platform: string
  handle: string
  url: string
  sameAs: boolean
}

export type PositionData = {
  id: string
  title: string
  employmentType: string
  startDate: string
  endDate: string | null
  description: string
  skills: string[]
  icon: string
  isExpanded: boolean
}

export type ExperienceData = {
  id: string
  companyName: string
  companyWebsite: string
  logoUrl: string | null
  location: string
  locationType: string
  positions: PositionData[]
}

export type EducationData = {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string | null
  description: string
  skills: string[]
  isExpanded: boolean
}

export type ProjectData = {
  id: string
  title: string
  url: string
  startDate: string
  endDate: string | null
  description: string
  skills: string[]
  icon: IconRef
  isExpanded: boolean
}

export type TechItemData = {
  id: string
  name: string
  url: string
  icon: IconRef
}

export type TechCategoryData = {
  id: string
  name: string
  items: TechItemData[]
}

export type BookmarkCategoryData = {
  id: string
  name: string
  slug: string
}

export type BookmarkData = {
  id: string
  title: string
  url: string
  author: string
  note: string
  icon: IconRef
  bookmarkedAt: string
  category: BookmarkCategoryData
}

export type SiteSettingsData = {
  homeSections: Record<string, boolean>
}
