'use client'

import { MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { CSC_LOCATOR_URL } from '@/lib/schemes/csc-locator'
import { cn } from '@/lib/utils'

interface CscLocatorButtonProps {
  /** 'icon' for a compact icon-only button; 'label' shows text too (scheme details page). */
  variant?: 'icon' | 'label'
  className?: string
}

/**
 * A real, clickable "get help in person" button for the scheme details
 * page — added 2026-09-09 alongside EmiCalculatorButton, same reasoning:
 * the CSC locator previously only lived inside the header's Tools/More
 * menu (global) or right at the bottom of a scheme's own multi-step
 * application checklist (easy to miss unless someone scrolls all the
 * way through it). Unlike the EMI calculator this is relevant to EVERY
 * scheme, not just loan-based ones — a Common Service Centre operator
 * can walk someone through ANY government portal application in person
 * — so the page renders this unconditionally next to Share/Save. The
 * checklist's own CSC link stays too (useful reinforcement right at the
 * point someone is stepping through "how do I actually apply"); this
 * one exists so the option is visible immediately, not several scrolls
 * or a completed assessment away.
 */
export function CscLocatorButton({ variant = 'icon', className }: CscLocatorButtonProps) {
  const { t } = useLanguage()

  if (variant === 'label') {
    return (
      <Button type="button" variant="outline" className={cn('gap-1.5', className)} asChild>
        <a href={CSC_LOCATOR_URL} target="_blank" rel="noreferrer">
          <MapPin className="h-4 w-4" aria-hidden />
          {t('common.cscHelpButton')}
        </a>
      </Button>
    )
  }

  return (
    <Button type="button" variant="ghost" size="icon" aria-label={t('common.cscHelpButton')} className={cn('shrink-0 text-muted-foreground hover:text-primary', className)} asChild>
      <a href={CSC_LOCATOR_URL} target="_blank" rel="noreferrer">
        <MapPin className="h-4 w-4" aria-hidden />
      </a>
    </Button>
  )
}
