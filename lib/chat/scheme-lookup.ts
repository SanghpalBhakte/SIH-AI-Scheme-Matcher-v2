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
 * null when nothing scores above the minimum threshold — callers treat
 * that as "no scheme detected," never as a guess.
 */
export function detectSchemeName(input: string, schemes: Scheme[]): Scheme | null {
  const tokens = new Set(normalize(input).split(' ').filter(Boolean))
  let best: Scheme | null = null
  let bestScore = 0

  for (const scheme of schemes) {
    const nameWords = normalize(scheme.name)
      .split(' ')
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
    const idWords = normalize(scheme.id.replace(/-/g, ' '))
      .split(' ')
      .filter((w) => w.length >= 3)

    const nameOverlap = nameWords.filter((w) => tokens.has(w)).length
    // id tokens (e.g. "pmegp", "svanidhi", "vishwakarma") are usually
    // more distinctive than name words, so they're weighted higher.
    const idOverlap = idWords.filter((w) => tokens.has(w)).length
    const score = nameOverlap + idOverlap * 1.5

    if (score > bestScore) {
      bestScore = score
      best = scheme
    }
  }

  return bestScore >= 1 ? best : null
}

const PRONOUN_REFERENCE = /\b(this scheme|that scheme|this one|the scheme|it|this|that)\b/i

/** True when the message refers back to a scheme without naming one. */
export function referencesActiveScheme(input: string): boolean {
  return PRONOUN_REFERENCE.test(input)
}
