import Image from 'next/image'

// Real photography, in place of the abstract "hub and spoke" diagram
// MatchMotif used to render here — see the visual-direction brief this
// implements. A single static photo (no carousel, no rotation — see
// the brief's hero-pattern research) of someone doing real,
// recognizable small-business work reads as "grounded, already like
// me" to a first-time visitor deciding whether to trust this site
// with their business details, in a way no diagram can, however
// carefully designed.
//
// Self-hosted under /public/hero (same reasoning as the font-loading
// note in app/layout.tsx — no external asset host at runtime), and
// served through Next's built-in image pipeline for automatic
// format/size negotiation. No `priority`/eager-load on purpose: this
// column is `hidden` below the `lg` breakpoint (see app/page.tsx), and
// native lazy-loading means a phone on a slow connection — this app's
// actual primary audience — never fetches it at all, not even
// partially.
//
// Photo license: Unsplash — free for commercial use, no attribution
// required (unsplash.com/license). Purely representative of the kind
// of person this app serves, not a SchemeSetu user or testimonial —
// never caption or present it as one.
export function HeroPhoto({ className }: { className?: string }) {
  return (
    <Image
      src="/hero/entrepreneur-portrait.jpg"
      alt="A small-business owner surrounded by the textiles she sells at her own stall"
      width={1200}
      height={1200}
      sizes="288px"
      className={className}
    />
  )
}
