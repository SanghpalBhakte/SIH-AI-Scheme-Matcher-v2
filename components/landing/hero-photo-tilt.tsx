'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Wraps the hero photo (and its approval stamp — see approval-stamp.tsx)
 * in a subtle pointer-following 3D tilt, like holding a printed photo
 * in your hand and turning it slightly toward the light. Deliberately
 * gentle (±5deg) — this is meant to read as "the photo has weight and
 * depth," not a gimmick you'd notice before you notice the photo.
 *
 * A wrapper around HeroPhoto rather than a change to it, on purpose:
 * HeroPhoto is a server component (its own crossfade is pure CSS, no JS
 * state — see its own comment on why that matters), and this effect
 * genuinely needs pointer events, so the interactivity lives here
 * instead of forcing HeroPhoto to become a client component too.
 *
 * Two guards, both load-bearing, not just nice-to-haves:
 *  - `(pointer: fine)` — only a mouse/trackpad "hovers" in the way this
 *    effect assumes; on a touchscreen (this app's primary device, per
 *    its own audience) there's no continuous pointer position to follow,
 *    so the listener is never attached at all rather than firing once
 *    per tap in a way that would look broken.
 *  - `prefers-reduced-motion` — checked once on mount; if set, this
 *    renders the photo completely inert, no listener attached.
 * Both checked via matchMedia before adding any listener, not via a CSS
 * media query alone, since the tilt itself is applied as an inline
 * transform (it has to track a continuous pointer position, which CSS
 * alone can't do) — see reset() for how the tilt is cleared again.
 */
export function HeroPhotoTilt({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const enabledRef = useRef<boolean | null>(null)

  function isEnabled() {
    if (enabledRef.current === null) {
      enabledRef.current =
        typeof window !== 'undefined' &&
        window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return enabledRef.current
  }

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (!isEnabled() || !rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    // -0.5..0.5 across each axis, so the resting/center position is 0
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rootRef.current.style.transform = `perspective(900px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`
  }

  function reset() {
    if (rootRef.current) rootRef.current.style.transform = ''
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn('relative [transition:transform_0.3s_ease-out] [transform-style:preserve-3d]', className)}
    >
      {children}
    </div>
  )
}
