// Standalone verification for the matching engine — no test framework
// required yet. Run with `npm run verify:engine`.
//
// This is how we "verify before claiming it works" per the delivery
// rules: it exercises the engine against the 3 demo profiles and the
// full scheme dataset, and sanity-checks structural invariants.

import { evaluateScheme, matchSchemes } from '../lib/matching/engine'
import type { Scheme } from '../lib/matching/types'
import { schemes } from '../data/schemes'
import { demoProfiles } from '../data/demoProfiles'
import { TOTAL_WEIGHT } from '../lib/matching/weights'

let failures = 0

function assert(condition: boolean, message: string) {
  if (!condition) {
    failures++
    console.error(`  ✗ ${message}`)
  } else {
    console.log(`  ✓ ${message}`)
  }
}

console.log(`Dataset: ${schemes.length} schemes, all isDemo=false: ${schemes.every((s) => !s.isDemo)}`)
console.log(`Every real scheme has an officialUrl: ${schemes.every((s) => s.isDemo || !!s.officialUrl)}`)
console.log(`TOTAL_WEIGHT = ${TOTAL_WEIGHT} (should be 100)\n`)

for (const demo of demoProfiles) {
  console.log(`\n=== ${demo.label} (${demo.id}) ===`)
  const results = matchSchemes(demo.profile, schemes)

  assert(results.length === schemes.length, 'engine returns a result for every scheme (never silently drops one)')

  const sorted = results.every((r, i) => i === 0 || results[i - 1].matchScore >= r.matchScore)
  assert(sorted, 'results are sorted by matchScore descending')

  const scoresInRange = results.every((r) => r.matchScore >= 0 && r.matchScore <= 100)
  assert(scoresInRange, 'every matchScore is within 0-100')

  const criteriaAccountedFor = results.every(
    (r) =>
      r.matchedCriteria.length + r.missingCriteria.length + r.failedCriteria.length === 7 // 7 evaluated criteria
  )
  assert(criteriaAccountedFor, 'every scheme has exactly 7 criteria accounted for (matched+missing+failed)')

  const HARD_FAIL_KEYS = new Set(['category', 'gender', 'state', 'firstTime', 'income'])
  const lowMatchHasFailReason = results
    .filter((r) => r.failedCriteria.some((c) => HARD_FAIL_KEYS.has(c.key)))
    .every((r) => r.eligibilityStatus === 'Low Match')
  assert(lowMatchHasFailReason, 'any scheme with a failed hard-criterion (category/gender/state/firstTime/income) is labelled "Low Match"')

  console.log('\nTop 3 recommendations:')
  for (const r of results.slice(0, 3)) {
    console.log(`  - ${r.scheme.name}`)
    console.log(`      matchScore: ${r.matchScore}  status: ${r.eligibilityStatus}`)
    console.log(`      matched:  ${r.matchedCriteria.map((c) => c.label).join(' | ')}`)
    if (r.missingCriteria.length) console.log(`      missing:  ${r.missingCriteria.map((c) => c.label).join(' | ')}`)
    if (r.failedCriteria.length) console.log(`      failed:   ${r.failedCriteria.map((c) => c.label).join(' | ')}`)
  }
}

// Sanity check (informational, not a strict requirement): which of the
// 4 eligibility statuses actually occur across the demo profiles.
const allStatuses = new Set<string>()
for (const demo of demoProfiles) {
  for (const r of matchSchemes(demo.profile, schemes)) allStatuses.add(r.eligibilityStatus)
}
console.log('\nStatuses observed across the 3 demo profiles:', [...allStatuses].join(', '))
console.log(
  '(none of the bundled demo profiles happen to leave income blank against an unrestricted,\n' +
    ' income-capped scheme, so "Insufficient Information" never appears above — verified directly below instead.)'
)

// Direct check: "Insufficient Information" is reachable in principle.
// (It requires income left blank against a scheme that caps income but
// is otherwise unrestricted — none of the 3 demo profiles hit this
// combination, since every income-capped scheme in the dataset also
// restricts by category/gender/first-time.)
console.log('\n=== Direct check: Insufficient Information path ===')
const syntheticScheme: Scheme = {
  id: 'synthetic-income-capped',
  name: 'Synthetic income-capped scheme (test fixture, not real)',
  isDemo: true,
  categories: ['Any'],
  genders: ['Any'],
  states: ['All'],
  sectors: ['Any'],
  stages: ['Any'],
  firstTimeOnly: false,
  maxIncomeLakh: 3,
  benefit: 'n/a',
  summary: 'n/a',
  officialUrl: null,
}
const syntheticResult = evaluateScheme(
  { category: 'General', gender: 'Man', state: 'Delhi', sector: 'Services', stage: 'Early', firstTimeEntrepreneur: false, annualIncomeRange: '' },
  syntheticScheme
)
console.log(`  status: ${syntheticResult.eligibilityStatus} (score ${syntheticResult.matchScore})`)
assert(
  syntheticResult.eligibilityStatus === 'Insufficient Information',
  '"Insufficient Information" is produced when income is unknown against an otherwise-open, income-capped scheme'
)

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
