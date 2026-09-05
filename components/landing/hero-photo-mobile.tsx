import Image from 'next/image'

// A phone-only counterpart to HeroPhoto (see that file for the full
// reasoning on using real photography here at all). Below the `lg`
// breakpoint this app has always deliberately shown nothing in this
// spot — sizes="0px" on the desktop crossfade means a phone visitor
// fetches zero hero bytes — because this app's actual primary
// audience is on a phone, often on a limited or patchy connection,
// and three rotating photos is real weight to hand them for a purely
// decorative element.
//
// This is the deliberate exception: a single static photo, capped at
// a small fixed render width via `sizes` (not "100vw", which would
// have Next generate a derivative matching the full device width —
// on a wide phone that's meaningfully more bytes for no visible gain,
// since the image itself is still only ~240px on screen). One photo,
// no crossfade, no animation, no client JS — just enough presence to
// answer "who is this for" without repeating the desktop treatment's
// cost. `loading="lazy"` (the next/image default, left unset here on
// purpose) means it only downloads once this section is actually
// close to the viewport, same as everything else non-critical on this
// page.
export function MobileHeroPhoto({ className }: { className?: string }) {
  return (
    <Image
      src="/hero/entrepreneur-portrait.jpg"
      alt="A small-business owner surrounded by the textiles she sells at her own stall"
      width={480}
      height={600}
      sizes="240px"
      className={className}
    />
  )
}
