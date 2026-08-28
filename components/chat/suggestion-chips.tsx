import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Tappable quick-reply chips. Styled with the same badge "outline"
 * recipe used elsewhere in the app, but rendered as real <button>s
 * (not Badge's <div>) so they're keyboard-focusable and clickable —
 * reusing the visual language without borrowing non-interactive markup.
 */
export function SuggestionChips({
  suggestions,
  onSelect,
  disabled,
}: {
  suggestions: string[]
  onSelect: (text: string) => void
  disabled?: boolean
}) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2" role="group" aria-label="Suggested questions">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(s)}
          className={cn(
            badgeVariants({ variant: 'outline' }),
            'shrink-0 cursor-pointer bg-background transition-colors duration-150 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
