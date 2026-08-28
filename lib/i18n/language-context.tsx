'use client'

// Language selection, mirroring the same isHydrated-safe pattern used by
// lib/theme/theme-context.tsx and lib/assessment/assessment-context.tsx:
// server render and the client's first paint always show the default
// locale (no hydration mismatch), then a useEffect restores a stored
// preference a moment later. See lib/i18n/translations.ts for what is and
// isn't translated, and why.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_LOCALE, LOCALES, translations, type Locale } from './translations'

const VALID_LOCALES = new Set<string>(LOCALES.map((l) => l.code))

const STORAGE_KEY = 'sih26092.locale'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Translate a key, with optional {placeholder} interpolation. Falls back to the English string, then to the key itself, so a missing translation never renders blank. */
  t: (key: string, vars?: Record<string, string | number>) => string
  isHydrated: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored && VALID_LOCALES.has(stored)) {
        setLocaleState(stored as Locale)
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — silently keep the default.
    }
    setIsHydrated(true)
  }, [])

  const value = useMemo<LanguageContextValue>(() => {
    const dict = translations[locale]
    const fallback = translations[DEFAULT_LOCALE]
    return {
      locale,
      setLocale: (next) => {
        setLocaleState(next)
        try {
          window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
          // Non-fatal: the choice just won't persist across visits.
        }
      },
      t: (key, vars) => interpolate(dict[key] ?? fallback[key] ?? key, vars),
      isHydrated,
    }
  }, [locale, isHydrated])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage() must be used within a <LanguageProvider>')
  }
  return ctx
}
