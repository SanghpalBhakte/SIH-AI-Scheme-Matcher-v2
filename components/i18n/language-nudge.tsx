'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/language-context'
import { DEFAULT_LOCALE } from '@/lib/i18n/translations'

const STORAGE_KEY = 'sih26092.languageNudgeDismissed'

/**
 * One-time discovery hint for the language switcher — most first-time
 * visitors have no reason to notice a small "EN" in the header. Shows
 * once, positioned under LanguageToggle (its parent in site-header.tsx
 * is `relative` for this reason), and disappears for good once
 * dismissed OR once the visitor actually switches language (at that
 * point they've found it; no need to nag). Same isHydrated-safe
 * localStorage pattern as the rest of this app's persisted UI state —
 * server render and first paint always render nothing, so there's no
 * hydration mismatch and no popover flash for a returning visitor.
 */
export function LanguageNudge({ hidden = false }: { hidden?: boolean }) {
  const { locale, isHydrated } = useLanguage()
  const [dismissed, setDismissed] = useState(true)
  const [storageChecked, setStorageChecked] = useState(false)

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setDismissed(false)
    }
    setStorageChecked(true)
  }, [])

  function dismiss() {
    setDismissed(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // non-fatal — the nudge just might show again next visit
    }
  }

  // Once someone has actually switched language, they've found the
  // control — stop nagging and remember that too.
  useEffect(() => {
    if (isHydrated && locale !== DEFAULT_LOCALE) dismiss()
  }, [isHydrated, locale])

  if (hidden || !isHydrated || !storageChecked || dismissed || locale !== DEFAULT_LOCALE) return null

  return (
    <div
      role="status"
      className="absolute right-0 top-full z-20 mt-2 w-52 animate-fade-in-up rounded-md border border-border bg-card p-3 text-left shadow-elevated"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss language hint"
        // p-2.5 around a 12px icon gives a ~32px tap target (the icon
        // itself stays visually small) — the raw p-0.5 this replaced
        // measured at just 16x16px on a real mobile audit.
        className="absolute right-0.5 top-0.5 rounded-sm p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
      <p className="pr-6 text-xs leading-relaxed text-foreground">
        <span className="font-semibold">12 Indian languages available</span> — tap here to read this app in yours.
      </p>
    </div>
  )
}
