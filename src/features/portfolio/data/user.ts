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
- 5 yılı aşkın deneyime sahip bir **Yazılım Geliştiriciyim**.
- **React**, **React Native**, **TypeScript** ve **Node.js** teknolojilerinde uzmanlığa sahibim.
- Ölçeklenebilir ve kullanıcı odaklı **web/mobil** uygulamalar geliştirme konusunda yetkinim.
- Temiz kod prensiplerine, performans optimizasyonuna ve karmaşık fikirleri kusursuz dijital ürünlere dönüştürmeye odaklanıyorum.
`,
  avatar: "/images/avatar.webp",
  ogImage:
    "https://assets.chanhdai.com/images/screenshot-og-image-dark.png?v=8",
  namePronunciationUrl: null,
  timeZone: "Europe/Istanbul",
  keywords: ["mehmetsahin", "mehmetsahindev", "mehmet şahin"],
  dateCreated: "2026-04-13", // YYYY-MM-DD
}
