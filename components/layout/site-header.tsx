'use client'

import type { MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Landmark } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAssessment } from '@/lib/assessment/assessment-context'

// "Dashboard" is deliberately not in this list. That route isn't part
// of the live-demo path (landing → assessment → recommendations →
// scheme details → checklist) and its content isn't defined yet — see
// app/dashboard/page.tsx. Leaving it out of primary nav means a judge
// clicking through the header never lands on it by accident; the
// route itself still exists for anyone who navigates there directly.
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/recommendations', label: 'Recommendations' },
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
    <header className="border-b border-border bg-card">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          onClick={(e) => guardNavigation(e, '/')}
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground"
        >
          <Landmark className="h-4 w-4 text-primary" aria-hidden />
          AI Scheme Matcher
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => guardNavigation(e, link.href)}
                className={cn(
                  'transition-colors hover:text-foreground',
                  isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">SIH26092 · Prototype</span>
      </div>
    </header>
  )
}
