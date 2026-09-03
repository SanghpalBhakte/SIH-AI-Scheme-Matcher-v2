// Client-side-only persistence for ApplicationChecklist progress.
// Mirrors the same two established local-persistence patterns used
// elsewhere in this app rather than inventing a third:
//
//  - Versioned, field-validated read/write, safe-discard-on-any-mismatch
//    — same shape as lib/assessment/persistence.ts.
//  - isHydrated-safe usage from the component: read only inside a
//    client-only useEffect, never during the initial render (see
//    lib/schemes/saved-schemes-context.tsx) — so server render and the
//    client's first paint always agree (an empty checklist), and the
//    real stored progress is restored a moment later. That's the
//    component's job (components/schemes/application-checklist.tsx);
//    this file only owns the storage read/write itself.
//
// Keyed PER SCHEME ID (one applicant can be partway through several
// schemes' checklists at once) — never a single shared key.

import { GENERIC_CHECKLIST_STEPS, type ChecklistStepId } from './checklist'

const STORAGE_KEY_PREFIX = 'sih26092.checklist.'

// Bump this whenever the persisted shape changes. A mismatch causes
// loadPersistedChecklist to discard the stored progress outright rather
// than attempt a blind migration — same reasoning as
// lib/assessment/persistence.ts's STORAGE_VERSION.
const STORAGE_VERSION = 1

const VALID_STEP_IDS = new Set<string>(GENERIC_CHECKLIST_STEPS.map((step) => step.id))

function storageKey(schemeId: string): string {
  return `${STORAGE_KEY_PREFIX}${schemeId}`
}

// Field-by-field runtime shape check — same discipline as
// isValidDraftProfile() in lib/assessment/persistence.ts. Also guards
// against a stale step id from a prior version of GENERIC_CHECKLIST_STEPS
// (rather than trusting it and rendering an unknown step as "done").
function isValidCompletedSteps(value: unknown): value is ChecklistStepId[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string' && VALID_STEP_IDS.has(v))
}

/**
 * Reads and validates the persisted checklist progress for one scheme.
 * Returns null on ANY problem — nothing stored, unparsable JSON, a
 * version bump, or a shape that doesn't match — so the caller always
 * gets a clean "nothing usable was stored" signal rather than a
 * partially-trusted set. Never throws.
 */
export function loadPersistedChecklist(schemeId: string): ReadonlySet<ChecklistStepId> | null {
  if (typeof window === 'undefined') return null

  let raw: string | null
  try {
    raw = window.localStorage.getItem(storageKey(schemeId))
  } catch {
    return null // storage unavailable (private mode, disabled, quota, etc.)
  }
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null // corrupt JSON — discard rather than guess at repair
  }

  if (typeof parsed !== 'object' || parsed === null) return null
  const candidate = parsed as Record<string, unknown>

  if (candidate.version !== STORAGE_VERSION) return null
  if (!isValidCompletedSteps(candidate.completed)) return null

  return new Set(candidate.completed)
}

/** Persists checklist progress for one scheme. Silently no-ops if storage is unavailable. */
export function savePersistedChecklist(schemeId: string, completed: ReadonlySet<ChecklistStepId>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      storageKey(schemeId),
      JSON.stringify({ version: STORAGE_VERSION, completed: [...completed] })
    )
  } catch {
    // storage full/unavailable — persistence is a nice-to-have, never fatal
  }
}

/** Clears persisted progress for one scheme — e.g. if a "reset checklist" action is ever added. */
export function clearPersistedChecklist(schemeId: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(storageKey(schemeId))
  } catch {
    // ignore
  }
}
