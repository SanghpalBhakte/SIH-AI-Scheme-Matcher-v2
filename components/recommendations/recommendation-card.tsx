'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EligibilityStatusBadge, ELIGIBILITY_STATUS_ACCENT } from './eligibility-status-badge'
import { MatchExplanation } from './match-explanation'
import { SaveSchemeButton } from '@/components/schemes/save-scheme-button'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'
import type { SchemeMatchResult } from '@/lib/matching/types'

// One scheme's card on the recommendations list: name, ministry,
// score, status, benefit, summary, official/detail links, plus the
// shared MatchExplanation block (also used on the scheme details
// page) for the matched/missing/failed breakdown. The left accent bar
// and score ring are purely visual — both are derived from the same
// already-computed result the badge and explanation use, nothing new
// is scored or decided here.
export function RecommendationCard({ result }: { result: SchemeMatchResult }) {
  const { t } = useLanguage()
  const { scheme, matchScore, eligibilityStatus } = result

  return (
    <Card
      className={cn(
        'flex flex-col border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated',
        ELIGIBILITY_STATUS_ACCENT[eligibilityStatus]
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-snug text-foreground">{scheme.name}</h3>
            {scheme.ministry && <p className="mt-0.5 text-xs text-muted-foreground">{scheme.ministry}</p>}
          </div>
          <div className="flex shrink-0 items-start gap-1">
            <div
              className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-center leading-none"
              aria-label={`${matchScore} percent match`}
            >
              <span className="text-sm font-bold text-primary">{matchScore}</span>
              <span className="text-[9px] font-medium text-muted-foreground">%</span>
            </div>
            <SaveSchemeButton schemeId={scheme.id} />
          </div>
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
            {t('common.viewDetails')}
          </Link>
          {scheme.officialUrl && (
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              {t('common.officialPortal')}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
