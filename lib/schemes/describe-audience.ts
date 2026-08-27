// Plain-language description of a scheme's OWN stated eligibility
// rules — independent of any specific user. This is NOT matching
// logic: it never reads a profile and never produces a score, it just
// phrases the scheme's categories/genders/sectors/etc. fields for a
// "who can benefit" section. lib/matching/engine.ts remains the only
// place a profile is actually scored against a scheme.

import type { Scheme } from '@/lib/matching/types'

function isOpen(list: string[]): boolean {
  return list.includes('Any') || list.includes('All')
}

/** Short, plain-language sentences describing who this scheme is for. */
export function describeAudience(scheme: Scheme): string[] {
  return [
    isOpen(scheme.categories)
      ? 'Open to all social/economic categories'
      : `Primarily for ${scheme.categories.join(', ')} entrepreneurs`,
    isOpen(scheme.genders) ? 'Open to all genders' : `Focused on ${scheme.genders.join('/')} entrepreneurs`,
    isOpen(scheme.states) ? 'Available nationwide' : `Available in: ${scheme.states.join(', ')}`,
    isOpen(scheme.sectors)
      ? 'Open to any business sector'
      : `Focused on the ${scheme.sectors.join(', ')} sector(s)`,
    isOpen(scheme.stages)
      ? 'Open at any business stage'
      : `Aimed at businesses at the ${scheme.stages.join('/')} stage`,
    scheme.firstTimeOnly ? 'Only for first-time entrepreneurs' : 'No first-time-entrepreneur requirement',
    scheme.maxIncomeLakh == null
      ? 'No annual income cap for this scheme'
      : `Annual income should not exceed ₹${scheme.maxIncomeLakh} lakh`,
  ]
}
