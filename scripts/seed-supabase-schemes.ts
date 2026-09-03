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

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error('Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.')
    process.exit(1)
  }

  const client = createClient(url, serviceKey)

  console.log(`Flushing public.schemes and reseeding ${schemes.length} schemes...`)

  const { error: deleteError } = await client.from('schemes').delete().neq('id', '')
  if (deleteError) {
    console.error('Failed to flush existing rows:', deleteError.message)
    process.exit(1)
  }

  const rows = schemes.map((scheme) => ({ id: scheme.id, data: scheme, updated_at: new Date().toISOString() }))
  const { error: insertError } = await client.from('schemes').insert(rows)
  if (insertError) {
    console.error('Failed to seed schemes:', insertError.message)
    process.exit(1)
  }

  console.log(`Done. public.schemes now has ${schemes.length} rows, byte-identical to data/schemes.ts.`)
}

main()
