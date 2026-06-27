'use client'

import { useEffect, useMemo, useState } from 'react'
import { Navbar } from './Navbar'
import { HeroSection } from './HeroSection'
import { ProjectSection } from './ProjectSection'
import { BuiltSection } from './BuiltSection'
import { computerProjects, scimathProjects, otherCamps } from './data'
import { supabase } from '../../lib/supabase'
import { AboutMe, PortfolioCategory, PortfolioProject, Review, categoryMeta } from '../../lib/portfolio'
import { AboutSection } from './AboutSection'
import { ReviewsSection } from './ReviewsSection'

function legacyProjects(): PortfolioProject[] {
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

const defaultAbout: AboutMe = {
  id: 1,
  title_th: 'About Me',
  title_en: 'About Me',
  body_th:
    'ผมเป็นเด็กสายสร้างที่ชอบใช้เทคโนโลยี เกม และความคิดสร้างสรรค์ เพื่อสร้างประสบการณ์และแก้ปัญหาให้ผู้คน เป้าหมายคือเติบโตไปทางวิศวกรรมคอมพิวเตอร์ เกม และระบบที่ใช้งานได้จริง',
  body_en:
    'I am a builder who uses technology, games, and creativity to make useful experiences and solve real problems. My goal is to grow toward computer engineering, game development, and practical product building.',
}

export function PortfolioClient() {
  const [projects, setProjects] = useState<PortfolioProject[]>(legacyProjects)
  const [about, setAbout] = useState<AboutMe>(defaultAbout)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!supabase) return

    async function loadData() {
      const [{ data: projectRows }, { data: aboutRows }, { data: reviewRows }] = await Promise.all([
        supabase!
          .from('projects')
          .select('*, project_media(*)')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase!.from('about_me').select('*').eq('id', 1).maybeSingle(),
        supabase!
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(12),
      ])

      if (projectRows?.length) setProjects(projectRows as PortfolioProject[])
      if (aboutRows) setAbout(aboutRows as AboutMe)
      if (reviewRows) setReviews(reviewRows as Review[])
    }

    loadData()
  }, [])

  const grouped = useMemo(() => {
    return projects.reduce<Record<PortfolioCategory, PortfolioProject[]>>(
      (acc, project) => {
        acc[project.category]?.push(project)
        return acc
      },
      { computer: [], scimath: [], camp: [], about: [] },
    )
  }, [projects])

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection about={about} />

        {(['computer', 'scimath', 'camp'] as PortfolioCategory[]).map((category) => (
          <ProjectSection
            key={category}
            id={category}
            title={categoryMeta[category].label}
            subtitle={categoryMeta[category].subtitle}
            icon={categoryMeta[category].icon}
            projects={grouped[category]}
            variant={category === 'scimath' ? 'highlight' : 'default'}
          />
        ))}

        <ReviewsSection reviews={reviews} />
        <BuiltSection />
      </main>
    </div>
  )
}
