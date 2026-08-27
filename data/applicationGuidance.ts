// Reserved for a later phase (Application Guidance Checklist — a core
// feature, but explicitly out of scope for Phase 1). Nothing reads
// this file yet. It exists now so `Scheme.requiredDocuments` /
// `Scheme.applicationSteps` (lib/matching/types.ts) have a documented
// home once real per-scheme guidance content is written, without a
// breaking type change at that point.

export interface ApplicationGuidance {
  schemeId: string
  requiredDocuments: string[]
  applicationSteps: string[]
}

export const applicationGuidance: ApplicationGuidance[] = []
