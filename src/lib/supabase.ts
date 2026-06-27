import { createClient } from '@supabase/supabase-js'

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
