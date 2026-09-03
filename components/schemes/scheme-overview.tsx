'use client'

import { Users } from 'lucide-react'

import { describeAudience } from '@/lib/schemes/describe-audience'
import { DataConfidenceNote } from '@/components/schemes/data-confidence-note'
import { useLanguage } from '@/lib/i18n/language-context'
import type { Scheme } from '@/lib/matching/types'

// Plain-language "what this scheme offers, and who it's for" section.
// Reads only the scheme's own fields — no profile, no scoring. The
// generated audience lines (describeAudience) stay in English — see
// lib/i18n/translations.ts's header comment for why data-generated
// text isn't translated this pass, only the static "Who can benefit"
// heading around it.
export function SchemeOverview({ scheme }: { scheme: Scheme }) {
  const { t } = useLanguage()
  const audience = describeAudience(scheme)

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="font-medium text-primary">{scheme.benefit}</p>
        <p className="mt-1 text-muted-foreground">{scheme.summary}</p>
        <DataConfidenceNote scheme={scheme} className="mt-2" />
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Users className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          {t('schemeDetails.whoCanBenefit')}
        </p>
        <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
          {audience.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
