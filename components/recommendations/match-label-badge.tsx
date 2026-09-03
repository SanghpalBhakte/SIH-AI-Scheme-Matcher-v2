'use client'

import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/i18n/language-context'
import { deriveMatchLabel, type MatchLabel } from '@/lib/recommendations/reasoning'
import { cn } from '@/lib/utils'
import type { SchemeMatchResult } from '@/lib/matching/types'

// Same config-map shape as EligibilityStatusBadge (eligibility-status-badge.tsx)
// — kept as its own, separate badge rather than folded into that one,
// since it's a different, additional claim (see lib/recommendations/reasoning.ts's
// doc comment on deriveMatchLabel for the label rules). Never rendered
// as a percentage or "AI confidence" — always one of the 3 fixed,
// translated words below.
const MATCH_LABEL_VARIANT: Record<MatchLabel, 'success' | 'secondary' | 'warning'> = {
  'Strong match': 'success',
  'Possible match': 'secondary',
  'Explore after verification': 'warning',
}

const MATCH_LABEL_I18N_KEY: Record<MatchLabel, string> = {
  'Strong match': 'reasoning.matchLabel.strong',
  'Possible match': 'reasoning.matchLabel.possible',
  'Explore after verification': 'reasoning.matchLabel.explore',
}

export function MatchLabelBadge({ result, className }: { result: SchemeMatchResult; className?: string }) {
  const { t } = useLanguage()
  const label = deriveMatchLabel(result)

  return (
    <Badge variant={MATCH_LABEL_VARIANT[label]} className={cn(className)}>
      {t(MATCH_LABEL_I18N_KEY[label])}
    </Badge>
  )
}
