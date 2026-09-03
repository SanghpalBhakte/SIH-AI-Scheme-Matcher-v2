'use client'

// Bookmark/save-for-later state for schemes — deliberately independent of
// AssessmentContext (a saved scheme should survive "Start over" on the
// assessment) and of the matching engine (saving is just "I want to find
// this again," not a scoring input). Mirrors the same isHydrated-safe
// localStorage pattern as lib/assessment/assessment-context.tsx: server
// render and the client's first paint always show an empty saved list, a
// useEffect restores the real stored list a moment later.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { syncSavedSchemes } from '@/lib/supabase/sync'

const STORAGE_KEY = 'sih26092.savedSchemes'

function loadSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return []
  }
}

function persistSavedIds(ids: string[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // storage full/unavailable — saving is a nice-to-have, never fatal
  }
  // Best-effort mirror to Supabase — never awaited, localStorage above
  // remains what the UI actually reads from either way.
  syncSavedSchemes(ids).catch(() => {})
}

interface SavedSchemesContextValue {
  savedIds: string[]
  isSaved: (schemeId: string) => boolean
  toggleSaved: (schemeId: string) => void
  isHydrated: boolean
}

const SavedSchemesContext = createContext<SavedSchemesContextValue | null>(null)

export function SavedSchemesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setSavedIds(loadSavedIds())
    setIsHydrated(true)
  }, [])

  const value = useMemo<SavedSchemesContextValue>(
    () => ({
      savedIds,
      isSaved: (schemeId) => savedIds.includes(schemeId),
      toggleSaved: (schemeId) => {
        setSavedIds((prev) => {
          const next = prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
          persistSavedIds(next)
          return next
        })
      },
      isHydrated,
    }),
    [savedIds, isHydrated]
  )

  return <SavedSchemesContext.Provider value={value}>{children}</SavedSchemesContext.Provider>
}

export function useSavedSchemes() {
  const ctx = useContext(SavedSchemesContext)
  if (!ctx) {
    throw new Error('useSavedSchemes() must be used within a <SavedSchemesProvider>')
  }
  return ctx
}
