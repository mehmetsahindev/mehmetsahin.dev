import { MapPinIcon } from "lucide-react"

import { getExperiences, getProfile } from "@/features/portfolio/data/queries"

import { Panel, PanelContent } from "../panel"
import { EmailItem } from "./email-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"
import { JobItem } from "./job-item"
import { PhoneItem } from "./phone-item"

export async function Overview() {
  const [profile, experiences] = await Promise.all([
    getProfile(),
    getExperiences(),
  ])

  // Current roles: positions without an end date that are marked to show.
  const jobs = experiences.flatMap((experience) =>
    experience.positions
      .filter((position) => !position.endDate && position.showInOverview)
      .map((position) => ({
        title: position.title,
        company: experience.companyName,
        website: experience.companyWebsite,
        experienceId: experience.id,
      }))
  )

  // Encoded so plain-text scrapers do not pick them up from the HTML.
  const emailB64 = profile.email
    ? Buffer.from(profile.email).toString("base64")
    : ""
  const phoneNumberB64 = profile.phone
    ? Buffer.from(profile.phone).toString("base64")
    : ""

  const itemCount =
    jobs.length +
    [profile.location, emailB64, phoneNumberB64].filter(Boolean).length

  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>

      {/* Filled column by column, so both columns get an even share. */}
      <PanelContent
        className="grid gap-x-4 gap-y-2.5 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-(--overview-rows)"
        style={
          {
            "--overview-rows": `repeat(${Math.ceil(itemCount / 2)}, auto)`,
          } as React.CSSProperties
        }
      >
        {jobs.map((job, index) => {
          return (
            <JobItem
              key={index}
              title={job.title}
              company={job.company}
              website={job.website}
              experienceId={job.experienceId}
            />
          )
        })}

        {profile.location && (
          <IntroItem>
            <IntroItemIcon>
              <MapPinIcon />
            </IntroItemIcon>
            <IntroItemContent>
              <IntroItemLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`}
                aria-label={`Location: ${profile.location}`}
              >
                {profile.location}
              </IntroItemLink>
            </IntroItemContent>
          </IntroItem>
        )}

        {emailB64 && <EmailItem emailB64={emailB64} />}

        {phoneNumberB64 && <PhoneItem phoneNumberB64={phoneNumberB64} />}
      </PanelContent>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-1 w-px -translate-x-2.25 border-r border-dashed border-line max-sm:hidden" />
    </Panel>
  )
}
