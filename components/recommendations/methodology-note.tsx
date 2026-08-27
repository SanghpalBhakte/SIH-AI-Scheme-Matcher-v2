import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

// Compact, honest explanation of how matching actually works — kept
// separate from DisclaimerBanner because it's a different claim: the
// banner says "verify officially," this says "here's specifically
// what did and didn't feed the score you're looking at." Required so
// the extra fields collected in the fuller assessment form (business
// needs, turnover, funding requirement, etc.) never read as if they
// influenced a result they don't currently touch.
export function MethodologyNote({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-start gap-2 rounded-md border border-border bg-secondary/40 p-3 text-xs text-muted-foreground', className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p>
        <strong className="text-foreground">These are AI-assisted, rule-based matches</strong> — computed from
        seven factors you answered: category, gender, state, sector, business stage, first-time status, and income
        (if provided). Other details you entered, like business needs, turnover, or funding requirement, are saved
        for future guidance features but don&apos;t affect this score yet.
      </p>
    </div>
  )
}
