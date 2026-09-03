# Handoff to Perplexity: Maharashtra CMEGP added (Sept 2, 2026)

## Quick recap

SchemeSetu (SIH26092) — Next.js/TypeScript app matching Indian entrepreneurs to real government schemes via a deterministic rule engine. No-fabrication rule: every scheme needs a real, sourced official URL and no invented figures. Dataset now has 35 schemes.

## What changed in this task

Researched Maharashtra state schemes under strict evidence rules (official government/department/corporation/PDF sources only — no aggregators, blogs, or news articles for benefit/eligibility figures). Checked three candidates:

- **Annasaheb Patil Arthik Vikas Mahamandal** — real, official, but stays HOLD (from earlier research too): no official source gives a specific loan/subsidy figure, only inconsistent third-party aggregator numbers (₹10L–₹50L range), and its target group is specifically "the Maratha community," which doesn't map cleanly onto this dataset's Category type.
- **Punyashlok Ahilyadevi Holkar Mahila Startup Yojana** — a real, official Maharashtra State Innovation Society (MSInS) women's startup grant, ₹1L–₹25L. Only a single official PDF source was checked (no second corroboration attempted this pass), and it's a competitive/selective grant ("selected ones can get...") rather than a rule-based entitlement — noted as a good future candidate, not added this round.
- **CMEGP (Chief Minister's Employment Generation Programme) — ADDED.** Maharashtra's own state-level equivalent of PMEGP (already in the dataset). Verified directly against the Maharashtra State Khadi & Village Industries Board's own official page: loan up to ₹50L (manufacturing) / ₹10L (services), margin-money subsidy 15%/25% (urban/rural, General) vs. 25%/35% (urban/rural, SC/ST/OBC/Women/Ex-Servicemen/PwD/NER/Hill & Border — represented via the `enhancedSupportFor` field from the last pass, not as a narrower eligibility gate), age 18–45, one beneficiary per family, must not have already availed another central/state subsidy (treated as the first-time-entrepreneur equivalent, same interpretation as the existing PMEGP entry). Currency corroborated three ways: the source's own "running since FY 2019-20 under Maharashtra's New Industrial Policy" statement, a live listing on MAITRI (Maharashtra's official investment-facilitation portal), and its own entry on myscheme.gov.in (India's national scheme portal) — though the latter two couldn't be fetched in full this session (blocked/timeout), so they're corroboration by existence, not by content.

Added 5 new engine-level tests: an eligible Maharashtra applicant matches, an enhanced-tier (SC/woman) Maharashtra applicant also matches, a non-Maharashtra applicant hard-fails state, a non-first-time Maharashtra applicant hard-fails firstTime (no fabricated eligibility), and an unsupported-sector Maharashtra applicant gets an honest soft sector-fail without a fabricated income claim.

Full verification suite passed clean: `tsc --noEmit`, `eslint --max-warnings 0`, `verify:engine`, `verify:chat-engine`, `next build`. Live-checked the new scheme page before delivery.

## One thing worth a second opinion

The application-portal URL: the source page (mskvib.org) references "www.cmegp.gov.in" as where applicants apply, and a search turned up what's very likely the live domain — `maha-cmegp.gov.in` — but every attempt to fetch it directly this session was blocked/timed out, so it was NOT set as a field on the scheme record (only mentioned in a code comment) to avoid presenting an unverified link as confirmed. **Ask**: if you can independently confirm `maha-cmegp.gov.in` is live and is genuinely CMEGP's application portal, that would let a future pass add it as the scheme's `officialUrl`/application link with real confidence.

## No action needed elsewhere

Everything else is implemented, tested, and shipped as described above.
