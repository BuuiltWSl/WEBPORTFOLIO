import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        flowType: 'implicit',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sangsanwongmoolno.4@gmail.com'
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function appPath(path: string) {
  if (!basePath) return path
  if (path === '/') return basePath
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}

export function publicUrl(path: string) {
  const cleanSiteUrl = siteUrl.replace(/\/$/, '')
  const cleanBasePath = basePath.replace(/\/$/, '')
  const nextPath = appPath(path)

  if (cleanBasePath && cleanSiteUrl.endsWith(cleanBasePath) && nextPath.startsWith(cleanBasePath)) {
    return `${cleanSiteUrl}${nextPath.slice(cleanBasePath.length) || '/'}`
  }

  return `${cleanSiteUrl}${nextPath}`
}

export async function sessionFromUrl(): Promise<Session | null> {
  if (!supabase || typeof window === 'undefined') return null

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (error) return null

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    await ensureUserProfile(data.session)
    return data.session
  }

  const { data } = await supabase.auth.getSession()
  await ensureUserProfile(data.session)
  return data.session
}

export async function ensureUserProfile(session: Session | null) {
  if (!supabase || !session?.user) return null

  const user = session.user
  const email = user.email || ''
  const metadata = user.user_metadata || {}
  const displayName = metadata.full_name || metadata.name || email.split('@')[0] || 'User'
  const avatarUrl = metadata.avatar_url || metadata.picture || null
  const role = email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'user'

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        role,
      },
      { onConflict: 'id' },
    )
    .select()
    .maybeSingle()

  if (error) return null
  return data
}
