# Handoff to Perplexity: eligibility-schema gap fix (Sept 2, 2026)

## Quick recap

SchemeSetu (SIH26092) — Next.js/TypeScript app matching Indian entrepreneurs to real government schemes via a deterministic rule engine (no ML/LLM in the matching path). No-fabrication rule: every scheme needs a real, sourced official URL and no invented figures. Dataset now has 34 schemes.

## What changed in this task

This was a code/architecture task, not new scheme research — no scheme facts were touched or re-verified.

The matcher's `Category` type only ever had `General/OBC/SC/ST`, so it couldn't represent two real, officially-eligible groups already showing up in the dataset: Minorities and Persons with Disabilities (Delhi's Composite Loan Scheme lists both alongside SC/ST/OBC), and it had no structured way to say "this scheme gives MORE support to women/minority/PwD founders without restricting who's eligible" (Gujarat's higher women's stipend, AP's ₹20L tier for underrepresented founders).

Fixed with two new, fully optional, backward-compatible fields:
- `Scheme.additionalEligibleGroups?: ('Minority'|'PwD')[]` — extra ways to pass the category criterion, alongside `categories` (an OR, not instead of).
- `Scheme.enhancedSupportFor?: {group, detail}[]` — purely informational, never read by the matching engine, so it can never cause a false hard-block or misrepresent "extra support" as "exclusive."

On the profile side: `EntrepreneurProfile.specialGroups?: SpecialGroup[]`, derived from two new Yes/No intake questions (`minorityStatus`, mirroring the existing `disabilityStatus`) via a new `deriveSpecialGroups()` helper, wired into all 3 places the app scores a profile (recommendations page, dashboard/saved-schemes page, chat assistant's context adapter).

Migrated 3 existing scheme records to use the new fields (Delhi Composite Loan Scheme, AP Startup Grant, Gujarat Startup Scheme) — no other schemes changed. Added a new Yes/No "Minority status (optional)" field to the assessment wizard (Step 1, same pattern as the existing disability question), translated into all 12 supported languages. Bumped the localStorage draft-profile version (v1→v2) since the draft shape changed — old in-progress drafts get cleanly discarded rather than guessed at.

Full verification suite passed clean: `tsc --noEmit`, `eslint --max-warnings 0`, `verify:engine` (6 new assertions: minority applicant matches, PwD applicant matches, an applicant claiming neither still hard-fails, enhancedSupportFor never blocks a general applicant), `verify:chat-engine`, `next build`. Live-checked the rendered scheme pages and the new wizard field before delivery.

## One architecture judgment call worth a second opinion

The brief asked for "separate optional flags rather than overloading caste category" — done: `specialGroups`/`additionalEligibleGroups` are separate fields from `Category`, never new enum values on it. The open question is a level below that: should Minority/PwD matches surface as part of the EXISTING `category` criterion (widened match condition, same weight, same "exactly 7 criteria" structure) — what was built — or as a WHOLLY SEPARATE new criterion?

I chose to widen the existing `category` criterion rather than add a new one, for a specific reason: Delhi's real eligibility rule is "SC/ST/OBC OR Minority OR PwD" — a single OR gate. Modeling it as two independently-hard-failing criteria (category AND a new specialEligibility criterion) would have been a real bug: a General-category applicant who IS a Minority would fail "category" (General isn't SC/ST/OBC) and pass the new criterion, but since the engine treats every failed hard-criterion as independently disqualifying, they'd still get wrongly forced to "Low Match" despite being genuinely eligible. Widening the existing criterion preserves the OR semantics correctly and keeps the "every scheme has exactly 7 criteria" structural invariant untouched, at the cost of folding the "why matched" explanation into the same criterion label rather than a distinctly-named one. **Ask**: does this trade-off seem right, or would you weigh it differently — e.g. is there a scheme profile where an applicant genuinely needs BOTH a category match AND a special-group match (an AND, not an OR) that this design would get wrong?

## No action needed

Everything else — the field additions, translations, the 3 scheme migrations, tests — is implemented, tested, and shipped. Flagging the judgment call above for awareness/second opinion only.
