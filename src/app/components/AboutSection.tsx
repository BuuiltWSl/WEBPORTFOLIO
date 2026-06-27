'use client'

import { motion } from 'framer-motion'
import type { AboutMe } from '../../lib/portfolio'
import { textFor } from '../../lib/portfolio'
import { useLanguage } from '../providers'

export function AboutSection({ about }: { about: AboutMe }) {
  const { lang } = useLanguage()

  return (
    <section id="about" className="py-20 bg-white/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-stretch"
        >
          <div className="rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 shadow-xl shadow-indigo-500/5">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-500">About Me</p>
            <h2 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">
              {textFor(lang, about.title_th, about.title_en)}
            </h2>
            <p className="mt-5 text-slate-500 leading-relaxed">
              {lang === 'th'
                ? 'ส่วนนี้คือประวัติ แนวคิด และเหตุผลที่ทำให้ผมชอบสร้างสิ่งใหม่ด้วยเทคโนโลยี'
                : 'This section tells my story, mindset, and why I love building with technology.'}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 md:p-10 shadow-xl shadow-indigo-500/5">
            <p className="text-lg leading-9 text-slate-600 whitespace-pre-line">
              {textFor(lang, about.body_th, about.body_en)}
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              {[
                lang === 'th' ? 'สร้างจริง' : 'Builds real things',
                lang === 'th' ? 'เรียนรู้เร็ว' : 'Fast learner',
                lang === 'th' ? 'คิดแบบวิศวะ' : 'Engineering mindset',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

