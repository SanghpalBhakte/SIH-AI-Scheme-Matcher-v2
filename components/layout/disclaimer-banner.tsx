'use client'

import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

/**
 * The always-visible product disclaimer (required by the product
 * rules — never let this get lost as we build more pages). Content
 * only, no outer border/background, so it can drop into the site
 * footer (see app/layout.tsx) or inline above a set of results with
 * whatever container styling fits the page.
 */
export function DisclaimerBanner({ className }: { className?: string }) {
  const { t } = useLanguage()
  return (
    <div className={cn('flex items-start gap-2 text-xs text-muted-foreground', className)}>
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
      <p>
        <strong className="text-foreground">{t('disclaimer.title')}</strong> {t('disclaimer.body')}
      </p>
    </div>
  )
}
