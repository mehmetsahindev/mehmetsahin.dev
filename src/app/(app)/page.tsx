import { Fragment } from "react"
import type { Metadata } from "next"
import { DEFAULT_LOCALE } from "@/i18n/config"
import type { ProfilePage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl, cn } from "@/lib/utils"
import { getPublishedPosts } from "@/features/blog/data/queries"
import { Blog } from "@/features/portfolio/components/blog"
import { Education } from "@/features/portfolio/components/education"
import { Experiences } from "@/features/portfolio/components/experiences"
import { FrameWidthDimension } from "@/features/portfolio/components/frame-width-dimension"
import { Hello } from "@/features/portfolio/components/hello"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
import { SeparatorHeightDimension } from "@/features/portfolio/components/separator-height-dimension"
import { SocialLinks } from "@/features/portfolio/components/social-links"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import {
  getEducation,
  getExperiences,
  getProfile,
  getProjects,
  getSiteSettings,
  getTechStack,
} from "@/features/portfolio/data/queries"
import {
  HOME_SECTIONS,
  type HomeSectionId,
} from "@/features/portfolio/lib/home-sections"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

const SECTION_COMPONENTS: Record<HomeSectionId, () => React.ReactNode> = {
  hello: () => <Hello />,
  blog: () => <Blog />,
  stack: () => <TechStack />,
  experience: () => <Experiences />,
  education: () => <Education />,
  projects: () => <Projects />,
}

export default async function HomePage() {
  const [
    profile,
    settings,
    techStack,
    experiences,
    education,
    projects,
    posts,
  ] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getTechStack(),
    getExperiences(),
    getEducation(),
    getProjects(),
    getPublishedPosts(DEFAULT_LOCALE),
  ])

  const hasContent: Record<HomeSectionId, boolean> = {
    hello: Boolean(profile.about.trim()),
    blog: posts.length > 0,
    stack: techStack.some((category) => category.items.length > 0),
    experience: experiences.length > 0,
    education: education.length > 0,
    projects: projects.length > 0,
  }

  // Hidden in settings or empty sections are skipped so separators never
  // stack up.
  const visibleSections = HOME_SECTIONS.filter(
    (section) =>
      settings.homeSections[section.id] !== false && hasContent[section.id]
  )

  return (
    <>
      <JsonLdScript data={getProfilePageJsonLd(profile.createdAt)} />

      <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
        <div className="mx-auto md:max-w-3xl">
          <FrameWidthDimension />
          <ProfileHeader />
          <Separator>
            {/* Mirrors the avatar's diameter, so same breakpoint. */}
            <SeparatorHeightDimension className="hidden lg:block" height={32} />
          </Separator>

          <Overview />
          <SocialLinks />

          {visibleSections.map((section) => (
            <Fragment key={section.id}>
              <Separator />
              {SECTION_COMPONENTS[section.id]()}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}

function getProfilePageJsonLd(createdAt: string): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/"),
    dateCreated: createdAt,
    dateModified: new Date().toISOString(),
    // Reference the Person defined in the WebSite node (rendered globally in
    // the root layout) so both blocks resolve to the same entity.
    mainEntity: { "@id": JSON_LD_ID.person },
  }
}

function Separator({ className, children }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "stripe-divider h-(--separator-height) w-full border-x border-x-line",
        className
      )}
    >
      {children}
    </div>
  )
}
