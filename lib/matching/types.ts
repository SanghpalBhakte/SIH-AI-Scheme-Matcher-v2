// Core data model for the recommendation engine.
// Keep this the single source of truth for shapes shared between
// the matching engine, the mock data, and the UI.

export type Category = 'General' | 'OBC' | 'SC' | 'ST'
export type Gender = 'Woman' | 'Man' | 'Transgender'
export type BusinessStage = 'Idea' | 'Early' | 'Growth' | 'Established'
export type IncomeRange = '' | 'below-1l' | '1-3l' | '3-5l' | '5-8l' | 'above-8l'

// --- Additional intake fields (collected, not yet consumed by the engine) ---
// These back the fuller Basic Profile / Business Information / Financial
// Information / Business Needs sections of the assessment. None of them
// feed lib/matching/engine.ts today — see the doc comment on
// AdditionalProfileDetails below for why, and DraftEntrepreneurProfile
// for how they're combined with the fields the engine does consume.
export type LocationType = 'Rural' | 'Urban'
export type YesNo = 'Yes' | 'No'
export type EducationLevel = 'Below 10th' | '10th Pass' | '12th Pass' | 'Diploma' | 'Graduate' | 'Postgraduate' | 'Other'
export type BusinessType =
  | 'Sole Proprietorship'
  | 'Partnership'
  | 'LLP'
  | 'Private Limited Company'
  | 'Self-Help Group (SHG)'
  | 'Cooperative'
  | 'Not registered yet'
export type RegistrationStatus = 'Not Registered' | 'Applied / In Process' | 'Registered (Udyam)' | 'Registered (Other)'
export type BusinessNeed =
  | 'Startup funding'
  | 'Business expansion'
  | 'Working capital'
  | 'Equipment purchase'
  | 'Skill development'
  | 'Training'
  | 'Market access'
  | 'Women entrepreneurship support'
  | 'Rural entrepreneurship support'
  | 'Technology adoption'
  | 'Employment generation'
  | 'Loan/subsidy support'

export interface EntrepreneurProfile {
  category: Category
  gender: Gender
  state: string
  sector: string
  stage: BusinessStage
  firstTimeEntrepreneur: boolean
  /** Optional. Empty string = "prefer not to say" / unknown. */
  annualIncomeRange: IncomeRange
}

/**
 * Fields collected by the fuller assessment form (Basic Profile /
 * Business Information / Financial Information / Business Needs) that
 * lib/matching/engine.ts does NOT currently read.
 *
 * These are collected honestly for the record and for a future
 * scoring/guidance phase, but none of them influence matchScore or
 * eligibilityStatus today — wiring any of them into scoring without a
 * reviewed weighting/criteria change would be fake eligibility logic
 * dressed up as a form field. Every field here is optional to advance
 * the wizard: `''` / `[]` / `null` all mean "not provided," which is a
 * legitimate, honest answer for a field the engine never required.
 */
export interface AdditionalProfileDetails {
  // Step 1 — Basic Profile (category/gender/state live on the engine
  // fields below; this is everything else in that section).
  fullName: string
  age: number | ''
  district: string
  locationType: LocationType | ''
  disabilityStatus: YesNo | ''
  educationLevel: EducationLevel | ''

  // Step 2 — Business Information (sector/stage live on the engine
  // fields below; this is everything else in that section).
  businessName: string
  businessType: BusinessType | ''
  yearsInOperation: number | ''
  numberOfEmployees: number | ''
  annualTurnoverLakh: number | ''
  businessLocation: string
  registrationStatus: RegistrationStatus | ''

  // Step 3 — Financial Information (annualIncomeRange lives on the
  // engine fields below; this is everything else in that section).
  investmentRequiredLakh: number | ''
  existingLoan: YesNo | ''
  fundingRequirementLakh: number | ''
  creditRequirement: YesNo | ''
  subsidyRequirement: YesNo | ''

  // Step 4 — Business Needs (multi-select; no gating, empty = none selected yet).
  businessNeeds: BusinessNeed[]
}

/**
 * The in-progress profile held by the assessment wizard: every
 * eligibility-affecting field the engine consumes (category, gender,
 * state, sector, stage, firstTimeEntrepreneur) starts unselected
 * (`''` / `null`) — no silent defaults, because a scheme match computed
 * from a value the user never actually chose would be misleading —
 * plus every additional field the fuller assessment form collects
 * (see AdditionalProfileDetails), none of which gate the wizard.
 *
 * `annualIncomeRange` is the one engine field that's an exception:
 * `''` there is a real, honest answer ("prefer not to say"), not a
 * placeholder for "unset".
 *
 * Use `isProfileComplete()` to narrow this down before handing it to
 * the matching engine.
 */
export interface DraftEntrepreneurProfile extends AdditionalProfileDetails {
  category: Category | ''
  gender: Gender | ''
  state: string
  sector: string
  stage: BusinessStage | ''
  /** null = not yet explicitly answered (neither "yes" nor "no"). */
  firstTimeEntrepreneur: boolean | null
  annualIncomeRange: IncomeRange
}

/**
 * A DraftEntrepreneurProfile once every engine-relevant field has been
 * explicitly answered. Used (rather than EntrepreneurProfile directly)
 * as the isProfileComplete() predicate type so the narrowing stays
 * structurally valid — it's the same shape as DraftEntrepreneurProfile
 * with the engine fields narrowed to their completed types, so it's
 * still assignable to EntrepreneurProfile and can be passed straight
 * into matchSchemes().
 */
export type CompleteAssessmentProfile = AdditionalProfileDetails & EntrepreneurProfile

/**
 * True only once every eligibility-affecting field has been
 * explicitly set. Doubles as a type guard: once this returns true,
 * TypeScript narrows the draft to a `CompleteAssessmentProfile`
 * (structurally an `EntrepreneurProfile` plus the additional,
 * engine-independent fields).
 */
export function isProfileComplete(draft: DraftEntrepreneurProfile): draft is CompleteAssessmentProfile {
  return (
    draft.category !== '' &&
    draft.gender !== '' &&
    draft.state !== '' &&
    draft.sector !== '' &&
    draft.stage !== '' &&
    draft.firstTimeEntrepreneur !== null
  )
}

/**
 * A government scheme in the dataset.
 *
 * IMPORTANT (product rule): every real scheme must carry a real,
 * identifiable `officialUrl`. `isDemo: true` is reserved for
 * placeholder schemes that are NOT real government programs — those
 * must be labelled "DEMO SCHEME — NOT AN OFFICIAL GOVERNMENT SCHEME"
 * everywhere they're shown. The bundled dataset currently contains
 * only real, sourced schemes (isDemo: false throughout).
 */
export interface Scheme {
  id: string
  name: string
  isDemo: boolean
  /**
   * Administering ministry/department, when there's one clean, citable
   * answer. Display-only — never used by the matching engine. Left
   * undefined rather than guessed for schemes implemented by state
   * governments or multiple agencies (e.g. Udyogini), so the UI can
   * honestly show "if available" instead of a fabricated attribution.
   */
  ministry?: string
  /** Category codes this scheme targets, or ['Any'] if unrestricted. */
  categories: string[]
  /** Genders this scheme targets, or ['Any'] if unrestricted. */
  genders: string[]
  /** States this scheme is available in, or ['All'] if nationwide. */
  states: string[]
  /** Business sectors this scheme targets, or ['Any'] if unrestricted. */
  sectors: string[]
  /** Business stages this scheme targets, or ['Any'] if unrestricted. */
  stages: string[]
  firstTimeOnly: boolean
  /** Max eligible annual income in lakh INR, or null if uncapped. */
  maxIncomeLakh: number | null
  benefit: string
  summary: string
  /** Required unless isDemo is true. */
  officialUrl: string | null
  /**
   * Real, sourced document/step lists, populated only for a small,
   * deliberately curated set of schemes (see data/schemes.ts) where an
   * official government source explicitly stated them — never
   * inferred or guessed. Undefined for every other scheme; the UI
   * (components/schemes/application-checklist.tsx) shows an honest
   * "not yet available" fallback rather than treating undefined as
   * "this scheme has no documents/steps."
   */
  requiredDocuments?: string[]
  applicationSteps?: string[]
  /**
   * ISO date (YYYY-MM-DD) requiredDocuments/applicationSteps were last
   * checked against sourceUrl. Set only alongside those two fields —
   * display-only metadata, never used by the matching engine.
   */
  lastVerified?: string
  /**
   * The specific official page/document requiredDocuments and/or
   * applicationSteps were verified against — may differ from
   * officialUrl (the general application/homepage link), since the
   * source that documents the process is sometimes a guidelines PDF
   * or a press release rather than the portal's homepage.
   */
  sourceUrl?: string
}

export type EligibilityStatus =
  | 'Likely Eligible'
  | 'Possibly Eligible'
  | 'Low Match'
  | 'Insufficient Information'

export interface CriterionResult {
  key: 'category' | 'gender' | 'state' | 'sector' | 'stage' | 'firstTime' | 'income'
  label: string
}

export interface SchemeMatchResult {
  scheme: Scheme
  /** 0-100, deterministic weighted score. */
  matchScore: number
  eligibilityStatus: EligibilityStatus
  matchedCriteria: CriterionResult[]
  missingCriteria: CriterionResult[]
  failedCriteria: CriterionResult[]
}

export const CATEGORY_OPTIONS: Category[] = ['General', 'OBC', 'SC', 'ST']
export const GENDER_OPTIONS: Gender[] = ['Woman', 'Man', 'Transgender']
export const STAGE_OPTIONS: BusinessStage[] = ['Idea', 'Early', 'Growth', 'Established']

// `state` and `sector` are plain strings on EntrepreneurProfile (not
// literal unions) since the dataset may grow this list over time —
// these are just the options offered in the assessment form's selects.
export const STATE_OPTIONS: string[] = [
  'Andhra Pradesh',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Other',
]
export const SECTOR_OPTIONS: string[] = [
  'Manufacturing',
  'Services',
  'Trading',
  'Agriculture',
  'Food Processing',
  'Handicrafts',
  'Technology',
]
export const INCOME_RANGE_OPTIONS: { value: IncomeRange; label: string; representativeLakh: number | null }[] = [
  { value: '', label: 'Prefer not to say', representativeLakh: null },
  { value: 'below-1l', label: 'Below ₹1 lakh / year', representativeLakh: 0.5 },
  { value: '1-3l', label: '₹1 – 3 lakh / year', representativeLakh: 2 },
  { value: '3-5l', label: '₹3 – 5 lakh / year', representativeLakh: 4 },
  { value: '5-8l', label: '₹5 – 8 lakh / year', representativeLakh: 6.5 },
  { value: 'above-8l', label: 'Above ₹8 lakh / year', representativeLakh: 10 },
]

// --- Option lists for the additional (engine-independent) intake fields ---
export const LOCATION_TYPE_OPTIONS: LocationType[] = ['Rural', 'Urban']
export const YES_NO_OPTIONS: YesNo[] = ['Yes', 'No']
export const EDUCATION_LEVEL_OPTIONS: EducationLevel[] = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Graduate',
  'Postgraduate',
  'Other',
]
export const BUSINESS_TYPE_OPTIONS: BusinessType[] = [
  'Sole Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited Company',
  'Self-Help Group (SHG)',
  'Cooperative',
  'Not registered yet',
]
export const REGISTRATION_STATUS_OPTIONS: RegistrationStatus[] = [
  'Not Registered',
  'Applied / In Process',
  'Registered (Udyam)',
  'Registered (Other)',
]
export const BUSINESS_NEED_OPTIONS: BusinessNeed[] = [
  'Startup funding',
  'Business expansion',
  'Working capital',
  'Equipment purchase',
  'Skill development',
  'Training',
  'Market access',
  'Women entrepreneurship support',
  'Rural entrepreneurship support',
  'Technology adoption',
  'Employment generation',
  'Loan/subsidy support',
]
