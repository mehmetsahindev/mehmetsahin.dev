import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Mehmet",
  lastName: "Şahin",
  displayName: "Mehmet Şahin",
  username: "mehmetsahindev",
  gender: "male",
  pronouns: "he/him",
  bio: "Creating with code. Small details matter.",
  flipSentences: ["Computer Engineer", "Software Developer"],
  address: "Konya / Türkiye",
  phoneNumber: "KzkwIDU1NCA5NzAgMTk3Mg==", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "aGVsbG9AbWVobWV0c2FoaW4uZGV2", // base64 encoded
  website: "https://mehmetsahin.dev",
  jobTitle: "Software Developer",
  jobs: [
    {
      title: "Software Developer",
      company: "AKINROBOTICS",
      website: "https://www.akinrobotics.com/",
      experienceId: "akinrobotics",
    },
  ],
  about: `
- **Software Developer** with 5+ years of experience, driven by passion, consistently delivering high-quality work while continuously improving skills.
- Skilled in **React**, **React Native**, **TypeScript**, **Node.js**, and modern web technologies; building high-quality, user-centric web and mobile applications.
- Passionate about building software, continuously improving, and bringing ideas to life through well-crafted projects.
`,
  avatar: "/images/avatar.jpg",
  ogImage:
    "https://assets.chanhdai.com/images/screenshot-og-image-dark.png?v=8",
  namePronunciationUrl: null,
  timeZone: "Europe/Istanbul",
  keywords: [
    "ncdai",
    "nguyenchanhdai",
    "nguyen chanh dai",
    "chanhdai",
    "chanh dai",
    "iamncdai",
    "quaric",
    "zadark",
    "nguyễn chánh đại",
    "chánh đại",
  ],
  dateCreated: "2023-10-20", // YYYY-MM-DD
}
