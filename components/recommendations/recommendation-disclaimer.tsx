'use client'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

/**
 * The one consistent, required disclaimer for the reasoning/verification
 * feature (requirement B) — kept separate from DisclaimerBanner and
 * MethodologyNote, which make different claims ("verify officially" /
 * "here's exactly what fed the score"): this one states plainly who
 * actually decides eligibility. Static, translated, never scheme- or
 * profile-specific.
 */
export function RecommendationDisclaimer({ className }: { className?: string }) {
  const { t } = useLanguage()
  return <p className={cn('text-xs text-muted-foreground', className)}>{t('reasoning.disclaimer')}</p>
}
