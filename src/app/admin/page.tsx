'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, Check, Eye, LogOut, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { adminEmail, appPath, publicUrl, sessionFromUrl, supabase } from '../../lib/supabase'
import type { AboutMe, PortfolioCategory, PortfolioProject, Review } from '../../lib/portfolio'

const emptyProject: Omit<PortfolioProject, 'id' | 'sort_order' | 'is_featured' | 'is_visible'> & {
  id?: string
  sort_order?: number
  is_featured?: boolean
  is_visible?: boolean
} = {
  category: 'computer',
  title_th: '',
  title_en: '',
  subtitle_th: '',
  subtitle_en: '',
  details_th: '',
  details_en: '',
  tags: [],
  technologies: [],
  achievement_th: '',
  achievement_en: '',
  github_url: '',
  demo_url: '',
  project_date: '',
}

function toList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function fromList(value?: string[] | null) {
  return (value || []).join(', ')
}

type Tab = 'projects' | 'about' | 'reviews'

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [authMessage, setAuthMessage] = useState('')
  const [tab, setTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [about, setAbout] = useState<AboutMe>({
    id: 1,
    title_th: 'About Me',
    title_en: 'About Me',
    body_th: '',
    body_en: '',
  })
  const [form, setForm] = useState({ ...emptyProject })
  const [tagsText, setTagsText] = useState('')
  const [techText, setTechText] = useState('')
  const [status, setStatus] = useState('')

  const isAdmin = useMemo(() => session?.user.email?.toLowerCase() === adminEmail.toLowerCase(), [session])

  useEffect(() => {
    if (!supabase) return
    sessionFromUrl().then((nextSession) => setSession(nextSession))
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) loadAdminData()
  }, [session])

  async function signInWithGoogle() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: publicUrl('/admin') },
    })
  }

  async function handleEmailAuth(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return

    const action =
      authMode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { error } = await action
    setAuthMessage(error ? error.message : authMode === 'signin' ? 'Login done.' : 'Account created. Check email if confirmation is on.')
  }

  async function signOut() {
    await supabase?.auth.signOut()
    setSession(null)
  }

  async function loadAdminData() {
    if (!supabase) return
    const [{ data: projectRows }, { data: reviewRows }, { data: aboutRow }] = await Promise.all([
      supabase.from('projects').select('*, project_media(*)').order('sort_order', { ascending: true }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('about_me').select('*').eq('id', 1).maybeSingle(),
    ])

    if (projectRows) setProjects(projectRows as PortfolioProject[])
    if (reviewRows) setReviews(reviewRows as Review[])
    if (aboutRow) setAbout(aboutRow as AboutMe)
  }

  function editProject(project: PortfolioProject) {
    setForm({
      ...project,
      project_date: project.project_date || '',
    })
    setTagsText(fromList(project.tags))
    setTechText(fromList(project.technologies))
    setTab('projects')
  }

  function resetForm() {
    setForm({ ...emptyProject })
    setTagsText('')
    setTechText('')
  }

  async function saveProject(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return

    const payload = {
      category: form.category,
      title_th: form.title_th,
      title_en: form.title_en || null,
      subtitle_th: form.subtitle_th || null,
      subtitle_en: form.subtitle_en || null,
      details_th: form.details_th || null,
      details_en: form.details_en || null,
      tags: toList(tagsText),
      technologies: toList(techText),
      achievement_th: form.achievement_th || null,
      achievement_en: form.achievement_en || null,
      github_url: form.github_url || null,
      demo_url: form.demo_url || null,
      project_date: form.project_date || null,
      sort_order: form.sort_order || 100,
      is_featured: Boolean(form.is_featured),
      is_visible: form.is_visible !== false,
    }

    const query = form.id
      ? supabase.from('projects').update(payload).eq('id', form.id).select().single()
      : supabase.from('projects').insert(payload).select().single()

    const { data, error } = await query
    if (error) {
      setStatus(error.message)
      return
    }

    setStatus('Saved.')
    if (data) setForm((current) => ({ ...current, id: data.id }))
    await loadAdminData()
  }

  async function deleteProject(id: string) {
    if (!supabase || !confirm('Delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    setStatus(error ? error.message : 'Deleted.')
    await loadAdminData()
  }

  async function uploadFiles(kind: 'image' | 'certificate', files: FileList | null) {
    if (!supabase || !form.id || !files?.length) {
      setStatus('Save project first.')
      return
    }

    const bucket = kind === 'image' ? 'project-images' : 'certificates'
    for (const file of Array.from(files)) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${form.id}/${Date.now()}-${safeName}`
      const upload = await supabase.storage.from(bucket).upload(path, file)
      if (upload.error) {
        setStatus(upload.error.message)
        return
      }

      const media = await supabase.from('project_media').insert({
        project_id: form.id,
        kind,
        bucket,
        path,
        sort_order: 100,
      })

      if (media.error) {
        setStatus(media.error.message)
        return
      }
    }

    setStatus('Uploaded.')
    await loadAdminData()
  }

  async function saveAbout() {
    if (!supabase) return
    const { error } = await supabase.from('about_me').upsert(about)
    setStatus(error ? error.message : 'About saved.')
  }

  async function updateReview(id: string, status: Review['status']) {
    if (!supabase) return
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
    setStatus(error ? error.message : 'Review updated.')
    await loadAdminData()
  }

  async function deleteReview(id: string) {
    if (!supabase || !confirm('Delete review?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    setStatus(error ? error.message : 'Review deleted.')
    await loadAdminData()
  }

  if (!supabase) {
    return (
      <AdminShell>
        <div className="rounded-[2rem] bg-white border border-amber-100 p-8 text-amber-700">
          Supabase env missing. Fill `.env.local` from `.env.example`.
        </div>
      </AdminShell>
    )
  }

  if (!session) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-[2rem] bg-white border border-slate-100 p-8 shadow-xl shadow-indigo-500/10">
          <h1 className="text-3xl font-extrabold text-slate-800">Admin Login</h1>
          <p className="mt-2 text-slate-500">Use admin email or Google.</p>
          <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="admin-input" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="admin-input" />
            <button className="admin-button w-full">{authMode === 'signin' ? 'Sign in' : 'Create account'}</button>
          </form>
          <button onClick={signInWithGoogle} className="mt-3 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-600">
            Continue with Google
          </button>
          <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} className="mt-4 text-sm font-bold text-indigo-600">
            {authMode === 'signin' ? 'Need account?' : 'Already have account?'}
          </button>
          {authMessage && <p className="mt-4 text-sm text-slate-500">{authMessage}</p>}
        </div>
      </AdminShell>
    )
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="rounded-[2rem] bg-white border border-red-100 p-8 text-red-600">
          This account not admin: {session.user.email}
          <button onClick={signOut} className="mt-5 block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            Sign out
          </button>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-500">Admin</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Portfolio Control</h1>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(['projects', 'about', 'reviews'] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-full px-5 py-2 text-sm font-bold ${tab === item ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-100'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {status && <div className="mt-5 rounded-2xl bg-indigo-50 border border-indigo-100 px-5 py-3 text-sm font-bold text-indigo-700">{status}</div>}

      {tab === 'projects' && (
        <div className="mt-8 grid xl:grid-cols-[0.9fr_1.1fr] gap-6">
          <form onSubmit={saveProject} className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-xl shadow-indigo-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-800">{form.id ? 'Edit Project' : 'Add Project'}</h2>
              <button type="button" onClick={resetForm} className="rounded-full bg-slate-100 p-2 text-slate-500"><Plus size={16} /></button>
            </div>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PortfolioCategory })} className="admin-input">
              <option value="computer">Computer Projects</option>
              <option value="scimath">Sci-Math</option>
              <option value="camp">Camp & Other</option>
              <option value="about">About Me</option>
            </select>
            <input value={form.title_th} onChange={(e) => setForm({ ...form, title_th: e.target.value })} placeholder="ชื่อ TH" className="admin-input" required />
            <input value={form.title_en || ''} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Title EN" className="admin-input" />
            <input value={form.subtitle_th || ''} onChange={(e) => setForm({ ...form, subtitle_th: e.target.value })} placeholder="Subtitle TH" className="admin-input" />
            <input value={form.subtitle_en || ''} onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })} placeholder="Subtitle EN" className="admin-input" />
            <textarea value={form.details_th || ''} onChange={(e) => setForm({ ...form, details_th: e.target.value })} placeholder="รายละเอียด TH" className="admin-input min-h-28" />
            <textarea value={form.details_en || ''} onChange={(e) => setForm({ ...form, details_en: e.target.value })} placeholder="Details EN" className="admin-input min-h-28" />
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="tags คั่นด้วย comma" className="admin-input" />
            <input value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="technologies คั่นด้วย comma" className="admin-input" />
            <input value={form.achievement_th || ''} onChange={(e) => setForm({ ...form, achievement_th: e.target.value })} placeholder="รางวัล TH" className="admin-input" />
            <input value={form.achievement_en || ''} onChange={(e) => setForm({ ...form, achievement_en: e.target.value })} placeholder="Achievement EN" className="admin-input" />
            <input value={form.github_url || ''} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="GitHub URL" className="admin-input" />
            <input value={form.demo_url || ''} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} placeholder="Demo URL" className="admin-input" />
            <input value={form.project_date || ''} onChange={(e) => setForm({ ...form, project_date: e.target.value })} type="date" className="admin-input" />
            <input value={form.sort_order || 100} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} type="number" className="admin-input" />
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <input type="checkbox" checked={form.is_visible !== false} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
              Visible
            </label>
            <button className="admin-button w-full inline-flex items-center justify-center gap-2"><Save size={16} /> Save Project</button>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <label className="admin-upload">
                <Upload size={16} /> Upload images
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadFiles('image', e.target.files)} />
              </label>
              <label className="admin-upload">
                <Upload size={16} /> Upload certificates
                <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={(e) => uploadFiles('certificate', e.target.files)} />
              </label>
            </div>
          </form>

          <div className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-xl shadow-indigo-500/5">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-5">Projects</h2>
            <div className="space-y-3 max-h-[900px] overflow-auto pr-2">
              {projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-slate-100 p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-800">{project.title_th}</p>
                    <p className="text-sm text-slate-400">{project.category} · {project.project_media?.length || 0} files</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editProject(project)} className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Eye size={16} /></button>
                    <button onClick={() => deleteProject(project.id)} className="rounded-xl bg-red-50 p-2 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="mt-8 rounded-[2rem] bg-white border border-slate-100 p-6 shadow-xl shadow-indigo-500/5 space-y-4">
          <input value={about.title_th} onChange={(e) => setAbout({ ...about, title_th: e.target.value })} className="admin-input" />
          <input value={about.title_en} onChange={(e) => setAbout({ ...about, title_en: e.target.value })} className="admin-input" />
          <textarea value={about.body_th} onChange={(e) => setAbout({ ...about, body_th: e.target.value })} className="admin-input min-h-48" />
          <textarea value={about.body_en} onChange={(e) => setAbout({ ...about, body_en: e.target.value })} className="admin-input min-h-48" />
          <button onClick={saveAbout} className="admin-button inline-flex items-center gap-2"><Save size={16} /> Save About</button>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="mt-8 rounded-[2rem] bg-white border border-slate-100 p-6 shadow-xl shadow-indigo-500/5">
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-800">{review.author_name}</p>
                    <p className="text-xs text-slate-400">{review.status} · {review.author_email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateReview(review.id, 'approved')} className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><Check size={16} /></button>
                    <button onClick={() => updateReview(review.id, 'rejected')} className="rounded-xl bg-amber-50 p-2 text-amber-600"><X size={16} /></button>
                    <button onClick={() => deleteReview(review.id)} className="rounded-xl bg-red-50 p-2 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="mt-3 text-slate-500">{review.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f8f9fc] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <Link href={appPath('/')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
        {children}
      </div>
    </main>
  )
}
