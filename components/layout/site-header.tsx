'use client'

import { useState, type MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Landmark, Home, ClipboardList, LayoutGrid, ListChecks, Bookmark } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LanguageToggle } from '@/components/i18n/language-toggle'
import { LanguageNudge } from '@/components/i18n/language-nudge'
import { cn } from '@/lib/utils'
import { useAssessment } from '@/lib/assessment/assessment-context'
import { useSavedSchemes } from '@/lib/schemes/saved-schemes-context'
import { useLanguage } from '@/lib/i18n/language-context'

// "Saved schemes" (/dashboard) is deliberately its own bookmark icon in
// the actions area rather than a 5th text nav item — see the dashboard
// page for why that route now has real content. Keeping primary nav to
// four items (Home/Assessment/Schemes/Recommendations) leaves room for
// the language + theme toggles without crowding mobile's icon-only row.
const NAV_LINKS = [
  { href: '/', labelKey: 'nav.home', icon: Home },
  { href: '/assessment', labelKey: 'nav.assessment', icon: ClipboardList },
  { href: '/schemes', labelKey: 'nav.schemes', icon: LayoutGrid },
  { href: '/recommendations', labelKey: 'nav.recommendations', icon: ListChecks },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { isDirty } = useAssessment()
  const { savedIds, isHydrated: savedHydrated } = useSavedSchemes()
  const { t } = useLanguage()
  const savedCount = savedHydrated ? savedIds.length : 0
  // Keeps the one-time language nudge from overlapping the language
  // dropdown's own floating panel — both are absolutely positioned
  // under the same trigger (see the `relative` wrapper below).
  const [langOpen, setLangOpen] = useState(false)

  // In-app unsaved-progress guard: only fires when the user is
  // currently ON /assessment, the draft is dirty, and the link would
  // actually take them somewhere else. This is the officially
  // supported way to intercept a Next.js <Link> click (pass onClick,
  // call preventDefault to cancel) — not a global router override.
  // It only covers navigation through this header's own links; browser
  // Back/Forward isn't interceptable this way (see assessment/page.tsx
  // and the project notes for that limitation).
  function guardNavigation(e: MouseEvent, href: string) {
    if (pathname === '/assessment' && href !== '/assessment' && isDirty) {
      const shouldLeave = window.confirm(t('nav.unsavedGuard'))
      if (!shouldLeave) {
        e.preventDefault()
      }
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card shadow-soft">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          onClick={(e) => guardNavigation(e, '/')}
          // -m-2/p-2 grows the tap target to ~36px without shifting
          // layout (the negative margin exactly cancels the padding on
          // every side) — below `sm` the wordmark is hidden and the
          // link would otherwise be just the 20px icon, well under a
          // usable mobile touch target.
          className="-m-2 flex shrink-0 items-center gap-2 p-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          <Landmark className="h-5 w-5 text-primary" aria-hidden />
          {/* Wordmark hides below sm — on a narrow phone the icon alone
              plus 4 nav icons plus 3 action icons already crowds the
              row; the icon alone still reads as "home/brand". */}
          <span className="hidden font-display text-base sm:inline">SchemeSetu</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-0.5 text-sm sm:gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname?.startsWith(`${link.href}/`)
            const Icon = link.icon
            const label = t(link.labelKey)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => guardNavigation(e, link.href)}
                aria-label={label}
                className={cn(
                  'flex min-h-11 items-center gap-1.5 rounded-md border-b-2 px-2.5 py-2 transition-colors duration-150 sm:min-h-0 sm:px-3 sm:py-1.5',
                  isActive
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0 sm:hidden" aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Badge variant="secondary" className="hidden lg:inline-flex">
            SIH26092 · Prototype
          </Badge>
          <Link
            href="/dashboard"
            onClick={(e) => guardNavigation(e, '/dashboard')}
            aria-label={t('nav.savedSchemesLink')}
            className={cn(
              'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground sm:h-9 sm:w-9',
              pathname === '/dashboard' && 'text-primary'
            )}
          >
            <Bookmark className="h-4 w-4" aria-hidden />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground">
                {savedCount}
              </span>
            )}
          </Link>
          <div className="relative">
            <LanguageToggle onOpenChange={setLangOpen} />
            <LanguageNudge hidden={langOpen} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
