// Single source of truth for scoring weights and status thresholds.
// Change these to retune the engine — nothing else needs to change.

export const MATCH_WEIGHTS = {
  category: 20,
  gender: 10,
  state: 15,
  sector: 20,
  stage: 15,
  firstTime: 10,
  income: 10,
} as const

export const TOTAL_WEIGHT = Object.values(MATCH_WEIGHTS).reduce((a, b) => a + b, 0)

/** Score thresholds (0-100) used once no hard-fail is present. */
export const SCORE_THRESHOLDS = {
  likelyEligible: 75,
  possiblyEligible: 45,
} as const

/**
 * If the total weight of criteria we couldn't evaluate (missing profile
 * data, e.g. income not provided) exceeds this share of TOTAL_WEIGHT,
 * and nothing has hard-failed, we report "Insufficient Information"
 * instead of guessing.
 *
 * Currently only `income` (weight 10) can ever be "missing" — every
 * other profile field is required by the form. Set below 0.10 so that
 * a single unprovided income figure is enough to trigger this status
 * on schemes with an income cap; raise it if more optional fields are
 * added later and a single gap shouldn't be enough on its own.
 */
export const INSUFFICIENT_INFO_MISSING_SHARE = 0.05
