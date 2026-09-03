'use client'

import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'
import type { Scheme } from '@/lib/matching/types'

/**
 * Small, honest "data confidence" note — rendered only for the handful
 * of scheme records whose own sourcing comments in data/schemes.ts flag
 * a real caveat (an unresolved figure, a tier not separately stated, a
 * primary source that couldn't be verified this pass). Purely
 * informational: `Scheme.dataConfidenceNote` is never read by the
 * matching engine (see its doc comment in lib/matching/types.ts), so
 * this can never affect matchScore or eligibilityStatus. Renders
 * nothing for the vast majority of schemes that don't carry one.
 *
 * The note text itself stays in English, same treatment as
 * `Scheme.enhancedSupportFor.detail` (see describeAudience() /
 * scheme-overview.tsx) — only the static label around it is translated.
 */
export function DataConfidenceNote({ scheme, className }: { scheme: Scheme; className?: string }) {
  const { t } = useLanguage()
  if (!scheme.dataConfidenceNote) return null

  return (
    <p className={cn('flex items-start gap-1.5 text-xs text-muted-foreground', className)}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden />
      <span>
        <strong className="text-foreground">{t('dataConfidence.label')}</strong> {scheme.dataConfidenceNote}
      </span>
    </p>
  )
}
