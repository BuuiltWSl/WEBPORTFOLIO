'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../providers'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const growthPaths = ['Game Developer', 'Creative Technologist', 'Computer Engineer', 'Product Builder', 'Interactive Designer']

export function BuiltSection() {
  const { lang } = useLanguage()
  const highlights = [
    {
      icon: '🛠️',
      title: lang === 'th' ? 'สายสร้างจริง' : 'Real Builder',
      desc: lang === 'th' ? 'มีโปรเจกต์ เกม Prototype และระบบที่ใช้งานได้จริง' : 'Projects, games, prototypes, and practical systems.',
    },
    {
      icon: '🎮',
      title: 'Game Dev + Engineer',
      desc: lang === 'th' ? 'ผสมความคิดสร้างสรรค์ โค้ด UX/UI และวิธีคิดแบบวิศวะ' : 'Blends creativity, coding, UX/UI, and engineering thinking.',
    },
    {
      icon: '🧠',
      title: lang === 'th' ? 'เรียนรู้ด้วยตัวเอง' : 'Self-Learner',
      desc: lang === 'th' ? 'ใช้ AI ช่วยพัฒนา ทดลองทำจริง และเรียนรู้จากข้อผิดพลาด' : 'Uses AI, builds experiments, and learns from mistakes.',
    },
    {
      icon: '👑',
      title: 'Leadership',
      desc: lang === 'th' ? 'เคยเป็นหัวหน้าโปรเจกต์ คนคุมงาน และคนประสานทีม' : 'Project lead, event controller, and team coordinator.',
    },
  ]

  return (
    <section id="built" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="built-gradient rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-950/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-violet-500/15 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
              >
                Built.
              </motion.h2>
              <p className="text-xl md:text-2xl font-medium text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
                &quot;{lang === 'th'
                  ? 'เด็กสายสร้างที่ใช้เทคโนโลยี เกม และความคิดสร้างสรรค์ เพื่อสร้างประสบการณ์และแก้ปัญหาให้ผู้คน'
                  : 'A builder using technology, games, and creativity to create experiences and solve problems.'}&quot;
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {h.icon}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{h.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-4">
                🎯 {lang === 'th' ? 'แนวโน้มการเติบโต' : 'Growth Direction'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {growthPaths.map((path, i) => (
                  <motion.span
                    key={path}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-400/20 text-indigo-200 text-sm font-semibold"
                  >
                    {path}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm font-medium">
              <p>Target: {lang === 'th' ? 'วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์' : 'Computer Engineering, Kasetsart University'}</p>
              <p className="mt-3 md:mt-0">© 2026 Sangsan Wongmoon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

