import { cn } from '@/lib/utils'

/**
 * The hero's one signature element — a rubber-stamp "seal of approval"
 * that lands on the corner of the hero photo, like a real ink stamp on
 * an official document. Added 2026-09-09 as the distinctive, memorable
 * moment the homepage was missing: everything else on the page (card
 * grids with an icon + title + description, `hover:-translate-y-0.5`)
 * is a perfectly good, calm workhorse pattern, but not a single thing a
 * visitor would describe to someone else afterward. This is that thing
 * — and it's not decoration for its own sake: "an official stamp of
 * approval" is *the* visual shorthand for this app's actual pitch
 * ("rule-based, not a black box" — see landing.trust1Title) in a way
 * that's instantly legible before anyone reads a word of copy.
 *
 * Deliberately icon-only, no text in the ring. A text stamp ("VERIFIED"
 * or "सत्यापित") would only read correctly in whichever one language
 * it's set in — wrong instinct for an app whose whole feature list
 * leads with 12-language support. Shape, color, and a checkmark carry
 * "official and approved" without picking a language for the visitor.
 *
 * Pure CSS/SVG — no canvas, no WebGL, nothing heavier than the
 * `hero-crossfade` animation HeroPhoto already ships (see
 * tailwind.config.ts for the `stamp-down` keyframes). `motion-safe:`
 * plays the stamp-down animation; `motion-reduce:` (and any other
 * browser without support) just renders it already landed at its
 * resting tilt — same pattern HeroPhoto uses for its own crossfade.
 * Server component: no interactivity of its own, only pure CSS classes.
 */
export function ApprovalStamp({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none [transform-style:preserve-3d] motion-reduce:rotate-[-8deg]',
        'motion-safe:animate-stamp-down',
        className
      )}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_6px_14px_rgb(0_0_0_/_0.18)]">
        {/* Outer ring: civic gold, dashed like a stamp's inked rim */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeDasharray="3.5 5" />
        {/* Inner disc: primary green, the app's own "approved" color everywhere else in the UI */}
        <circle cx="60" cy="60" r="44" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="hsl(var(--primary-foreground) / 0.35)" strokeWidth="1.5" />
        {/* Checkmark */}
        <path
          d="M40 61 L53 74 L82 44"
          fill="none"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
