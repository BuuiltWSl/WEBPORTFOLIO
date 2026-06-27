'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Code2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Lang, PortfolioProject } from '../../lib/portfolio'
import { textFor } from '../../lib/portfolio'
import { useLanguage } from '../providers'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

type ProjectSectionProps = {
  id: string
  title: Record<Lang, string> | string
  subtitle: Record<Lang, string> | string
  icon: string
  projects: PortfolioProject[]
  variant?: 'default' | 'highlight'
}

export function ProjectSection({ id, title, subtitle, icon, projects, variant = 'default' }: ProjectSectionProps) {
  const isHighlight = variant === 'highlight'
  const { lang } = useLanguage()
  const sectionTitle = typeof title === 'string' ? title : title[lang]
  const sectionSubtitle = typeof subtitle === 'string' ? subtitle : subtitle[lang]

  const mediaUrl = (project: PortfolioProject) => {
    const image = project.project_media?.find((item) => item.kind === 'image')
    if (!image || !supabase) return ''
    return supabase.storage.from(image.bucket).getPublicUrl(image.path).data.publicUrl
  }

  return (
    <section id={id} className={`py-24 ${isHighlight ? 'bg-white/60 backdrop-blur-sm' : ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 block">{icon}</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800">{sectionTitle}</h2>
          <p className="text-slate-400 mt-4 text-lg">{sectionSubtitle}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className={`grid gap-6 ${
            projects.length <= 2
              ? 'md:grid-cols-2 max-w-3xl mx-auto'
              : projects.length <= 4
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {projects.map((proj) => {
            const image = mediaUrl(proj)
            const achievement = textFor(lang, proj.achievement_th, proj.achievement_en)
            const tags = Array.from(new Set([...(proj.tags || []), ...(proj.technologies || [])])).slice(0, 6)

            return (
              <motion.div
                key={proj.id}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className="card-shine bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/8 transition-all duration-400 border border-slate-100 flex flex-col group overflow-hidden"
              >
                <Link href={`/project/${id}/${proj.id}`} className="flex flex-col flex-grow p-7 w-full h-full">
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center text-xl border border-indigo-100/50">
                      {icon}
                    </div>
                    {achievement && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100">
                        🏆 {achievement}
                      </span>
                    )}
                  </div>

                  {image ? (
                    <div className="mb-5 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={image}
                        alt={textFor(lang, proj.title_th, proj.title_en)}
                        width={640}
                        height={400}
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="mb-5 aspect-[16/10] rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center text-indigo-300">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-indigo-600 transition-colors tracking-tight relative z-10">
                    {textFor(lang, proj.title_th, proj.title_en)}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mb-3 relative z-10">
                    {textFor(lang, proj.subtitle_th, proj.subtitle_en)}
                  </p>
                  <p className="text-slate-400 text-sm flex-grow leading-relaxed line-clamp-3 relative z-10">
                    {textFor(lang, proj.details_th, proj.details_en)}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-5 relative z-10">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-semibold border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-indigo-500 text-xs font-semibold relative z-10">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {lang === 'th' ? 'ดูรายละเอียด ->' : 'View details ->'}
                    </span>
                    <span className="flex items-center gap-2">
                      {proj.github_url && <Code2 size={15} />}
                      {proj.demo_url && <ExternalLink size={15} />}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
