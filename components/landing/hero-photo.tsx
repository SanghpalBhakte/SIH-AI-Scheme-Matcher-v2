import Image from 'next/image'

import { cn } from '@/lib/utils'

// Real photography, in place of the abstract "hub and spoke" diagram
// MatchMotif used to render here — see the visual-direction brief this
// implements. Real, recognizable people doing real small-business work
// read as "grounded, already like me" to a first-time visitor deciding
// whether to trust this site with their business details, in a way no
// diagram can, however carefully designed.
//
// This rotates through three photos on a slow, controls-free crossfade
// rather than a single static shot — the brief's own research is what
// argues against carousels, but that finding is about PROMOTIONAL
// carousels: arrows/dots inviting a click, a different message or CTA
// per slide, competing for attention. There's none of that here — no
// controls, no per-photo copy, nothing to interact with or miss by not
// clicking through. It's closer to ambient motion than a carousel, and
// it lets one photo do a job a single portrait can't: showing the
// breadth of who this app is for (a textile seller, a potter, a market
// vendor) instead of picking one "representative" face. Pure CSS (the
// hero-crossfade keyframes in tailwind.config.ts) — no JS state, so
// this stays a server component.
//
// Self-hosted under /public/hero (same reasoning as the font-loading
// note in app/layout.tsx — no external asset host at runtime), served
// through Next's built-in image pipeline for automatic format/size
// negotiation. No `priority` on purpose: native lazy-loading means this
// only downloads once the hero section is actually close to the
// viewport, not on first paint.
//
// Rendered TWICE in app/page.tsx — once sized for the phone-width slot
// between the subtitle and the CTAs, once for the desktop right-hand
// column — rather than one instance reflowed by CSS, because the two
// placements sit in genuinely different spots in the page's DOM order
// (see the comment at each call site). Each instance is told its own
// `sizes`, and each flips to `0px` for the breakpoint the OTHER
// instance owns (mobile's sizes says `0px` above `lg`, desktop's says
// `0px` below it) — so only one of the two ever actually requests
// bytes at a given viewport width, on top of `hidden`/`lg:hidden`
// removing the other from layout entirely. `motion-reduce:`
// pins the first photo in place and drops the animation entirely for
// prefers-reduced-motion, rather than relying on the global
// animation-duration override in globals.css, which — since every
// photo here shares one keyframe set ending on opacity 0 — would
// otherwise leave the whole rotation blank instead of freezing on a
// photo.
//
// Photo licenses: all three are Unsplash — free for commercial use, no
// attribution required (unsplash.com/license). Purely representative of
// the kind of people this app serves, not SchemeSetu users or
// testimonials — never caption or present any of them as one.
const PHOTOS = [
  {
    src: '/hero/entrepreneur-portrait.jpg',
    alt: 'A small-business owner surrounded by the textiles she sells at her own stall',
  },
  {
    src: '/hero/pottery-artisan-portrait.jpg',
    alt: 'A woman shaping a piece of pottery by hand in her workshop',
  },
  {
    src: '/hero/flower-vendor-portrait.jpg',
    alt: 'An elderly flower and fruit seller at her market stall',
  },
] as const

// Negative delays so all three start already staggered across the
// cycle instead of fading in together and holding in sync — see the
// hero-crossfade comment in tailwind.config.ts for the 21s/7s math.
const DELAYS = ['0s', '-7s', '-14s']

export function HeroPhoto({ className, sizes }: { className?: string; sizes: string }) {
  return (
    <div className={className}>
      {PHOTOS.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={1200}
          sizes={sizes}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'opacity-0 motion-safe:animate-hero-crossfade motion-reduce:animate-none',
            i === 0 && 'motion-reduce:opacity-100'
          )}
          style={{ animationDelay: DELAYS[i] }}
        />
      ))}
    </div>
  )
}
