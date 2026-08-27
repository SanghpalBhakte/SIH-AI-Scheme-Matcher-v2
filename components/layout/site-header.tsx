'use client'

import type { MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Landmark, Home, ClipboardList, ListChecks } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { cn } from '@/lib/utils'
import { useAssessment } from '@/lib/assessment/assessment-context'

// "Dashboard" is deliberately not in this list. That route isn't part
// of the live-demo path (landing → assessment → recommendations →
// scheme details → checklist) and its content isn't defined yet — see
// app/dashboard/page.tsx. Leaving it out of primary nav means a judge
// clicking through the header never lands on it by accident; the
// route itself still exists for anyone who navigates there directly.
const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/assessment', label: 'Assessment', icon: ClipboardList },
  { href: '/recommendations', label: 'Recommendations', icon: ListChecks },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { isDirty } = useAssessment()

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
      const shouldLeave = window.confirm(
        'You have unsaved assessment answers. Leave this page and lose your progress?'
      )
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
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          <Landmark className="h-5 w-5 text-primary" aria-hidden />
          <span className="font-display text-base">AI Scheme Matcher</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-0.5 text-sm sm:gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => guardNavigation(e, link.href)}
                aria-label={link.label}
                className={cn(
                  'flex items-center gap-1.5 rounded-md border-b-2 px-2 py-1.5 transition-colors duration-150 sm:px-3',
                  isActive
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0 sm:hidden" aria-hidden />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            SIH26092 · Prototype
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
