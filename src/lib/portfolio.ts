export type Lang = 'th' | 'en'

export type PortfolioCategory = 'computer' | 'scimath' | 'camp' | 'about'

export type PortfolioProject = {
  id: string
  legacyId?: number
  category: PortfolioCategory
  title_th: string
  title_en?: string | null
  subtitle_th?: string | null
  subtitle_en?: string | null
  details_th?: string | null
  details_en?: string | null
  tags: string[]
  technologies: string[]
  achievement_th?: string | null
  achievement_en?: string | null
  github_url?: string | null
  demo_url?: string | null
  project_date?: string | null
  sort_order: number
  is_featured: boolean
  is_visible: boolean
  project_media?: ProjectMedia[]
}

export type ProjectMedia = {
  id: string
  project_id: string
  kind: 'image' | 'certificate'
  bucket: string
  path: string
  alt_th?: string | null
  alt_en?: string | null
  sort_order: number
}

export type AboutMe = {
  id: number
  title_th: string
  title_en: string
  body_th: string
  body_en: string
}

export type Review = {
  id: string
  user_id?: string | null
  author_name: string
  author_email?: string | null
  rating?: number | null
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export const categoryMeta: Record<PortfolioCategory, {
  id: PortfolioCategory
  icon: string
  label: Record<Lang, string>
  subtitle: Record<Lang, string>
}> = {
  computer: {
    id: 'computer',
    icon: '💻',
    label: { th: 'ผลงานคอมพิวเตอร์', en: 'Computer Projects' },
    subtitle: {
      th: 'โปรเจกต์ การแข่งขัน และประสบการณ์ด้านซอฟต์แวร์',
      en: 'Software projects, competitions, and technical milestones.',
    },
  },
  scimath: {
    id: 'scimath',
    icon: '🚀',
    label: { th: 'วิทย์-คณิต', en: 'Sci-Math' },
    subtitle: {
      th: 'งานประดิษฐ์ การทดลอง และประสบการณ์เชิงวิศวกรรม',
      en: 'Engineering experiments, inventions, and science activities.',
    },
  },
  camp: {
    id: 'camp',
    icon: '🏕️',
    label: { th: 'ค่ายและกิจกรรม', en: 'Camp & Other' },
    subtitle: {
      th: 'ค่าย กิจกรรม และจุดเปลี่ยนที่ทำให้เติบโต',
      en: 'Camps, activities, and growth moments.',
    },
  },
  about: {
    id: 'about',
    icon: '✨',
    label: { th: 'เกี่ยวกับผม', en: 'About Me' },
    subtitle: {
      th: 'เรื่องราว แนวคิด และเป้าหมายของผม',
      en: 'Story, mindset, and goals.',
    },
  },
}

export function textFor(lang: Lang, th?: string | null, en?: string | null) {
  if (lang === 'en') return en || th || ''
  return th || en || ''
}

