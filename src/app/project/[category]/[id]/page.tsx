import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Code2, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
import { projectCategories } from '../../../components/data'
import { categoryMeta, PortfolioCategory, PortfolioProject, textFor } from '../../../../lib/portfolio'
import { createClient } from '@supabase/supabase-js'

type PageProps = {
  params: Promise<{
    category: string
    id: string
  }>
}

async function loadDbProject(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  const client = createClient(url, key)
  const { data } = await client.from('projects').select('*, project_media(*)').eq('id', id).maybeSingle()
  return data as PortfolioProject | null
}

function loadLegacyProject(categoryId: string, rawId: string): PortfolioProject | null {
  const projectId = parseInt(rawId, 10)
  if (Number.isNaN(projectId)) return null
  const categoryProjects = projectCategories[categoryId]
  if (!categoryProjects) return null
  const project = categoryProjects.find((item) => item.id === projectId)
  if (!project) return null

  return {
    id: `${categoryId}-${project.id}`,
    legacyId: project.id,
    category: categoryId as PortfolioCategory,
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
    github_url: null,
    demo_url: null,
    project_date: null,
    sort_order: project.id,
    is_featured: false,
    is_visible: true,
    project_media: [],
  } satisfies PortfolioProject
}

function readLegacyMarkdown(categoryId: string, legacyId?: number, fallback?: string | null) {
  if (!legacyId) return fallback || ''
  try {
    const filePath = path.join(process.cwd(), `src/content/projects/${categoryId}-${legacyId}.md`)
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return fallback || ''
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const categoryId = resolvedParams.category as PortfolioCategory
  const dbProject = await loadDbProject(resolvedParams.id)
  const project = dbProject || loadLegacyProject(categoryId, resolvedParams.id)

  if (!project) notFound()

  const meta = categoryMeta[categoryId] || categoryMeta.computer
  const markdownContent = readLegacyMarkdown(categoryId, project.legacyId, textFor('th', project.details_th, project.details_en))

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/#${categoryId}`} className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-12">
          <span className="mr-2">←</span> กลับไปยังหน้าหลัก
        </Link>

        <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-xl shadow-indigo-500/5 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center text-4xl border border-indigo-100/50 flex-shrink-0">
              {meta.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 mb-2">
                {textFor('th', project.title_th, project.title_en)}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium">
                {textFor('th', project.subtitle_th, project.subtitle_en)}
              </p>
            </div>
          </div>

          {textFor('th', project.achievement_th, project.achievement_en) && (
            <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 rounded-2xl mb-10 border border-amber-100">
              <span className="text-2xl">🏆</span>
              <span className="text-amber-700 font-semibold text-lg">{textFor('th', project.achievement_th, project.achievement_en)}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-10">
            {project.github_url && (
              <a href={project.github_url} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                <Code2 size={16} /> GitHub
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
                <ExternalLink size={16} /> Demo
              </a>
            )}
          </div>

          <div className="prose prose-slate prose-indigo md:prose-lg max-w-none mb-12 prose-img:rounded-2xl prose-img:shadow-lg prose-img:w-full prose-headings:tracking-tight prose-a:text-indigo-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tags & Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...(project.tags || []), ...(project.technologies || [])])).map((tag) => (
                <span key={tag} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold border border-indigo-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
