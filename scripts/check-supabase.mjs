import fs from 'node:fs'

const envFile = ['.env.local', '.env.production', '.env'].find((file) => fs.existsSync(file))

if (!envFile) {
  console.error('No env file found. Create .env.local from .env.example.')
  process.exit(1)
}

const env = Object.fromEntries(
  fs
    .readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index), line.slice(index + 1)]
    }),
)

const url = (env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  process.exit(1)
}

let host = ''
try {
  host = new URL(url).host
} catch {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not a valid URL.')
  process.exit(1)
}

if (host === 'supabase.com') {
  console.error('NEXT_PUBLIC_SUPABASE_URL points to the Supabase dashboard. Use https://PROJECT_REF.supabase.co')
  process.exit(1)
}

const requiredTables = ['about_me', 'projects', 'project_media', 'reviews', 'profiles']
let failed = false

for (const table of requiredTables) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
    },
  })

  if (response.ok) {
    console.log(`ok ${table}`)
    continue
  }

  failed = true
  const message = await response.text()
  console.error(`missing/bad ${table}: ${message}`)
}

if (failed) {
  console.error('Run supabase/schema.sql in Supabase SQL Editor, then run npm run check:supabase again.')
  process.exit(1)
}

console.log('Supabase setup ok.')

