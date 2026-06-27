'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { appPath, supabase } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Finishing login...')

  useEffect(() => {
    async function finishLogin() {
      if (!supabase) {
        setMessage('Supabase env missing.')
        return
      }

      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const next = params.get('next')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setMessage(error.message)
          return
        }
      } else {
        await supabase.auth.getSession()
      }

      const safeNext = next?.startsWith('/') ? next : '/admin'

      setMessage('Login done. Going next...')
      window.location.href = appPath(safeNext)
    }

    finishLogin()
  }, [])

  return (
    <main className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-6">
      <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl shadow-indigo-500/10 text-center">
        <h1 className="text-2xl font-extrabold text-slate-800">Auth Callback</h1>
        <p className="mt-3 text-slate-500">{message}</p>
        <Link href={appPath('/')} className="mt-6 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
          Back Home
        </Link>
      </div>
    </main>
  )
}
