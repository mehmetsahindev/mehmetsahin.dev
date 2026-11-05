import { Fragment } from "react"
import type { Metadata } from "next"
import type { ProfilePage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl, cn } from "@/lib/utils"
import { getBlogPosts } from "@/features/doc/data/documents"
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
import { EDUCATION } from "@/features/portfolio/data/education"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { USER } from "@/features/portfolio/data/user"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

type HomeSection = {
  id: string
  visible: boolean
  render: () => React.ReactNode
}

export default function HomePage() {
  // Sections without content are skipped so separators never stack up.
  const sections: HomeSection[] = [
    { id: "hello", visible: Boolean(USER.about), render: () => <Hello /> },
    {
      id: "blog",
      visible: getBlogPosts().length > 0,
      render: () => <Blog />,
    },
    {
      id: "stack",
      visible: TECH_STACK.length > 0,
      render: () => <TechStack />,
    },
    {
      id: "experience",
      visible: EXPERIENCES.length > 0,
      render: () => <Experiences />,
    },
    {
      id: "education",
      visible: EDUCATION.length > 0,
      render: () => <Education />,
    },
    {
      id: "projects",
      visible: PROJECTS.length > 0,
      render: () => <Projects />,
    },
  ]

  return (
    <>
      <JsonLdScript data={getProfilePageJsonLd()} />

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

          {sections
            .filter((section) => section.visible)
            .map((section) => (
              <Fragment key={section.id}>
                <Separator />
                {section.render()}
              </Fragment>
            ))}
        </div>
      </div>
    </>
  )
}

function getProfilePageJsonLd(): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/"),
    dateCreated: new Date(USER.dateCreated).toISOString(),
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
