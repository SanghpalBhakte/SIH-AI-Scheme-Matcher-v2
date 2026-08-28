'use client'

import { Languages } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/language-context'
import { LOCALES, type Locale } from '@/lib/i18n/translations'

/**
 * Header language switcher. With 8 locales (see lib/i18n/translations.ts),
 * a cycle-on-click button would take up to 7 clicks to reach the last
 * language — not viable past 2-3 options, so this is a native <select>
 * instead. The select is visually invisible (opacity-0, absolutely
 * positioned over the icon+short-label trigger) so the CLOSED state never
 * reflows to fit a long native name like "Gujarati" — it always reads as
 * the compact shortLabel (e.g. "EN", "தமி") — while the OPEN dropdown is
 * the browser's own native list showing each language's real name via
 * nativeLabel. This keeps full keyboard/screen-reader semantics (it's a
 * real <select>, not a custom widget) without custom popover/focus-trap
 * code. Mirrors ThemeToggle's compact icon-button footprint and its "safe
 * default until hydrated" caution.
 */
export function LanguageToggle() {
  const { locale, setLocale, isHydrated, t } = useLanguage()
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <div className="relative flex h-9 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground">
      <Languages className="h-4 w-4 shrink-0" aria-hidden />
      <span className="text-xs font-medium">{isHydrated ? current.shortLabel : LOCALES[0].shortLabel}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t('nav.languageToggle')}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  )
}
