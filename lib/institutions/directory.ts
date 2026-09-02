import { schemes } from '@/data/schemes'
import type { Scheme } from '@/lib/matching/types'

/**
 * "Who actually administers this scheme" directory — derived entirely
 * from data/schemes.ts (ministry + officialUrl), never a separately
 * typed-in dataset. That keeps it automatically consistent with the
 * scheme data and impossible to drift out of sync.
 *
 * Per-scheme officialUrls are unique across the current 13-scheme
 * dataset, so grouping by officialUrl gives one directory entry per
 * distinct implementing body — safer than grouping by the `ministry`
 * string alone, which sometimes names a shared parent ministry for
 * schemes actually run by different corporations under it (e.g. NSTFDC
 * and NSKFDC both ultimately sit under different ministries but are
 * distinct standalone corporations with their own portals).
 */
export interface Institution {
  /** Short display name of the specific administering body. */
  name: string
  /** The scheme's own `ministry` field, shown as secondary context when it differs from `name`. */
  parentMinistry?: string
  officialUrl: string
  schemes: Scheme[]
}

// Sourced, one-off overrides for the handful of schemes where the clean
// "who actually runs this" short name isn't just the `ministry` field
// verbatim — each was confirmed against the scheme's own officialUrl or
// its own name during this pass (see the Aug 2026 scheme-link
// verification: kswdc.karnataka.gov.in confirmed the Udyogini
// implementer; the others are literally spelled out in the scheme's own
// `ministry` "(via X)" text or in its `name`, expanded here to their
// full institution name for the directory).
const NAME_OVERRIDES: Record<string, string> = {
  'karnataka-udyogini': "Karnataka State Women's Development Corporation (KSWDC)",
  'nstfdc-term-loan': 'National Scheduled Tribes Finance & Development Corporation (NSTFDC)',
  nskfdc: 'National Safai Karamcharis Finance & Development Corporation (NSKFDC)',
  'mudra-tarun': 'Micro Units Development & Refinance Agency Ltd. (MUDRA)',
  pmegp: 'Khadi and Village Industries Commission (KVIC)',
  'mahila-udyam-nidhi': 'Small Industries Development Bank of India (SIDBI)',
  'vcf-sc': 'IFCI Venture Capital Funds Ltd. (IFCI Venture)',
}

function deriveName(scheme: Scheme): string {
  return NAME_OVERRIDES[scheme.id] ?? scheme.ministry ?? scheme.name
}

/** Institutions whose derived name differs from their `ministry` field enough to show both. */
function deriveParentMinistry(scheme: Scheme, name: string): string | undefined {
  return scheme.ministry && scheme.ministry !== name ? scheme.ministry : undefined
}

export function getInstitutionDirectory(): Institution[] {
  const byUrl = new Map<string, Institution>()
  for (const scheme of schemes) {
    if (!scheme.officialUrl) continue
    const existing = byUrl.get(scheme.officialUrl)
    if (existing) {
      existing.schemes.push(scheme)
      continue
    }
    const name = deriveName(scheme)
    byUrl.set(scheme.officialUrl, {
      name,
      parentMinistry: deriveParentMinistry(scheme, name),
      officialUrl: scheme.officialUrl,
      schemes: [scheme],
    })
  }
  return Array.from(byUrl.values()).sort((a, b) => a.name.localeCompare(b.name))
}

/** The single directory entry for one scheme id, if it has an officialUrl. */
export function getInstitutionForScheme(schemeId: string): Institution | undefined {
  const scheme = schemes.find((s) => s.id === schemeId)
  if (!scheme?.officialUrl) return undefined
  return getInstitutionDirectory().find((inst) => inst.officialUrl === scheme.officialUrl)
}
