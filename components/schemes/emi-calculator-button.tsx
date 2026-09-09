'use client'

import Link from 'next/link'
import { Calculator } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

interface EmiCalculatorButtonProps {
  /** 'icon' for a compact icon-only button; 'label' shows text too (scheme details page). */
  variant?: 'icon' | 'label'
  className?: string
}

/**
 * A real, clickable EMI Calculator button for the scheme details page —
 * added 2026-09-09 after feedback that the tool "felt hidden away" when
 * only reachable via the header's Tools/More menu (global, not tied to
 * the loan-based scheme someone is actually looking at) or a small text
 * link buried inside the "Before you apply" quick-reference grid. Sits
 * next to WhatsAppShareButton/SaveSchemeButton in the page's top action
 * row instead — same visual weight, same icon/label pattern — so it's
 * visible the moment someone opens a scheme that needs it, not several
 * scrolls in. The page only renders this for loan-based schemes
 * (see isLoanBased in lib/finance/emi.ts); this component itself has no
 * opinion on that, matching how SaveSchemeButton/WhatsAppShareButton
 * are similarly "dumb" about when they're shown.
 */
export function EmiCalculatorButton({ variant = 'icon', className }: EmiCalculatorButtonProps) {
  const { t } = useLanguage()

  if (variant === 'label') {
    return (
      <Button type="button" variant="outline" className={cn('gap-1.5', className)} asChild>
        <Link href="/emi-calculator">
          <Calculator className="h-4 w-4" aria-hidden />
          {t('nav.emiCalculator')}
        </Link>
      </Button>
    )
  }

  return (
    <Button type="button" variant="ghost" size="icon" aria-label={t('nav.emiCalculator')} className={cn('shrink-0 text-muted-foreground hover:text-primary', className)} asChild>
      <Link href="/emi-calculator">
        <Calculator className="h-4 w-4" aria-hidden />
      </Link>
    </Button>
  )
}
