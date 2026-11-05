/**
 * Optional home page sections, in display order. Each can be hidden in the
 * admin settings; sections without content are hidden automatically.
 */
export const HOME_SECTIONS = [
  { id: "hello", label: "About" },
  { id: "blog", label: "Blog" },
  { id: "stack", label: "Tech stack" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
] as const

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"]
