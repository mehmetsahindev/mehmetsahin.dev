import { CollapsibleList } from "@/components/collapsible-list"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { getProjects } from "@/features/portfolio/data/queries"
import { toProject } from "@/features/portfolio/lib/mappers"

import { ProjectItem } from "./project-item"

const ID = "projects"

export async function Projects() {
  const projects = (await getProjects()).map(toProject)

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Projects</a>
          <PanelTitleSup>({projects.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={projects}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  )
}
