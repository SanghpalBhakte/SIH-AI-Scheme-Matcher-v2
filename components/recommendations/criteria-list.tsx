'use client'

import { Check, AlertTriangle, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'
import type { CriterionResult } from '@/lib/matching/types'

// Structured, labeled rendering for one outcome group (matched /
// missing / failed) — never a bare array dump. Renders nothing when
// there's nothing to say, so callers can drop all three in a row
// without conditionally wrapping each one.
export type CriterionTone = 'matched' | 'missing' | 'failed'

const TONE_CONFIG: Record<CriterionTone, { icon: typeof Check; headingKey: string; className: string }> = {
  matched: { icon: Check, headingKey: 'criteria.matched', className: 'text-success' },
  missing: { icon: AlertTriangle, headingKey: 'criteria.missing', className: 'text-warning' },
  failed: { icon: X, headingKey: 'criteria.failed', className: 'text-destructive' },
}

export function CriteriaList({ tone, items }: { tone: CriterionTone; items: CriterionResult[] }) {
  const { t } = useLanguage()
  if (items.length === 0) return null

  const { icon: Icon, headingKey, className } = TONE_CONFIG[tone]
  const heading = t(headingKey)

  return (
    <div>
      <p className={cn('flex items-center gap-1.5 text-xs font-semibold', className)}>
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {heading}
      </p>
      <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
        {items.map((c) => (
          <li key={c.key} className="flex items-start gap-2">
            <span className={cn('mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current', className)} aria-hidden />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
