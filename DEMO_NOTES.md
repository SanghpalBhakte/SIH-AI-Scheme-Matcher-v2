# SIH26092 — Live demo notes

Quick reference for whoever is presenting this prototype. Written after the final
demo-hardening pass (August 2026).

## Recommended demo path (~90 seconds)

1. **Landing (`/`)** — "Find the government schemes you're actually eligible for." Point
   out the scheme count and "Start assessment."
2. **Assessment (`/assessment`)** — Don't fill the form live. Scroll (or click "In a
   hurry? Jump to a demo profile") straight to the three demo profile cards and click
   **"Load this profile."** Recommended: **Rural first-time artisan** (SC woman, rural
   Bihar, handicrafts, idea stage) — it produces several 100% "Likely Eligible" matches,
   which reads well on stage.
3. **Recommendations (`/recommendations`)** — Loading a demo profile jumps straight
   here. Narrate the summary strip (schemes shown / strongest match / missing info),
   then the methodology note ("these are AI-assisted, rule-based matches — here's
   exactly what fed the score").
4. **Scheme details (`/schemes/stand-up-india`)** — Click "View details" on the top
   card. Walk through the match explanation (matched/needs verification/not aligned),
   then scroll to the application checklist and check off a step or two live — it's
   genuinely interactive.
5. **Official link** — Click "View official scheme →" to show it's a real, working
   government URL, not a mock.

Total clicks from landing to a fully explained match: **3** (Start assessment → Load
this profile → View details).

## What changed in this pass

- Fixed inconsistent button casing ("Start Assessment" → "Start assessment") to match
  the rest of the app's sentence-case labels.
- Removed a duplicate heading on the scheme details page: the "Why this matches you"
  section heading repeated the phrase that the match explanation itself opens with.
  Renamed the heading to "Match explanation."
- Removed a near-duplicate disclaimer on the incomplete-assessment gate on
  `/recommendations` — the subheading paraphrased the disclaimer banner directly below
  it. Replaced it with a forward-looking sentence instead.
- Added a fast path off that same incomplete-assessment gate ("Or load a demo profile")
  so a presenter who lands there mid-demo isn't stuck with only "finish the assessment."
- Added a "Jump to a demo profile ↓" shortcut on step 1 of the assessment, since the
  demo profile cards sit below the fold on a typical laptop screen (1366×768) and are
  the intended fast path for a live demo.
- Removed "Dashboard" from the main navigation. That route was reachable in one click
  from every page and showed literal placeholder copy ("Dashboard — not yet defined /
  This route is a placeholder"), which is a real risk in front of judges. The route
  itself still exists (direct URL only) and its copy was also softened in case anyone
  lands on it that way.

## Known, intentional limitations (say these proactively if asked)

- **Checklist progress isn't saved.** Checking off steps on a scheme's application
  checklist is session-only by design — a refresh resets it. The assessment profile
  itself *does* persist across refresh (localStorage), so don't confuse the two if a
  judge asks "does this save my progress?" — the answer is "the assessment does, the
  checklist doesn't yet."
- **The disclaimer banner appears twice per page** (once inline near the top of
  content, once in the site footer). This is deliberate, not a bug — the inline one is
  contextual, the footer one is a persistent, unmissable baseline.
- **Two components in `components/schemes/` — `application-readiness.tsx` and
  `next-actions.tsx` — are unused.** They were superseded by `application-checklist.tsx`
  in an earlier phase and were left in place rather than deleted (not wired into any
  route, so they don't affect the demo, but worth knowing they're dead code if someone
  goes looking). Same for `data/applicationGuidance.ts`, which nothing currently
  imports.
- **Only 4 of the 13 schemes are enriched with real, sourced application steps/**
  **documents** (Stand-Up India, PM SVANidhi, PM Vishwakarma, Startup India Seed Fund).
  The other 9 still show an honest "not catalogued yet, check the official source"
  fallback rather than inventing content — don't be surprised if a judge picks an
  unenriched scheme and sees the fallback text; that's correct, not broken. This is why
  the recommended demo profile (rural first-time artisan) is chosen deliberately: its
  top matches lean toward the enriched schemes.

## Verification

Full ritual (tsc, lint, build, scoring-engine self-check, and a scripted Playwright pass
over the whole demo path at 1366×768) was run after this pass — see the delivery
message for the pass/fail summary.
