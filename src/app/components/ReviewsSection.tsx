'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { supabase, siteUrl } from '../../lib/supabase'
import type { Review } from '../../lib/portfolio'
import { useLanguage } from '../providers'

export function ReviewsSection({ reviews: initialReviews }: { reviews: Review[] }) {
  const { lang } = useLanguage()
  const [session, setSession] = useState<Session | null>(null)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => data.subscription.unsubscribe()
  }, [])

  async function signInWithGoogle() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent('/#reviews')}` },
    })
  }

  async function submitReview(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase || !session?.user || !message.trim()) return

    const user = session.user
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      author_name: user.user_metadata?.full_name || user.email || 'Guest',
      author_email: user.email,
      rating,
      message: message.trim(),
      status: 'pending',
    })

    if (error) {
      setStatus(lang === 'th' ? 'ส่งไม่ได้ ตรวจ Supabase policy' : 'Could not submit. Check Supabase policy.')
      return
    }

    setMessage('')
    setRating(5)
    setStatus(lang === 'th' ? 'ส่งแล้ว รอ approve' : 'Submitted. Waiting for approval.')
  }

  return (
    <section id="reviews" className="py-24 bg-white/70">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-500">Reviews</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
                {lang === 'th' ? 'รีวิวจากคนที่เข้ามาดู' : 'Visitor Reviews'}
              </h2>
              <p className="mt-4 text-slate-500">
                {lang === 'th' ? 'รีวิวจะขึ้นหน้าเว็บหลัง admin approve แล้ว' : 'Reviews appear after admin approval.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {initialReviews.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-400">
                  {lang === 'th' ? 'ยังไม่มีรีวิวที่ approve' : 'No approved reviews yet.'}
                </div>
              )}
              {initialReviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-800">{review.author_name}</h3>
                    <span className="text-amber-500 text-sm">{'★'.repeat(review.rating || 5)}</span>
                  </div>
                  <p className="mt-3 text-slate-500 leading-relaxed">{review.message}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={submitReview}
            className="rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/70 p-7 shadow-xl shadow-indigo-500/5 h-fit"
          >
            <h3 className="text-xl font-extrabold text-slate-800">
              {lang === 'th' ? 'เขียนรีวิว' : 'Write a Review'}
            </h3>
            {!supabase && (
              <p className="mt-4 text-sm text-amber-600">
                {lang === 'th' ? 'ยังไม่ได้ตั้งค่า Supabase' : 'Supabase is not configured.'}
              </p>
            )}
            {!session ? (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-colors"
              >
                {lang === 'th' ? 'Login ด้วย Google เพื่อรีวิว' : 'Login with Google to review'}
              </button>
            ) : (
              <>
                <label className="mt-5 block text-sm font-bold text-slate-600">
                  {lang === 'th' ? 'คะแนน' : 'Rating'}
                </label>
                <select
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <label className="mt-4 block text-sm font-bold text-slate-600">
                  {lang === 'th' ? 'ข้อความ' : 'Message'}
                </label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="mt-2 min-h-36 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
                  placeholder={lang === 'th' ? 'เขียนรีวิวสั้น ๆ ได้เลย' : 'Write a short review'}
                />
                <button className="mt-4 w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                  {lang === 'th' ? 'ส่งให้ admin approve' : 'Submit for approval'}
                </button>
              </>
            )}
            {status && <p className="mt-4 text-sm font-semibold text-indigo-600">{status}</p>}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
