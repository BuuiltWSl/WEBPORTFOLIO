'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../providers'

export function Navbar() {
  const [active, setActive] = useState('main')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { lang, toggleLang } = useLanguage()

  const navItems = useMemo(
    () => [
      { id: 'main', label: lang === 'th' ? 'หน้าแรก' : 'Main' },
      { id: 'about', label: lang === 'th' ? 'เกี่ยวกับผม' : 'About' },
      { id: 'computer', label: lang === 'th' ? 'ผลงานคอม' : 'Computer Projects' },
      { id: 'scimath', label: lang === 'th' ? 'วิทย์-คณิต' : 'Sci-Math' },
      { id: 'camp', label: lang === 'th' ? 'ค่าย' : 'Camp & Other' },
      { id: 'reviews', label: lang === 'th' ? 'รีวิว' : 'Reviews' },
      { id: 'built', label: 'Built' },
    ],
    [lang],
  )

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = navItems.map((n) => document.getElementById(n.id))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i]
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(navItems[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [navItems])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-indigo-500/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="#main"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold tracking-tight gradient-text"
        >
          Dev.bu1ltwsl
        </motion.a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <a
                href={`#${item.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === item.id
                    ? 'bg-indigo-500/10 text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-500 hover:bg-slate-100/80'
                }`}
              >
                {item.label}
              </a>
            </motion.li>
          ))}
          <li>
            <button
              onClick={toggleLang}
              className="ml-2 px-3 py-2 rounded-full text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              {lang === 'th' ? 'EN' : 'TH'}
            </button>
          </li>
          <li>
            <a
              href="/admin"
              className="px-4 py-2 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors"
            >
              Admin
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-slate-700 block rounded-full"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-slate-700 block rounded-full"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-slate-700 block rounded-full"
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active === item.id
                        ? 'bg-indigo-500/10 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={toggleLang}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50"
                >
                  {lang === 'th' ? 'English' : 'ไทย'}
                </button>
                <a
                  href="/admin"
                  className="px-4 py-3 rounded-xl text-sm font-bold text-center text-white bg-slate-900"
                >
                  Admin
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
