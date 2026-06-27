'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { appPath, supabase } from '../../../lib/supabase'

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('Finishing login...')

  useEffect(() => {
    async function finishLogin() {
      if (!supabase) {
        setMessage('Supabase env missing.')
        return
      }

      const params = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const code = params.get('code')
      const errorDescription = params.get('error_description') || hashParams.get('error_description')
      const next = params.get('next')
      const safeNext = next?.startsWith('/') ? next : '/admin'
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (errorDescription) {
        setMessage(errorDescription)
        return
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          setMessage(error.message)
          return
        }
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setMessage(`${error.message}. Click Google login again.`)
          return
        }
      }

      for (let attempt = 0; attempt < 12; attempt += 1) {
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          setMessage('Login done. Going next...')
          window.location.replace(appPath(safeNext))
          return
        }

        await wait(150)
      }

      setMessage('Login token came back, but session not saved. Check Supabase URL, anon key, and redirect URL.')
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
