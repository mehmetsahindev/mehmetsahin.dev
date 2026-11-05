import type { User } from "@/features/portfolio/types/user"

// Placeholder profile until the admin panel (phase 4) moves this to the database.
export const USER: User = {
  firstName: "Mehmet",
  lastName: "Şahin",
  displayName: "Mehmet Şahin",
  username: "mehmetsahindev",
  gender: "male",
  pronouns: "he/him",
  bio: "Software developer.",
  taglines: ["Software developer."],
  address: "Türkiye",
  phoneNumberB64: "",
  emailB64: "",
  website: "https://mehmetsahin.dev",
  jobTitle: "Software Developer",
  jobs: [],
  about: `- Hi, I'm Mehmet. This section will be editable from the admin panel.`,
  avatar: "https://github.com/mehmetsahindev.png",
  ogImage: "/og/simple?title=Mehmet%20%C5%9Eahin",
  timeZone: "Europe/Istanbul",
  keywords: ["mehmetsahindev", "mehmet sahin", "mehmet şahin"],
  dateCreated: "2026-11-05", // YYYY-MM-DD
}
