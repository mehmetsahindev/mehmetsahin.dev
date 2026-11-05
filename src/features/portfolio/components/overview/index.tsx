import { MapPinIcon } from "lucide-react"

import { getExperiences, getProfile } from "@/features/portfolio/data/queries"

import { Panel, PanelContent } from "../panel"
import { CurrentLocalTimeItem } from "./current-local-time-item"
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

  // Current roles come from experience positions without an end date.
  const jobs = experiences.flatMap((experience) =>
    experience.positions
      .filter((position) => !position.endDate)
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

  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
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

        <CurrentLocalTimeItem timeZone={profile.timeZone} />

        {emailB64 && <EmailItem emailB64={emailB64} />}

        {phoneNumberB64 && <PhoneItem phoneNumberB64={phoneNumberB64} />}
      </PanelContent>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-1 w-px -translate-x-2.25 border-r border-dashed border-line max-sm:hidden" />
    </Panel>
  )
}
