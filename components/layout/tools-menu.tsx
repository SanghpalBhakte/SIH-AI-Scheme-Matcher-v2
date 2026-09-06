'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, ExternalLink, MapPin, Wrench } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/language-context'
import { CSC_LOCATOR_URL } from '@/lib/schemes/csc-locator'
import { cn } from '@/lib/utils'

/**
 * A single header icon that opens both the EMI Calculator and the CSC
 * locator — added 2026-09-06 after user feedback that neither was
 * discoverable on mobile (EMI Calculator lived only in the footer; the
 * CSC locator only inside a specific scheme's application checklist).
 *
 * Deliberately ONE icon rather than two separate ones in the header's
 * action row: a real test at common phone widths (360/375/390px) showed
 * that two more full-size icon buttons pushed the header's total
 * content past the available width, squeezing the primary nav down
 * (its `min-w-0` lets the flex container shrink below its own content's
 * size rather than wrapping, so the nav icons visually overflowed and
 * collided with the actions row). One icon here costs 44px instead of
 * 88px and keeps the header working at every width already supported.
 *
 * Hand-rolled popover, not a new dependency — same pattern as
 * LanguageToggle (components/i18n/language-toggle.tsx): a visible
 * trigger button, a floating panel, outside-click + Escape to close,
 * real individually-focusable options.
 */
export function ToolsMenu() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
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

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('nav.toolsMenu')}
        title={t('nav.toolsMenu')}
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground sm:h-9 sm:w-9',
          (open || pathname === '/emi-calculator') && 'text-primary'
        )}
      >
        <Wrench className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('nav.toolsMenu')}
          className="animate-fade-in-up absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-border bg-card p-1.5 shadow-elevated-lg"
        >
          <Link
            href="/emi-calculator"
            role="menuitem"
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm text-foreground transition-colors duration-100 hover:bg-secondary"
          >
            <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="flex-1">{t('checklist.findCscHelp')}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          </a>
        </div>
      )}
    </div>
  )
}
