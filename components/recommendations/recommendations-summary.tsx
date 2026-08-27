import { Award, ListChecks, AlertCircle, CheckCircle2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SchemeMatchResult } from '@/lib/matching/types'

// At-a-glance summary strip: how many schemes are shown, the
// strongest one, and whether anything shown still needs more
// information to judge confidently. Reads only from already-computed
// SchemeMatchResult objects — no new scoring happens here.
export function RecommendationsSummary({
  results,
  totalEvaluated,
}: {
  results: SchemeMatchResult[]
  totalEvaluated: number
}) {
  const strongest = results[0]
  const needsMoreInfoCount = results.filter((r) => r.missingCriteria.length > 0).length

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <ListChecks className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-xs text-muted-foreground">Schemes shown</p>
            <p className="text-sm font-semibold text-foreground">
              {results.length} of {totalEvaluated} evaluated
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Award className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-xs text-muted-foreground">Strongest match</p>
            <p className="truncate text-sm font-semibold text-foreground">
              {strongest ? `${strongest.scheme.name} · ${strongest.matchScore}%` : '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          {needsMoreInfoCount > 0 ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-warning" aria-hidden />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Missing information</p>
            <p className={cn('text-sm font-semibold text-foreground')}>
              {needsMoreInfoCount > 0
                ? `${needsMoreInfoCount} scheme${needsMoreInfoCount > 1 ? 's need' : ' needs'} more info`
                : 'None for what\'s shown'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
