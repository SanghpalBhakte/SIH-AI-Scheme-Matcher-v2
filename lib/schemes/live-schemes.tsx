'use client'

// The scheme catalog's read path — offline-first, Supabase layered on
// top as a progressive enhancement, never a hard dependency:
//
//  - Server render and every client's FIRST paint always use the
//    bundled `schemes` from data/schemes.ts (imported below), exactly
//    as every page did before this feature. No hydration risk: server
//    and first client render produce identical output, same as
//    everything else in this app that follows the isHydrated-safe
//    pattern (see lib/assessment/assessment-context.tsx) — except this
//    needs no "hydrated" flag at all, since the static default isn't a
//    placeholder waiting to be replaced with the "real" value the way
//    an empty localStorage read is; it's a genuinely complete, correct
//    dataset on its own.
//  - AFTER mount, a one-shot effect tries to fetch the live `schemes`
//    table from Supabase. On success (and only if the response is a
//    non-empty, well-formed array of scheme-shaped rows), the app
//    upgrades to that live data for the rest of the session. On ANY
//    failure — Supabase unconfigured, offline, RLS error, malformed
//    response, timeout — it silently keeps the bundled static data.
//    There is no loading spinner and no error state for this: the
//    static data is never "wrong," just potentially one deploy behind
//    whatever's been edited directly in Supabase since.
//
// The matching engine (lib/matching/engine.ts) never imports schemes
// itself — every call site passes it a scheme/scheme-array explicitly
// — so swapping the source here changes zero scoring/ranking logic,
// only which array of otherwise-identical-shaped Scheme objects that
// logic runs against.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { schemes as staticSchemes } from '@/data/schemes'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Scheme } from '@/lib/matching/types'

export type SchemesSource = 'static' | 'live'

interface SchemesContextValue {
  schemes: Scheme[]
  source: SchemesSource
}

const SchemesContext = createContext<SchemesContextValue>({ schemes: staticSchemes, source: 'static' })

// Defensive, not exhaustive: just enough to reject an obviously
// malformed or empty response before ever swapping away from the
// known-good static dataset. Never used to "fix" or coerce a
// half-valid row — a row that fails this is treated the same as a
// network failure (keep the static data).
function isSchemeArray(value: unknown): value is Scheme[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((s) => s && typeof s === 'object' && typeof (s as { id?: unknown }).id === 'string' && typeof (s as { name?: unknown }).name === 'string')
  )
}

export function SchemesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SchemesContextValue>({ schemes: staticSchemes, source: 'static' })

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const client = await getSupabaseClient()
        if (!client || cancelled) return
        const { data, error } = await client.from('schemes').select('data')
        if (cancelled || error || !data) return
        const rows = data.map((row: { data: unknown }) => row.data)
        if (isSchemeArray(rows)) {
          setState({ schemes: rows, source: 'live' })
        }
      } catch {
        // network error, timeout, unreachable project, or Supabase unconfigured — keep static data
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return <SchemesContext.Provider value={state}>{children}</SchemesContext.Provider>
}

/** The scheme catalog to render — live Supabase data once it's loaded, the bundled static dataset until then or if it never does. */
export function useSchemes(): Scheme[] {
  return useContext(SchemesContext).schemes
}

/** For diagnostics/debugging only — never branch app behavior on this. */
export function useSchemesSource(): SchemesSource {
  return useContext(SchemesContext).source
}
