import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: { title: string }[]
  currentIndex: number
}

/**
 * Numbered-circle stepper with a connecting rail, replacing the plain
 * linear progress bar. Purely presentational — reads currentIndex,
 * renders nothing interactive, changes no assessment logic or state.
 * Labels are hidden below `sm` to keep the row compact on mobile; the
 * existing "Step X of Y" text above still carries that information.
 */
export function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  const progressPct = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0

  return (
    <div className="relative flex items-start justify-between">
      {/* background rail */}
      <div className="absolute left-4 right-4 top-4 h-0.5 bg-border" aria-hidden />
      {/* filled rail up to the current step */}
      <div
        className="absolute left-4 top-4 h-0.5 bg-primary transition-all duration-500 ease-out"
        style={{ width: `calc((100% - 2rem) * ${progressPct / 100})` }}
        aria-hidden
      />

      {steps.map((step, i) => {
        const isComplete = i < currentIndex
        const isCurrent = i === currentIndex
        return (
          <div key={step.title} className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold transition-colors duration-300',
                isComplete
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isCurrent
                    ? 'border-primary text-primary'
                    : 'border-border text-muted-foreground'
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isComplete ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </div>
            <span
              className={cn(
                'hidden max-w-[6rem] text-center text-[11px] leading-tight sm:block',
                isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
