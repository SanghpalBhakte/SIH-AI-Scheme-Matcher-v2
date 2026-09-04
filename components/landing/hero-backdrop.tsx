import { Landmark, Sprout, TrendingUp } from 'lucide-react'

/**
 * Purely decorative backdrop for the landing page's two bookend
 * sections (hero, closing CTA band) — soft color glows, a faint
 * dot-grid, and a few oversized, low-opacity civic/growth icons. Sits
 * behind the copy/CTA column in the hero (see HeroPhoto for the actual
 * photograph in the other column) and behind the closing CTA band,
 * which has no photo. `variant` swaps the palette so the same layer
 * works on both the light hero surface and the dark primary-colored
 * CTA band.
 *
 * Entirely aria-hidden and non-interactive (`pointer-events-none`) —
 * it never competes with the real content painted on top of it.
 */
export function HeroBackdrop({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={
          isDark
            ? 'absolute -left-16 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl'
            : 'absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl'
        }
      />
      <div
        className={
          isDark
            ? 'absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl'
            : 'absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-accent/10 blur-3xl'
        }
      />
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage: `radial-gradient(${
            isDark ? 'rgba(255,255,255,0.35)' : 'hsl(var(--foreground) / 0.14)'
          } 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <Landmark
        strokeWidth={1}
        className={
          isDark
            ? 'absolute -right-6 -top-10 h-40 w-40 -rotate-12 text-white/[0.06]'
            : 'absolute -right-10 -top-8 h-44 w-44 -rotate-12 text-primary/[0.05]'
        }
      />
      <Sprout
        strokeWidth={1}
        className={
          isDark
            ? 'absolute -bottom-8 left-8 h-32 w-32 rotate-6 text-white/[0.07]'
            : 'absolute -bottom-10 left-6 h-36 w-36 rotate-6 text-accent/[0.08]'
        }
      />
      <TrendingUp
        strokeWidth={1}
        className={
          isDark
            ? 'absolute bottom-10 right-1/4 hidden h-24 w-24 text-white/[0.06] sm:block'
            : 'absolute bottom-8 right-1/4 hidden h-24 w-24 text-primary/[0.05] sm:block'
        }
      />
    </div>
  )
}
