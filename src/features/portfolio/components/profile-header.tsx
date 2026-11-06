import { getProfile } from "@/features/portfolio/data/queries"

import { ProfileMark } from "./profile-mark"
import { ProfileTaglines } from "./profile-taglines"
import { VerifiedIcon } from "./verified-icon"

export async function ProfileHeader() {
  const profile = await getProfile()

  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-x-line after:z-1">
      <figure className="relative col-span-2 p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        <ProfileMark />
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="-mx-px my-0 flex outline-none">
            <div className="relative z-10 size-30 rounded-full min-[24rem]:size-32 sm:size-40">
              {profile.avatarUrl ? (
                <img
                  className="block size-full rounded-[inherit] object-cover select-none"
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                />
              ) : (
                <div
                  className="flex size-full items-center justify-center rounded-[inherit] bg-muted font-heading text-5xl font-medium text-muted-foreground select-none"
                  aria-hidden
                >
                  {profile.displayName.slice(0, 1)}
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] inset-ring-1 inset-ring-foreground dark:inset-ring-foreground/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex -translate-x-px items-center gap-2 pl-4">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">
              {profile.displayName}
            </h1>

            <VerifiedIcon className="size-4.5 select-none" aria-hidden />
          </div>

          <ProfileTaglines className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
            {profile.taglines}
          </ProfileTaglines>
        </div>
      </div>
    </div>
  )
}
