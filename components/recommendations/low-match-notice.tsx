'use client'

import Link from 'next/link'
import { Compass } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'

// Shown instead of a silent/dead screen when nothing in the shown
// results is a strong match. Calm, not alarming: explains why, offers
// a concrete next step (review your answers), and makes clear the
// lower-match schemes below are still worth a look rather than hiding
// them.
export function LowMatchNotice() {
  const { t } = useLanguage()
  return (
    <Alert variant="warning">
      <Compass className="h-4 w-4" aria-hidden />
      <AlertTitle>{t('lowMatch.title')}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{t('lowMatch.body')}</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/assessment">{t('lowMatch.cta')}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
