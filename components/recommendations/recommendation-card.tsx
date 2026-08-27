import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EligibilityStatusBadge } from './eligibility-status-badge'
import { MatchExplanation } from './match-explanation'
import type { SchemeMatchResult } from '@/lib/matching/types'

// One scheme's card on the recommendations list: name, ministry,
// score, status, benefit, summary, official/detail links, plus the
// shared MatchExplanation block (also used on the scheme details
// page) for the matched/missing/failed breakdown.
export function RecommendationCard({ result }: { result: SchemeMatchResult }) {
  const { scheme, matchScore, eligibilityStatus } = result

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold leading-snug text-foreground">{scheme.name}</h3>
            {scheme.ministry && <p className="mt-0.5 text-xs text-muted-foreground">{scheme.ministry}</p>}
          </div>
          <Badge variant="outline" className="shrink-0 text-sm font-bold text-foreground">
            {matchScore}%
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <EligibilityStatusBadge status={eligibilityStatus} />
          {scheme.isDemo && <Badge variant="destructive">DEMO SCHEME — NOT AN OFFICIAL GOVERNMENT SCHEME</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm">
        <p className="font-medium text-primary">{scheme.benefit}</p>
        <p className="text-muted-foreground">{scheme.summary}</p>

        <MatchExplanation result={result} />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={`/schemes/${scheme.id}`}
            className="text-xs font-semibold text-foreground underline-offset-4 hover:underline"
          >
            View details
          </Link>
          {scheme.officialUrl && (
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              View official scheme →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
