'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner'
import { EligibilityStatusBadge } from '@/components/recommendations/eligibility-status-badge'
import { MatchExplanation } from '@/components/recommendations/match-explanation'
import { SchemeOverview } from '@/components/schemes/scheme-overview'
import { ApplicationChecklist } from '@/components/schemes/application-checklist'
import { useAssessment } from '@/lib/assessment/assessment-context'
import { evaluateScheme } from '@/lib/matching/engine'
import { schemes } from '@/data/schemes'
import { isProfileComplete } from '@/lib/matching/types'

// Continues the explanation started on /recommendations for a single
// scheme. This route needs the in-progress assessment profile (React
// Context) to compute "why this matches you," which is only available
// to Client Components — hence 'use client' here, unlike the earlier
// placeholder version of this page.
export default function SchemeDetailsPage({ params }: { params: { id: string } }) {
  const { profile, isHydrated } = useAssessment()
  const scheme = schemes.find((s) => s.id === params.id)

  if (!scheme) {
    return (
      <main className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">Scheme not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          There&apos;s no scheme with that id in this prototype&apos;s dataset.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/recommendations">
            <ArrowLeft className="h-4 w-4" />
            Back to recommendations
          </Link>
        </Button>
      </main>
    )
  }

  // Only compute a match once hydration has checked for a stored
  // profile AND that profile is complete — scoring against the
  // still-empty default profile that's in place before hydration
  // finishes would incorrectly flash "finish your assessment" for
  // someone who actually has a complete profile stored from a
  // previous visit (see assessment-context.tsx's isHydrated). See
  // lib/matching/types.ts's isProfileComplete for what "complete"
  // means (the 6 hard-required fields; income stays optional).
  const profileComplete = isHydrated && isProfileComplete(profile)
  const result = profileComplete ? evaluateScheme(profile, scheme) : null

  return (
    <main className="container flex flex-col gap-6 py-12">
      <Button variant="outline" size="sm" className="w-fit" asChild>
        <Link href="/recommendations">
          <ArrowLeft className="h-4 w-4" />
          Back to recommendations
        </Link>
      </Button>

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>{scheme.name}</CardTitle>
              {scheme.ministry && <CardDescription>{scheme.ministry}</CardDescription>}
            </div>
            {result && (
              <Badge variant="outline" className="shrink-0 text-sm font-bold text-foreground">
                {result.matchScore}%
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {result && <EligibilityStatusBadge status={result.eligibilityStatus} />}
            {scheme.isDemo && <Badge variant="destructive">DEMO SCHEME — NOT AN OFFICIAL GOVERNMENT SCHEME</Badge>}
          </div>

          {scheme.officialUrl ? (
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View official scheme →
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">No official source link is on file for this entry.</p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <DisclaimerBanner />

          <section className="space-y-2 border-t border-border pt-4">
            <h2 className="text-sm font-semibold text-foreground">Overview</h2>
            <SchemeOverview scheme={scheme} />
          </section>

          <section className="space-y-2 border-t border-border pt-4">
            {/* Heading intentionally isn't "Why this matches you" — MatchExplanation
                already opens with that exact phrase inline, and repeating it as the
                section heading directly above it read as duplicate messaging. */}
            <h2 className="text-sm font-semibold text-foreground">Match explanation</h2>
            {!isHydrated ? (
              <p className="text-sm text-muted-foreground">Loading your assessment…</p>
            ) : result ? (
              <MatchExplanation result={result} />
            ) : (
              <Alert variant="warning">
                <AlertDescription className="flex flex-col gap-2">
                  <span>
                    Finish your assessment to see how your profile matches this scheme&apos;s eligibility rules.
                  </span>
                  <Button size="sm" className="w-fit" asChild>
                    <Link href="/assessment">Finish the assessment</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </section>

          <section className="space-y-2 border-t border-border pt-4">
            <h2 className="text-sm font-semibold text-foreground">Application checklist</h2>
            <p className="text-xs text-muted-foreground">
              A guided walkthrough of the general application path, with this scheme&apos;s own documents and steps
              filled in wherever the dataset has them.
            </p>
            <ApplicationChecklist scheme={scheme} />
          </section>
        </CardContent>
      </Card>
    </main>
  )
}
