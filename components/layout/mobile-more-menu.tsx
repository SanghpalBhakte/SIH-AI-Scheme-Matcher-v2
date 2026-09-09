'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark, Calculator, Check, ChevronLeft, ChevronRight, ExternalLink, Languages, MapPin, Moon, MoreHorizontal, Sun } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/language-context'
import { LOCALES, type Locale } from '@/lib/i18n/translations'
import { useTheme } from '@/lib/theme/theme-context'
import { useSavedSchemes } from '@/lib/schemes/saved-schemes-context'
import { CSC_LOCATOR_URL } from '@/lib/schemes/csc-locator'
import { cn } from '@/lib/utils'

/**
 * Mobile-only replacement for the header's Saved-schemes / Tools /
 * Language / Theme icons — added 2026-09-09 after a real mobile audit
 * found those four items, once combined with the four primary-nav
 * icons, no longer fit a phone-width header row. Playwright's DOM
 * measurements showed the primary nav's own box shrinking to as little
 * as 24px wide (its `min-w-0` lets it lose the flex space fight to the
 * `shrink-0` actions), while its actual icons stayed full-size and
 * visually collided with the Saved/Tools icons at every width tested
 * (320/360/390/412) — e.g. at 320px "Saved schemes" (x 92-136) sat
 * directly on top of "Assessment" (x 90-126) and "Schemes" (x 128-164).
 *
 * The fix used for EMI/CSC discoverability (ToolsMenu: combine several
 * destinations behind one icon) is applied one level further here: on
 * mobile, ALL FOUR remaining action icons collapse into this one "More"
 * trigger, which reclaims ~170px back for primary nav — comfortably
 * enough even at 320px. At `sm` and above there's no such pressure, so
 * the header keeps showing the four controls separately (unchanged).
 *
 * Two-view popover rather than one 16-row list (4 action rows + 12
 * languages would be a lot to scan in one menu): the main view has the
 * usual short list, and tapping "Language" swaps the panel to the
 * language list (same options as LanguageToggle) with a back arrow —
 * same hand-rolled popover mechanics as ToolsMenu/LanguageToggle
 * (outside-click + Escape close, real focusable rows), just with an
 * internal view switch instead of a second trigger.
 */
export function MobileMoreMenu() {
  const pathname = usePathname()
  const { t, locale, setLocale, isHydrated: langHydrated } = useLanguage()
  const { theme, mounted: themeMounted, toggleTheme } = useTheme()
  const { savedIds, isHydrated: savedHydrated } = useSavedSchemes()
  const savedCount = savedHydrated ? savedIds.length : 0
  const isDark = themeMounted && theme === 'dark'

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'main' | 'language'>('main')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function close() {
    setOpen(false)
    // Reset back to the main view for next time, after the close
    // animation/click has a moment to register — avoids a visible
    // flash back to "main" while the panel is still fading out.
    setTimeout(() => setView('main'), 150)
  }

  function choose(code: Locale) {
    setLocale(code)
    close()
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  const isActive = pathname === '/dashboard' || pathname === '/emi-calculator'

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('nav.moreMenu')}
        title={t('nav.moreMenu')}
        className={cn(
          'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground',
          (open || isActive) && 'text-primary'
        )}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
        {savedCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground">
            {savedCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('nav.moreMenu')}
          className="animate-fade-in-up absolute right-0 top-full z-30 mt-2 max-h-80 w-64 overflow-y-auto rounded-lg border border-border bg-card p-1.5 shadow-elevated-lg"
        >
          {view === 'main' ? (
            <>
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm text-foreground transition-colors duration-100 hover:bg-secondary"
              >
                <Bookmark className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="flex-1">{t('nav.savedSchemesLink')}</span>
                {savedCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-accent-foreground">
                    {savedCount}
                  </span>
                )}
              </Link>
              <Link
                href="/emi-calculator"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm text-foreground transition-colors duration-100 hover:bg-secondary"
              >
                <Calculator className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {t('nav.emiCalculator')}
              </Link>
              <a
                href={CSC_LOCATOR_URL}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm text-foreground transition-colors duration-100 hover:bg-secondary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="flex-1">{t('checklist.findCscHelp')}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </a>

              <div className="my-1.5 border-t border-border" />

              <button
                type="button"
                role="menuitem"
                onClick={() => setView('language')}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-sm text-foreground transition-colors duration-100 hover:bg-secondary"
              >
                <Languages className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="flex-1">{t('nav.languageToggle')}</span>
                <span className="text-xs text-muted-foreground">{langHydrated ? current.shortLabel : LOCALES[0].shortLabel}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={toggleTheme}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-sm text-foreground transition-colors duration-100 hover:bg-secondary"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                ) : (
                  <Moon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                )}
                <span className="flex-1">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setView('main')}
                className="mb-1 flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-left text-xs font-medium text-muted-foreground transition-colors duration-100 hover:bg-secondary hover:text-foreground"
              >
                <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t('nav.languageToggle')}
              </button>
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={l.code === locale}
                  onClick={() => choose(l.code)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors duration-100',
                    l.code === locale ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-secondary'
                  )}
                >
                  <span className="flex items-baseline gap-2">
                    <span>{l.nativeLabel}</span>
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </span>
                  {l.code === locale && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
