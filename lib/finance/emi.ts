import type { Scheme } from '@/lib/matching/types'

/**
 * General-purpose EMI (Equated Monthly Instalment) calculator — pure
 * math, no external data. Deliberately does NOT prefill or guess an
 * interest rate, tenure, or loan amount for any specific scheme: real
 * government-scheme loans are disbursed through individual banks/NBFCs
 * that set their own rates case by case (see data/schemes.ts's own
 * comment on Stand-Up India for the same point about document
 * requirements). Presenting a made-up "typical rate" here would be
 * exactly the kind of fabricated fact this codebase avoids everywhere
 * else — so every input is left for the user to enter themselves.
 */
export interface EmiResult {
  /** Equated monthly instalment, rounded to the nearest rupee. */
  emi: number
  /** Total amount repaid over the full tenure. */
  totalPayment: number
  /** Total interest paid over the full tenure. */
  totalInterest: number
}

/**
 * @param principal Loan amount in rupees. Must be > 0.
 * @param annualRatePercent Annual interest rate as a percentage (e.g. 10 for 10%). May be 0.
 * @param tenureMonths Loan tenure in months. Must be > 0.
 */
export function calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number): EmiResult | null {
  if (!(principal > 0) || !(tenureMonths > 0) || annualRatePercent < 0 || !Number.isFinite(principal) || !Number.isFinite(annualRatePercent) || !Number.isFinite(tenureMonths)) {
    return null
  }

  const monthlyRate = annualRatePercent / 12 / 100
  let emi: number

  if (monthlyRate === 0) {
    emi = principal / tenureMonths
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths)
    emi = (principal * monthlyRate * factor) / (factor - 1)
  }

  const totalPayment = emi * tenureMonths
  const totalInterest = totalPayment - principal

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  }
}

/**
 * Whether a scheme's benefit is loan-based (vs. a pure grant/subsidy/
 * equity benefit) — used only to decide whether to surface a link to
 * the EMI calculator on that scheme's page. Deterministic keyword check
 * against the scheme's own real `benefit` text, nothing inferred.
 */
export function isLoanBased(scheme: Pick<Scheme, 'benefit'>): boolean {
  return /\bloan\b/i.test(scheme.benefit)
}
