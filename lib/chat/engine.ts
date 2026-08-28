// The deterministic query/response engine. Pure function: same
// (input, context, session, schemes) always produces the same reply —
// no randomness, no external call, nothing invented that isn't already
// in the local scheme data, the profile, or the matching results.
//
// It deliberately reuses the app's existing explanation helpers rather
// than re-deriving that logic:
//   - lib/matching/engine.ts (evaluateScheme)  → the one scoring source
//   - lib/recommendations/explain.ts (summarizeMatch) → plain-language
//     "why this matched" text, already used on the scheme detail page
//   - lib/schemes/describe-audience.ts (describeAudience) → the
//     scheme's own stated eligibility rules, already used there too
//   - lib/schemes/checklist.ts (GENERIC_CHECKLIST_STEPS) → the same
//     generic application path shown in ApplicationChecklist

import type { Scheme } from '@/lib/matching/types'
import { evaluateScheme } from '@/lib/matching/engine'
import { summarizeMatch } from '@/lib/recommendations/explain'
import { describeAudience } from '@/lib/schemes/describe-audience'
import { GENERIC_CHECKLIST_STEPS } from '@/lib/schemes/checklist'
import type { ChatAppContext } from './context-adapter'
import type { ChatSession } from './types'
import { classifyIntent } from './intents'
import { detectSchemeName, referencesActiveScheme } from './scheme-lookup'

/** Exact fallback text required for unclear/unsupported questions. */
export const FALLBACK_HELP =
  'I can help with questions about government schemes, your recommendations, eligibility, required documents, and application steps.'

function askWhichScheme(schemes: Scheme[]): string {
  const example = schemes[0]?.name ?? 'a scheme'
  return `I'm not sure which scheme you mean. Try naming one — for example "${example}" — or open a scheme's page first and then ask me about it.`
}

/**
 * Decides which scheme (if any) the question is about: an explicitly
 * named scheme wins; otherwise a pronoun ("this scheme", "it") falls
 * back to whichever scheme is open on screen, then to the last scheme
 * discussed this session; with no scheme named and no pronoun, the
 * currently open scheme (if any) still applies so "what documents do I
 * need" works without repeating the name on a scheme's own page.
 */
function resolveActiveScheme(
  input: string,
  context: ChatAppContext,
  session: ChatSession,
  schemes: Scheme[]
): Scheme | null {
  const named = detectSchemeName(input, schemes)
  if (named) return named

  if (referencesActiveScheme(input) && session.lastSchemeId) {
    const remembered = schemes.find((s) => s.id === session.lastSchemeId)
    if (remembered) return remembered
  }

  if (context.selectedScheme) return context.selectedScheme

  if (session.lastSchemeId) {
    return schemes.find((s) => s.id === session.lastSchemeId) ?? null
  }

  return null
}

export function answerQuery(
  rawInput: string,
  context: ChatAppContext,
  session: ChatSession,
  schemes: Scheme[]
): { text: string; nextSession: ChatSession } {
  const input = rawInput.trim()
  if (!input) {
    return { text: FALLBACK_HELP, nextSession: session }
  }

  if (schemes.length === 0) {
    return {
      text: "The scheme database hasn't loaded, so I can't look anything up right now — please try again in a moment.",
      nextSession: session,
    }
  }

  const intent = classifyIntent(input)
  const activeScheme = resolveActiveScheme(input, context, session, schemes)

  let nextSession: ChatSession = { ...session, lastIntent: intent }
  if (activeScheme) nextSession = { ...nextSession, lastSchemeId: activeScheme.id }

  switch (intent) {
    case 'eligible_schemes': {
      if (!context.profileComplete) {
        return {
          text:
            "I don't have your profile yet, so I can't tell you which schemes you're eligible for. " +
            'Complete the assessment (category, gender, state, sector, stage, and first-time status) and I\'ll be able to check.',
          nextSession,
        }
      }
      const results = context.recommendations ?? []
      const strong = results.filter(
        (r) => r.eligibilityStatus === 'Likely Eligible' || r.eligibilityStatus === 'Possibly Eligible'
      )
      if (strong.length === 0) {
        return {
          text:
            "Based on your profile, none of the schemes in this dataset are a strong match right now. " +
            'You can still review the closest ones on the Recommendations page — a lower score is sometimes still worth checking directly.',
          nextSession,
        }
      }
      const top = strong.slice(0, 3)
      const lines = top.map((r) => `• ${r.scheme.name} — ${r.matchScore}% match (${r.eligibilityStatus})`)
      return {
        text:
          `Based on your profile, here's what looks like a good fit:\n${lines.join('\n')}\n\n` +
          `Open the Recommendations page for the full explanation, or ask me "why was ${top[0].scheme.name} recommended?"`,
        nextSession,
      }
    }

    case 'recommendation_reason': {
      if (!activeScheme) return { text: askWhichScheme(schemes), nextSession }
      if (!context.completeProfile) {
        return {
          text: `I can explain why ${activeScheme.name} would or wouldn't match you once your profile is complete — finish the assessment first.`,
          nextSession,
        }
      }
      const result = evaluateScheme(context.completeProfile, activeScheme)
      return { text: `${activeScheme.name}: ${summarizeMatch(result)}`, nextSession }
    }

    case 'scheme_explanation': {
      if (!activeScheme) return { text: askWhichScheme(schemes), nextSession }
      const ministry = activeScheme.ministry ? ` It's administered by ${activeScheme.ministry}.` : ''
      return {
        text: `${activeScheme.name}: ${activeScheme.summary}${ministry} Benefit: ${activeScheme.benefit}.`,
        nextSession,
      }
    }

    case 'scheme_benefits': {
      if (!activeScheme) return { text: askWhichScheme(schemes), nextSession }
      return { text: `${activeScheme.name} offers: ${activeScheme.benefit}.`, nextSession }
    }

    case 'scheme_eligibility': {
      if (!activeScheme) return { text: askWhichScheme(schemes), nextSession }
      const lines = describeAudience(activeScheme).map((l) => `• ${l}`)
      return {
        text:
          `${activeScheme.name}'s own stated eligibility rules:\n${lines.join('\n')}\n\n` +
          'This is the scheme\'s general criteria, not a check against your specific profile — ask "why was this recommended?" for that.',
        nextSession,
      }
    }

    case 'required_documents': {
      if (!activeScheme) return { text: askWhichScheme(schemes), nextSession }
      if (activeScheme.requiredDocuments && activeScheme.requiredDocuments.length > 0) {
        const lines = activeScheme.requiredDocuments.map((d) => `• ${d}`)
        return { text: `Documents ${activeScheme.name} asks for:\n${lines.join('\n')}`, nextSession }
      }
      return {
        text:
          `I don't have a confirmed document list for ${activeScheme.name} in the dataset` +
          `${activeScheme.officialUrl ? ` — check ${activeScheme.officialUrl} directly` : ''}. ` +
          'In general, government schemes ask for ID proof, address proof, a category/caste certificate (if relevant), and business details — but confirm the exact list on the official portal before applying.',
        nextSession,
      }
    }

    case 'application_steps': {
      if (!activeScheme) return { text: askWhichScheme(schemes), nextSession }
      if (activeScheme.applicationSteps && activeScheme.applicationSteps.length > 0) {
        const lines = activeScheme.applicationSteps.map((s, i) => `${i + 1}. ${s}`)
        return { text: `How to apply for ${activeScheme.name}:\n${lines.join('\n')}`, nextSession }
      }
      const generic = GENERIC_CHECKLIST_STEPS.map((s, i) => `${i + 1}. ${s.label}`)
      return {
        text:
          `I don't have ${activeScheme.name}'s exact application steps yet, but the general path is:\n${generic.join('\n')}` +
          `${activeScheme.officialUrl ? `\n\nStart here: ${activeScheme.officialUrl}` : ''}`,
        nextSession,
      }
    }

    case 'next_action': {
      if (!context.profileComplete) {
        return {
          text: 'Your best next step is to complete the assessment — it takes a few minutes and unlocks your personalised recommendations.',
          nextSession,
        }
      }
      if (activeScheme) {
        return {
          text:
            `For ${activeScheme.name}, work through the application checklist on this page — check eligibility, prepare documents, then head to the official portal` +
            `${activeScheme.officialUrl ? ` (${activeScheme.officialUrl})` : ''}.`,
          nextSession,
        }
      }
      const results = context.recommendations ?? []
      if (results.length > 0) {
        return {
          text: `Your profile is complete — review your top match, ${results[0].scheme.name}, on the Recommendations page and open it for the full checklist.`,
          nextSession,
        }
      }
      return { text: FALLBACK_HELP, nextSession }
    }

    case 'general_help':
      return {
        text:
          'I can help you understand government schemes — ask me things like "what schemes am I eligible for", ' +
          '"why was this scheme recommended", "what documents do I need", or "how do I apply". ' +
          "I only use information already in this app, so I'll say when something isn't in the dataset.",
        nextSession,
      }

    case 'unknown':
    default:
      return { text: FALLBACK_HELP, nextSession }
  }
}
