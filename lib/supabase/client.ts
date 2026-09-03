// Supabase is a PROGRESSIVE ENHANCEMENT layered on top of this app's
// existing offline-first design — never a replacement for it. Every
// consumer of this client (lib/schemes/live-schemes.tsx,
// lib/supabase/sync.ts) already has a working static/localStorage path
// and only ever upgrades to Supabase opportunistically, silently
// falling back to that existing path on any failure (missing env vars,
// no network, RLS error, timeout, whatever). See lib/schemes/live-
// schemes.tsx's doc comment for the read side and lib/supabase/sync.ts
// for the write side.
//
// getSupabaseClient() is a LAZY, DYNAMIC import of @supabase/
// supabase-js (~60KB) rather than a static top-level one, on purpose:
// this app already did a dedicated pass to cut its initial JS payload
// ~35-40% for its low-bandwidth/budget-phone audience (see
// lib/i18n/translations.ts's locale-splitting), and a static import
// here would silently undo a chunk of that for every visitor —
// including ones who are fully offline and never touch Supabase at
// all. Dynamically importing means the SDK is only ever fetched, as
// its own separate chunk, after a page has already rendered and
// hydrated (from inside a useEffect/async call), never as part of any
// route's initial/First Load JS.
//
// Resolves to null (never throws) when NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY aren't configured — a build/deploy
// with no Supabase env vars set behaves identically to the pure
// offline app, and never even fetches the SDK chunk at all.

import type { SupabaseClient } from '@supabase/supabase-js'

let cached: Promise<SupabaseClient | null> | undefined

export function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    cached = Promise.resolve(null)
    return cached
  }

  cached = import('@supabase/supabase-js')
    .then(({ createClient }) =>
      createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    )
    .catch(() => null)

  return cached
}
