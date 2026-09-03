'use client'

// Global error boundary — Next.js App Router convention
// (https://nextjs.org/docs/app/building-your-application/routing/error-handling).
// Catches any error thrown while rendering a page or nested layout below
// the root layout (the root layout itself, including LanguageProvider,
// stays mounted, so useLanguage() below still works). Mirrors the same
// branded, on-theme empty-state pattern already used by app/offline/page.tsx
// (icon chip + title + body + a Button/Link action), reusing the existing
// Card/Button components rather than one-off styling.

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/language-context'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLanguage()

  useEffect(() => {
    // Always log — this must not swallow errors during development (or
    // in production, where it's the only trace we have since there's no
    // telemetry wired up yet).
    console.error(error)
  }, [error])

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden />
          </div>
          <div className="space-y-1.5">
            <p className="text-lg font-semibold text-foreground">{t('error.title')}</p>
            <p className="max-w-sm text-sm text-muted-foreground">{t('error.body')}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Button size="sm" onClick={() => reset()}>
              {t('error.startOver')}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">{t('error.goHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
