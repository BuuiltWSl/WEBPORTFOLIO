'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import type { Lang } from '../lib/portfolio'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('th')

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((current) => (current === 'th' ? 'en' : 'th')),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside Providers')
  return value
}

