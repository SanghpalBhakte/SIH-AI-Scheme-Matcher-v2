import { Check, ChevronDown } from 'lucide-react'

import { CriteriaList } from './criteria-list'
import { summarizeMatch } from '@/lib/recommendations/explain'
import type { SchemeMatchResult } from '@/lib/matching/types'

const TOP_MATCHED_LIMIT = 3

/**
 * The shared "why did this scheme score this way" explanation block —
 * used on both the recommendations list (RecommendationCard) and the
 * scheme details page, so the two never drift out of sync on wording
 * or structure. Reads only from an already-computed SchemeMatchResult
 * (lib/matching/engine.ts); it never recomputes or re-weighs anything.
 *
 * Structure:
 *  - always visible: a one-line "why", and the top matched criteria
 *  - always visible (when non-empty, so nothing the user needs to act
 *    on is hidden): "Needs verification" and "Not aligned"
 *  - progressive disclosure: any matched criteria beyond the top 3
 *    (most high-scoring schemes match on all 7 — showing all of them
 *    by default would bury the one-line "why" in a wall of text)
 */
export function MatchExplanation({ result }: { result: SchemeMatchResult }) {
  const { matchedCriteria, missingCriteria, failedCriteria } = result
  const topMatches = matchedCriteria.slice(0, TOP_MATCHED_LIMIT)
  const remainingMatches = matchedCriteria.slice(TOP_MATCHED_LIMIT)

  return (
    <div className="space-y-3 text-sm">
      <p className="rounded-md bg-secondary/50 p-2.5 text-xs text-foreground">
        <span className="font-semibold">Why this matches you: </span>
        {summarizeMatch(result)}
      </p>

      {topMatches.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Matched
          </p>
          <ul className="mt-1 space-y-0.5 pl-5 text-xs text-muted-foreground">
            {topMatches.map((c) => (
              <li key={c.key} className="list-disc">
                {c.label}
              </li>
            ))}
          </ul>
          {remainingMatches.length > 0 && (
            <details className="group mt-1">
              <summary className="ml-5 flex w-fit cursor-pointer list-none items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline">
                +{remainingMatches.length} more matched criteria
                <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <ul className="mt-1 space-y-0.5 pl-5 text-xs text-muted-foreground">
                {remainingMatches.map((c) => (
                  <li key={c.key} className="list-disc">
                    {c.label}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <CriteriaList tone="missing" items={missingCriteria} />
      <CriteriaList tone="failed" items={failedCriteria} />
    </div>
  )
}
