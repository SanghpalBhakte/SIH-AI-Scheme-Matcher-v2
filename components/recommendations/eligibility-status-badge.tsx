import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EligibilityStatus } from '@/lib/matching/types'

// Centralizes the status -> (badge color, honest description) mapping
// so the card and the summary strip never drift out of sync on
// wording. Descriptions are deliberately hedged — none of them claim
// certainty the deterministic engine doesn't actually have.
export const ELIGIBILITY_STATUS_CONFIG: Record<
  EligibilityStatus,
  { variant: 'success' | 'secondary' | 'destructive' | 'warning'; description: string }
> = {
  'Likely Eligible': {
    variant: 'success',
    description: "Meets every criterion this prototype checks. Final approval still depends on the scheme's own verification.",
  },
  'Possibly Eligible': {
    variant: 'secondary',
    description: 'Meets most criteria, but not all — worth a closer look before applying.',
  },
  'Low Match': {
    variant: 'destructive',
    description: "Doesn't currently meet at least one required criterion for this scheme.",
  },
  'Insufficient Information': {
    variant: 'warning',
    description: 'A detail (such as income) is missing, so eligibility can\'t be judged confidently yet.',
  },
}

export function EligibilityStatusBadge({
  status,
  className,
}: {
  status: EligibilityStatus
  className?: string
}) {
  return (
    <Badge variant={ELIGIBILITY_STATUS_CONFIG[status].variant} className={cn(className)}>
      {status}
    </Badge>
  )
}
