// Resolves a stable per-visitor id for the write-through sync in
// lib/supabase/sync.ts, via Supabase's anonymous auth (no email/phone,
// no password, nothing this audience would need to set up or
// remember). The id is tied to this browser's Supabase session
// storage, same as every other piece of local state in this app — it
// does NOT give cross-device recovery, only a stable identity for this
// browser's own best-effort backups.
//
// Requires "Allow anonymous sign-ins" enabled in the Supabase
// project's Auth settings — see the handoff notes for the exact
// dashboard toggle. Until that's on, signInAnonymously() fails and
// this resolves to null, same as every other "Supabase unreachable"
// case: the app already works fully without it.

import { getSupabaseClient } from './client'

let visitorIdPromise: Promise<string | null> | null = null

/** Never throws. Resolves null whenever Supabase isn't configured, unreachable, or anonymous sign-in isn't enabled. */
export function getVisitorId(): Promise<string | null> {
  if (visitorIdPromise) return visitorIdPromise

  visitorIdPromise = (async () => {
    const client = await getSupabaseClient()
    if (!client) return null

    try {
      const { data: existing } = await client.auth.getSession()
      if (existing.session?.user?.id) return existing.session.user.id

      const { data, error } = await client.auth.signInAnonymously()
      if (error || !data.session) return null
      return data.session.user.id
    } catch {
      return null
    }
  })()

  return visitorIdPromise
}
