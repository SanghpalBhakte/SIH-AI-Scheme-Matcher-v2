'use client'

import { Languages } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { LOCALES } from '@/lib/i18n/translations'

/**
 * Header language toggle. Only two locales exist today (see
 * lib/i18n/translations.ts), so this is a simple cycle button rather than
 * a dropdown — LOCALES is still a list, so a third language later is a
 * data change here, not a redesign. Mirrors ThemeToggle's compact
 * icon-button styling and its "safe default until hydrated" caution.
 */
export function LanguageToggle() {
  const { locale, setLocale, isHydrated, t } = useLanguage()

  function cycleLocale() {
    const currentIndex = LOCALES.findIndex((l) => l.code === locale)
    const next = LOCALES[(currentIndex + 1) % LOCALES.length]
    setLocale(next.code)
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={cycleLocale}
      aria-label={t('nav.languageToggle')}
      className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span className="text-xs font-medium sm:hidden">{isHydrated ? current.shortLabel : LOCALES[0].shortLabel}</span>
      <span className="hidden text-xs font-medium sm:inline">{isHydrated ? current.nativeLabel : LOCALES[0].nativeLabel}</span>
    </Button>
  )
}
