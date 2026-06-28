import { computerProjects, otherCamps, scimathProjects } from '../app/components/data'
import type { PortfolioCategory, PortfolioProject } from './portfolio'

function normalize(value?: string | null) {
  return (value || '').trim().toLowerCase()
}

export function legacyPortfolioProjects(): PortfolioProject[] {
  const convert = (category: PortfolioCategory, projects: typeof computerProjects): PortfolioProject[] =>
    projects.map((project) => ({
      id: `${category}-${project.id}`,
      legacyId: project.id,
      category,
      title_th: project.title,
      title_en: project.title,
      subtitle_th: project.subtitle,
      subtitle_en: project.subtitle,
      details_th: project.details,
      details_en: project.details,
      tags: project.tags,
      technologies: project.tags,
      achievement_th: project.achievement,
      achievement_en: project.achievement,
      sort_order: project.id,
      is_featured: false,
      is_visible: true,
      project_media: [],
    }))

  return [
    ...convert('computer', computerProjects),
    ...convert('scimath', scimathProjects),
    ...convert('camp', otherCamps),
  ]
}

export function mergeWithLegacyProjects(dbProjects: PortfolioProject[]) {
  const databaseKeys = new Set(dbProjects.map((project) => `${project.category}:${normalize(project.title_th)}`))
  const remainingLegacy = legacyPortfolioProjects().filter(
    (project) => !databaseKeys.has(`${project.category}:${normalize(project.title_th)}`),
  )

  return [...dbProjects, ...remainingLegacy].sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return (a.sort_order || 100) - (b.sort_order || 100)
  })
}
