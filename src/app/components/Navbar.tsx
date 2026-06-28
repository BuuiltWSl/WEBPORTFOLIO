'use client'

import { useMemo, useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, UserCircle } from 'lucide-react'
import { useLanguage } from '../providers'
import { ensureUserProfile, publicUrl, sessionFromUrl, supabase } from '../../lib/supabase'

export function Navbar() {
  const [active, setActive] = useState('main')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const { lang, toggleLang } = useLanguage()
  const user = session?.user
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

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

  useEffect(() => {
    if (!supabase) return
    sessionFromUrl().then((nextSession) => {
      setSession(nextSession)
      ensureUserProfile(nextSession)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      ensureUserProfile(nextSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: publicUrl('/') },
    })
  }

  async function handleEmailAuth(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return

    setAuthMessage('')
    const action =
      authMode === 'signin'
        ? supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
        : supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
            options: { emailRedirectTo: publicUrl('/') },
          })

    const { data, error } = await action

    if (error) {
      setAuthMessage(error.message)
      return
    }

    if (data.session) {
      await ensureUserProfile(data.session)
      setSession(data.session)
      setAuthOpen(false)
      setAuthPassword('')
      return
    }

    setAuthMessage(authMode === 'signup' ? 'Account created. Check email if confirmation is on.' : 'Check email or password.')
  }

  async function signOut() {
    await supabase?.auth.signOut()
    setSession(null)
    setProfileOpen(false)
  }

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
          <li className="relative ml-2">
            {user ? (
              <>
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm shadow-indigo-500/10"
                  aria-label="User profile"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle size={22} />
                  )}
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-indigo-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-500">
                          {avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : <UserCircle size={26} />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-800">{displayName}</p>
                          <p className="truncate text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={signOut}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-600"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen((open) => !open)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-600"
                >
                  Login
                </button>
                <AnimatePresence>
                  {authOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-indigo-500/10"
                    >
                      <h3 className="text-base font-extrabold text-slate-800">{authMode === 'signin' ? 'Login' : 'Create account'}</h3>
                      <form onSubmit={handleEmailAuth} className="mt-4 space-y-3">
                        <input
                          value={authEmail}
                          onChange={(event) => setAuthEmail(event.target.value)}
                          type="email"
                          placeholder="Email"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                          required
                        />
                        <input
                          value={authPassword}
                          onChange={(event) => setAuthPassword(event.target.value)}
                          type="password"
                          placeholder="Password"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                          required
                        />
                        <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">
                          {authMode === 'signin' ? 'Sign in' : 'Create account'}
                        </button>
                      </form>
                      <button
                        onClick={signInWithGoogle}
                        className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-600"
                      >
                        Continue with Google
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                          setAuthMessage('')
                        }}
                        className="mt-3 text-sm font-bold text-indigo-600"
                      >
                        {authMode === 'signin' ? 'Need account?' : 'Already have account?'}
                      </button>
                      {authMessage && <p className="mt-3 text-sm font-semibold text-amber-600">{authMessage}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
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
              <li className="pt-2">
                <button
                  onClick={toggleLang}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50"
                >
                  {lang === 'th' ? 'English' : 'ไทย'}
                </button>
              </li>
              <li className="pt-2">
                {user ? (
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-500">
                        {avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : <UserCircle size={24} />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-800">{displayName}</p>
                        <p className="truncate text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <h3 className="text-sm font-extrabold text-slate-800">{authMode === 'signin' ? 'Login' : 'Create account'}</h3>
                    <form onSubmit={handleEmailAuth} className="mt-3 space-y-3">
                      <input
                        value={authEmail}
                        onChange={(event) => setAuthEmail(event.target.value)}
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        required
                      />
                      <input
                        value={authPassword}
                        onChange={(event) => setAuthPassword(event.target.value)}
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                        required
                      />
                      <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">
                        {authMode === 'signin' ? 'Sign in' : 'Create account'}
                      </button>
                    </form>
                    <button
                      onClick={signInWithGoogle}
                      className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
                    >
                      Continue with Google
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                        setAuthMessage('')
                      }}
                      className="mt-3 text-sm font-bold text-indigo-600"
                    >
                      {authMode === 'signin' ? 'Need account?' : 'Already have account?'}
                    </button>
                    {authMessage && <p className="mt-3 text-sm font-semibold text-amber-600">{authMessage}</p>}
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
