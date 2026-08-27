import { Users } from 'lucide-react'

import { describeAudience } from '@/lib/schemes/describe-audience'
import type { Scheme } from '@/lib/matching/types'

// Plain-language "what this scheme offers, and who it's for" section.
// Reads only the scheme's own fields — no profile, no scoring.
export function SchemeOverview({ scheme }: { scheme: Scheme }) {
  const audience = describeAudience(scheme)

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="font-medium text-primary">{scheme.benefit}</p>
        <p className="mt-1 text-muted-foreground">{scheme.summary}</p>
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Users className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          Who can benefit
        </p>
        <ul className="mt-1.5 space-y-1 pl-5 text-xs text-muted-foreground">
          {audience.map((line) => (
            <li key={line} className="list-disc">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
