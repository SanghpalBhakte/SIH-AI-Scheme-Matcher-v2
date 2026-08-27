'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAssessment } from '@/lib/assessment/assessment-context'
import { cn } from '@/lib/utils'

interface StartOverButtonProps {
  className?: string
}

/**
 * Lets the user intentionally discard their in-progress draft (and its
 * persisted localStorage record — see lib/assessment/persistence.ts)
 * and restart the assessment cleanly. Reuses resetAssessment() from
 * AssessmentContext, which already clears the draft profile, the step
 * index, and storage together — no new persistence logic here.
 *
 * Confirmation uses the same native window.confirm() pattern already
 * used for the in-app unsaved-changes guard in site-header.tsx: one
 * destructive action, no new dialog primitive needed, and it's
 * accessible/mobile-friendly for free.
 *
 * Always navigates to /assessment on confirm — even when triggered
 * from /recommendations or a scheme details page — so no stale
 * recommendation/detail state (computed from the now-reset profile)
 * is left on screen even for one render.
 *
 * Hidden entirely when the draft is already untouched (isDirty is
 * false): there's nothing to discard yet, and showing a confirmation
 * prompt for a no-op reset would just be noise.
 */
export function StartOverButton({ className }: StartOverButtonProps) {
  const router = useRouter()
  const { resetAssessment, isDirty } = useAssessment()

  if (!isDirty) return null

  function handleClick() {
    const confirmed = window.confirm(
      'Start over? This clears your saved answers and restarts the assessment from the beginning.'
    )
    if (!confirmed) return
    resetAssessment()
    router.push('/assessment')
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn('text-muted-foreground hover:text-foreground', className)}
    >
      <RotateCcw className="h-3.5 w-3.5" aria-hidden />
      Start over
    </Button>
  )
}
