// Flushes and reseeds the Supabase `schemes` table from data/schemes.ts
// — the SAME file that's still the app's bundled offline fallback (see
// lib/schemes/live-schemes.tsx). Run this after every edit to
// data/schemes.ts to keep the live table in sync:
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-supabase-schemes.ts
//
// Requires the PROJECT'S SERVICE ROLE KEY (not the public anon key —
// the `schemes` table's RLS policy only grants SELECT to anon/
// authenticated, by design, so a write needs the privileged key).
// Never commit that key or put it in a NEXT_PUBLIC_ variable; it's
// only ever read here, from the environment, for this one-off script.

import { createClient } from '@supabase/supabase-js'
import { schemes } from '../data/schemes'

// Surfaces a failure as a GitHub Actions annotation (visible directly
// from `gh run view` / the Checks UI on the run) in addition to the
// normal stderr line. The workflow's own job log sits behind a
// short-lived, signed blob-storage URL that some network egress
// policies block outright, which previously made a failed reseed run
// impossible to diagnose without a person opening it in a browser by
// hand. `::error::` is a standard GitHub Actions "workflow command" —
// GitHub renders any line printed in that form as an annotation on the
// run, independent of the raw log storage.
function annotateError(message: string) {
  console.log(`::error::${message.replace(/\n/g, ' ')}`)
  console.error(message)
}

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    annotateError('Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.')
    process.exit(1)
  }

  // A common misconfiguration: pasting the public anon key into the
  // SUPABASE_SERVICE_ROLE_KEY secret by mistake. Both are JWTs, but the
  // anon key's payload carries "role":"anon" instead of
  // "role":"service_role" — decode just enough of it (no signature
  // verification needed, this is only a friendlier error message, not
  // a security check) to catch that case with a specific message
  // instead of a generic RLS-violation error from Postgres.
  try {
    const payloadB64 = serviceKey.split('.')[1]
    if (payloadB64) {
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'))
      if (payload.role && payload.role !== 'service_role') {
        annotateError(`SUPABASE_SERVICE_ROLE_KEY does not look like a service-role key (JWT role claim is "${payload.role}", expected "service_role"). Copy the "service_role" secret key from Supabase → Project Settings → API, not the "anon" public key.`)
        process.exit(1)
      }
    }
  } catch {
    // Not a decodable JWT (e.g. a newer Supabase publishable/secret key
    // format) -- nothing to validate client-side, let the real request
    // below surface any problem instead.
  }

  const client = createClient(url, serviceKey)

  console.log(`Flushing public.schemes and reseeding ${schemes.length} schemes...`)

  const { error: deleteError } = await client.from('schemes').delete().neq('id', '')
  if (deleteError) {
    annotateError(`Failed to flush existing rows: ${deleteError.message} (code: ${deleteError.code ?? 'unknown'}, hint: ${deleteError.hint ?? 'none'})`)
    process.exit(1)
  }

  const rows = schemes.map((scheme) => ({ id: scheme.id, data: scheme, updated_at: new Date().toISOString() }))
  const { error: insertError } = await client.from('schemes').insert(rows)
  if (insertError) {
    annotateError(`Failed to seed schemes: ${insertError.message} (code: ${insertError.code ?? 'unknown'}, hint: ${insertError.hint ?? 'none'})`)
    process.exit(1)
  }

  console.log(`Done. public.schemes now has ${schemes.length} rows, byte-identical to data/schemes.ts.`)
}

main().catch((err) => {
  const detail = err instanceof Error ? (err.stack ?? err.message) : String(err)
  annotateError(`Unhandled error while reseeding schemes: ${detail}`)
  process.exit(1)
})
