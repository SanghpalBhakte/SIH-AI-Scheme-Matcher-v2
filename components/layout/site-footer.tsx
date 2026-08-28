'use client'

import Link from 'next/link'
import { Landmark } from 'lucide-react'

import { DisclaimerBanner } from '@/components/layout/disclaimer-banner'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { useLanguage } from '@/lib/i18n/language-context'

// Footer content inspired by the reference site's 3-column layout (brand
// blurb / platform links / important notes) — rewritten in our own words
// and, unlike that reference's permanently-dark footer, kept theme-aware
// (bg-secondary/border-border) so it doesn't clash with our light/dark
// toggle. The disclaimer banner is unchanged and still lives here, just
// with real content around it now instead of being the footer's only
// content.
export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container flex flex-col gap-8 py-10">
        <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Landmark className="h-4 w-4 text-primary" aria-hidden />
              <span className="font-display text-base">SchemeSetu</span>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">{t('footer.blurb')}</p>
            <p className="text-xs text-muted-foreground">{t('footer.builtFor')}</p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{t('footer.platformHeading')}</p>
            <nav className="flex flex-col gap-1.5 text-sm">
              <Link href="/assessment" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.assessment')}
              </Link>
              <Link href="/schemes" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.schemes')}
              </Link>
              <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.saved')}
              </Link>
              <Link href="/institutions" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.institutions')}
              </Link>
              <Link href="/emi-calculator" className="text-muted-foreground transition-colors hover:text-foreground">
                {t('nav.emiCalculator')}
              </Link>
            </nav>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{t('footer.importantHeading')}</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>{t('footer.importantNote1')}</li>
              <li>{t('footer.importantNote2')}</li>
              <li>{t('footer.importantNote3')}</li>
            </ul>
          </div>
        </div>

        <DisclaimerBanner />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>{t('footer.copyright', { year: String(new Date().getFullYear()) })}</p>
          <InstallPrompt />
        </div>
      </div>
    </footer>
  )
}
