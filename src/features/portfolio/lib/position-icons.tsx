import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  DraftingCompassIcon,
  GraduationCapIcon,
  LightbulbIcon,
  MegaphoneIcon,
  ServerIcon,
  SmartphoneIcon,
  UsersIcon,
} from "lucide-react"

/** Icons offered for experience positions. Keys are stored in the database. */
export const POSITION_ICONS = {
  code: { label: "Code", icon: CodeXmlIcon },
  design: { label: "Design", icon: DraftingCompassIcon },
  business: { label: "Business", icon: BriefcaseBusinessIcon },
  idea: { label: "Idea", icon: LightbulbIcon },
  backend: { label: "Backend", icon: ServerIcon },
  mobile: { label: "Mobile", icon: SmartphoneIcon },
  team: { label: "Team", icon: UsersIcon },
  marketing: { label: "Marketing", icon: MegaphoneIcon },
  education: { label: "Education", icon: GraduationCapIcon },
} as const

export type PositionIconKey = keyof typeof POSITION_ICONS

export function getPositionIcon(key: string) {
  const entry =
    POSITION_ICONS[key as PositionIconKey] ?? POSITION_ICONS.business
  const Icon = entry.icon
  return <Icon />
}
