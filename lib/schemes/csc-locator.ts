// The official Common Service Centre locator — the government's own
// network of walk-in centres for exactly this kind of task (a village-
// level operator helps fill in and submit government scheme/portal
// applications in person, for a small fixed fee).
//
// Verified live end-to-end (2026-08, via browser navigation, since
// WebFetch is blocked on most .nic.in/.gov.in domains): reached from
// the official https://digitalseva.csc.gov.in/ portal's own "CSC
// Locator" nav link. `findmycsc.nic.in` (the other commonly-cited URL)
// loads a page but its backend lookup calls return HTTP 503 — dead —
// and `register.csc.gov.in` is a different tool (VLE registration, not
// a citizen-facing locator), so neither is used here.
//
// Extracted to its own module 2026-09-06 (previously a local constant
// inside application-checklist.tsx) so the site header's global
// quick-access icon can share the exact same verified URL, after user
// feedback that the locator wasn't discoverable on mobile when it only
// lived one scheme-page-scroll deep inside a specific scheme's
// checklist.
export const CSC_LOCATOR_URL = 'https://locator.csccloud.in/'
