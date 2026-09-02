// Deterministic scheme-name detection: token overlap between the
// user's message and each scheme's name/id. No fuzzy matching library,
// no AI — just normalized word comparison, so the result is always
// explainable and reproducible from (input, schemes).

import type { Scheme } from '@/lib/matching/types'

// Common words that appear in many scheme names and would otherwise
// cause false-positive matches (e.g. "scheme" appears in nearly every
// name, so it can't count as a distinguishing token).
const STOPWORDS = new Set([
  'scheme',
  'schemes',
  'yojana',
  'yojna',
  'programme',
  'program',
  'for',
  'the',
  'of',
  'and',
  'a',
  'an',
  'pm',
  'pradhan',
  'mantri',
  'loan',
  'fund',
  'women',
  'india',
  'ministry',
  'department',
  'via',
  // Added 2026-09-02 audit: confirmed by testing that the general
  // threshold/tie-detection hardening above (see detectSchemeName's
  // doc comment) was NOT enough on its own — "tell me about the
  // startup scheme" still confidently resolved to one specific
  // state-restricted scheme, since "startup" appears in 4+ scheme
  // names/ids in this dataset and none of the others it shares the
  // word with score high enough to force a tie. Narrowly scoped to
  // the two words actually shown to cause this, not a general sweep.
  'startup',
  'startups',
])

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Finds the scheme the user most likely named, by comparing normalized
 * words in their message against each scheme's name and id. Returns
 * null when nothing scores above the minimum threshold, OR when two or
 * more schemes are genuinely ambiguous — callers treat null as "no
 * scheme confidently detected," never as a guess (see askWhichScheme()
 * in lib/chat/engine.ts).
 *
 * Two precision safeguards (added 2026-09-02 audit, after a generic
 * query like "tell me about the startup scheme" was found to
 * confidently resolve to one specific state-restricted scheme even
 * though 4+ schemes in the dataset contain "startup(s)" in their name):
 *  1. nameWords/idWords are Sets, not arrays — a word repeated within
 *     one scheme's own name (e.g. "...Startup Policy... Startup Grant")
 *     no longer scores extra just for appearing twice.
 *  2. The minimum bar to auto-resolve is raised from a single weak
 *     token match (score 1) to score >= 2, and an exact tie for the
 *     top score is treated as ambiguous (null) rather than picking
 *     whichever scheme happens to come first in the array.
 */
export function detectSchemeName(input: string, schemes: Scheme[]): Scheme | null {
  const tokens = new Set(normalize(input).split(' ').filter(Boolean))
  const scored: { scheme: Scheme; score: number }[] = []

  for (const scheme of schemes) {
    const nameWords = new Set(
      normalize(scheme.name)
        .split(' ')
        .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
    )
    const idWords = new Set(
      normalize(scheme.id.replace(/-/g, ' '))
        .split(' ')
        .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
    )

    const nameOverlap = [...nameWords].filter((w) => tokens.has(w)).length
    // id tokens (e.g. "pmegp", "svanidhi", "vishwakarma") are usually
    // more distinctive than name words, so they're weighted higher.
    const idOverlap = [...idWords].filter((w) => tokens.has(w)).length
    const score = nameOverlap + idOverlap * 1.5

    if (score > 0) scored.push({ scheme, score })
  }

  if (scored.length === 0) return null

  scored.sort((a, b) => b.score - a.score)
  const [best, second] = scored

  // Ambiguous: two or more schemes tie for the top score — naming one
  // over the other would be an arbitrary array-order pick, not a real
  // detection. Let the caller ask a clarifying question instead.
  if (second && second.score === best.score) return null

  return best.score >= 2 ? best.scheme : null
}

const PRONOUN_REFERENCE = /\b(this scheme|that scheme|this one|the scheme|it|this|that)\b/i

/** True when the message refers back to a scheme without naming one. */
export function referencesActiveScheme(input: string): boolean {
  return PRONOUN_REFERENCE.test(input)
}
