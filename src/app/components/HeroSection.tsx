'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { skills } from './data'
import { useLanguage } from '../providers'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

export function HeroSection() {
  const { lang } = useLanguage()

  return (
    <section id="main" className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="max-w-6xl mx-auto px-6 py-32 relative z-10 w-full">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="md:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium"
            >
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              {lang === 'th' ? 'นักสร้างเกมและเทคโนโลยีสร้างสรรค์' : 'Game Developer & Creative Technologist'}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight">
              <span className="text-slate-800">&quot;A butterfly never knows</span>
              <br />
              <span className="text-slate-800">the beauty of its own wings.</span>
              <br />
              <span className="gradient-text">I&apos;m Just a butterfly,</span>
              <br />
              <span className="gradient-text">chasing my wings. 🦋✨&quot;</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
              {lang === 'th'
                ? 'เด็กสายสร้างที่ใช้เทคโนโลยี เกม และความคิดสร้างสรรค์ เพื่อสร้างประสบการณ์และแก้ปัญหาให้ผู้คน'
                : 'A young builder using technology, games, and creativity to create experiences and solve problems for people.'}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="px-3 py-1.5 bg-white/80 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 tag-glow"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:col-span-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-[2.5rem] blur-2xl" />
              <div className="relative bg-white rounded-[2rem] p-6 shadow-xl shadow-indigo-500/10 border border-white/60 w-72">
                <div className="w-full aspect-[3/4] rounded-2xl mb-5 overflow-hidden relative shadow-inner">
                  <Image
                    src="/profile.png"
                    alt="Profile"
                    width={320}
                    height={426}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>

                <h2 className="text-xl font-bold tracking-tight text-center">Dev.bu1ltwsl</h2>
                <p className="text-slate-400 text-sm text-center mt-1">Game Developer</p>

                <div className="mt-5 pt-5 border-t border-slate-100 space-y-3 text-sm">
                  <ProfileRow label={lang === 'th' ? 'ชื่อ' : 'Name'} value={lang === 'th' ? 'สร้างสรรค์ (บิ๊ว)' : 'Sangsan (Built)'} />
                  <ProfileRow label={lang === 'th' ? 'อายุ' : 'Age'} value={lang === 'th' ? '17 ปี' : '17'} />
                  <ProfileRow label={lang === 'th' ? 'โรงเรียน' : 'School'} value={lang === 'th' ? 'สวนกุหลาบฯ รังสิต' : 'Suankularb Rangsit'} />
                  <ProfileRow label={lang === 'th' ? 'เป้าหมาย' : 'Goal'} value={lang === 'th' ? 'วิศวะคอม ม.เกษตร' : 'Computer Engineering'} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700 text-right text-xs">{value}</span>
    </div>
  )
}
