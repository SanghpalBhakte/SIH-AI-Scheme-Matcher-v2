// Deterministic keyword/phrase intent classifier. No ML, no external
// call — a fixed, ordered list of regex patterns. Order matters: more
// specific phrasing (e.g. "why was this recommended") is checked before
// broader phrasing (e.g. anything with "eligible") so the two don't
// collide. This is intentionally simple pattern matching, not NLP — it
// only needs to be good enough to route to the right deterministic
// answer, never to "understand" language.

import type { IntentId } from './types'

const PATTERNS: { intent: IntentId; test: RegExp }[] = [
  {
    intent: 'recommendation_reason',
    test: /why\s+(was|is|did|does).{0,25}(recommend|match|suggest|chosen|picked|shown|show up)/i,
  },
  {
    intent: 'required_documents',
    test: /\b(document|paperwork|papers?|proof|kyc|id card)\b|what.*\b(do i|does it|would i)\s+need\b/i,
  },
  {
    intent: 'application_steps',
    test: /how (do|can|to) i apply|application (process|steps)|steps to apply|where (do|can) i apply|how to apply/i,
  },
  {
    intent: 'scheme_benefits',
    test: /\bbenefit|how much (money|loan|amount|subsidy)|what.*(will i|do i) (get|receive)|subsidy amount|loan amount/i,
  },
  {
    intent: 'scheme_eligibility',
    test: /eligib\w*\s+criteria|who (can|is) eligible|requirements? (for|of)|criteria for/i,
  },
  {
    intent: 'eligible_schemes',
    test: /what.*(am i|schemes).*eligible|which schemes|eligible schemes|schemes?.*(for me|match me)|qualify for|my (matches|recommendations)/i,
  },
  {
    // Deliberately NOT matching a bare "what is …" — that phrasing is
    // too common in unrelated questions ("what is the weather today")
    // and would wrongly route them here instead of to the fallback.
    intent: 'scheme_explanation',
    test: /explain|tell me about|what is (this|it|the scheme)\b|describe|overview of/i,
  },
  {
    intent: 'next_action',
    test: /what (should|do) i do next|next step|what now|where do i (start|begin)|what to do/i,
  },
  {
    intent: 'general_help',
    test: /\bhelp\b|what can you do|what.*you help with|what can i ask/i,
  },
]

export function classifyIntent(text: string): IntentId {
  for (const { intent, test } of PATTERNS) {
    if (test.test(text)) return intent
  }
  return 'unknown'
}
