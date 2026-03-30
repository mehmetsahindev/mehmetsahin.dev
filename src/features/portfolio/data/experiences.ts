import type { Experience } from "../types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "akinrobotics",
    companyName: "AKINROBOTICS",
    companyLogo: "/images/akinrobotics.svg",
    companyWebsite: "https://akinrobotics.com",
    positions: [
      {
        id: "1",
        title: "Software Developer",
        employmentPeriod: {
          start: "02.2024",
        },
        employmentType: "Full-time",
        icon: "code",
        description:
          "- I develop user-focused digital solutions for robotic systems. I am involved in building web and mobile applications while also working on user experience and interface design.",
        skills: [
          "TypeScript",
          "React",
          "React Native",
          "Node.js",
          "Linux",
          "Git",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "freelance",
    companyName: "Freelance",
    companyLogo: null as unknown as string,
    companyWebsite: "https://mehmetsahin.dev",
    positions: [
      {
        id: "1",
        title: "Software Developer",
        employmentPeriod: {
          start: "01.2021",
        },
        employmentType: "Full-time",
        icon: "code",
        description:
          "- As a freelance developer, I build personal projects and actively contribute to open-source. I provide end-to-end web and mobile application solutions, turning ideas into fully functional, production-ready products.",
        skills: ["TypeScript", "React", "React Native", "Node.js"],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "sofft",
    companyName: "Sofft IT Inc.",
    companyLogo: "/images/sofft.jpg",
    companyWebsite: "https://sofft.com.tr",
    positions: [
      {
        id: "2",
        title: "Software Team Lead",
        employmentPeriod: {
          start: "04.2022",
          end: "06.2023",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- I actively participated in project management processes, ensuring effective team coordination. In addition, I was responsible for system administration tasks, including server management, maintenance, and backup processes.`,
        skills: ["Linux", "Server Management", "DevOps"],
        isExpanded: true,
      },
      {
        id: "1",
        title: "Software Developer",
        employmentPeriod: {
          start: "03.2021",
          end: "04.2022",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- I actively took part in the development of web and mobile applications for new startup initiatives. Additionally, I contributed to various digital projects by delivering corporate websites and mobile application solutions for different companies.`,
        skills: ["React", "Flutter", "PHP", "MySQL", "Git"],
        isExpanded: false,
      },
    ],
    isCurrentEmployer: false,
  },
]
