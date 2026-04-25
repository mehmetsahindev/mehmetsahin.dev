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
          "- Robotik sistemler için kullanıcı odaklı dijital çözümler geliştiriyorum. Web ve mobil uygulamalar geliştirmenin yanı sıra kullanıcı deneyimi ve arayüz tasarımı üzerinde de çalışıyorum.",
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
          "- Freelance geliştirici olarak kişisel projeler geliştiriyor ve açık kaynağa aktif olarak katkıda bulunuyorum. Fikirleri tamamen çalışan, yayına hazır ürünlere dönüştürerek uçtan uca web ve mobil uygulama çözümleri sunuyorum.",
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
        description: `- Proje yönetim süreçlerine aktif olarak katıldım ve ekip içi koordinasyonun etkin şekilde sağlanmasına katkıda bulundum. Ayrıca sunucu yönetimi, bakım ve yedekleme süreçleri dahil olmak üzere sistem yönetimi görevlerinden sorumluydum.`,
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
        description: `- Yeni startup girişimleri için web ve mobil uygulamaların geliştirilmesinde aktif rol aldım. Ayrıca farklı şirketler için kurumsal web siteleri ve mobil uygulama çözümleri sunarak çeşitli dijital projelere katkıda bulundum.`,
        skills: ["React", "Flutter", "PHP", "MySQL", "Git"],
        isExpanded: false,
      },
    ],
    isCurrentEmployer: false,
  },
]
