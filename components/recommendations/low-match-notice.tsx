import Link from 'next/link'
import { Compass } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// Shown instead of a silent/dead screen when nothing in the shown
// results is a strong match. Calm, not alarming: explains why, offers
// a concrete next step (review your answers), and makes clear the
// lower-match schemes below are still worth a look rather than hiding
// them.
export function LowMatchNotice() {
  return (
    <Alert variant="warning">
      <Compass className="h-4 w-4" aria-hidden />
      <AlertTitle>None of these are a strong match yet</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Based on what you shared, the schemes below don&apos;t line up strongly with your profile. That doesn&apos;t
          mean nothing is available — double-check your category, state, sector, and business stage, since a small
          correction can change the result. The schemes listed below are still worth reading in the meantime.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/assessment">Review your answers</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
