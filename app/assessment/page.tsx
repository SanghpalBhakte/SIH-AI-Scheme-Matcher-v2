'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioOption } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { StartOverButton } from '@/components/assessment/start-over-button'
import { StepIndicator } from '@/components/assessment/step-indicator'
import { useAssessment } from '@/lib/assessment/assessment-context'
import { ASSESSMENT_STEPS } from '@/lib/assessment/steps'
import { demoProfiles } from '@/data/demoProfiles'
import {
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  STAGE_OPTIONS,
  STATE_OPTIONS,
  SECTOR_OPTIONS,
  INCOME_RANGE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  REGISTRATION_STATUS_OPTIONS,
  BUSINESS_NEED_OPTIONS,
  YES_NO_OPTIONS,
  type Category,
  type Gender,
  type BusinessStage,
  type EntrepreneurProfile,
  type BusinessNeed,
} from '@/lib/matching/types'

// Real, typed form fields per step, wired to AssessmentContext.
// Every eligibility-affecting field the matching engine consumes
// (category, gender, state, sector, stage, first-time status) starts
// unselected and requires an explicit choice before the wizard will
// advance — no silent defaults that could produce a recommendation
// the user never actually chose. annualIncomeRange is a documented
// exception ("prefer not to say" is a real answer), and every
// additional field added for the fuller Basic Profile / Business
// Information / Financial Information / Business Needs sections is
// likewise never gated: none of them are consumed by the engine yet
// (see AdditionalProfileDetails in lib/matching/types.ts), so gating
// on them would just be friction with no eligibility purpose.
export default function AssessmentPage() {
  const router = useRouter()
  const { profile, updateProfile, stepIndex, isFirstStep, isLastStep, nextStep, previousStep, loadProfile, isDirty } =
    useAssessment()

  const step = ASSESSMENT_STEPS[stepIndex]

  // Browser-level unsaved-progress warning (refresh, tab/window close,
  // typing a new URL, following an external link). Scoped to this
  // page only — the listener is added/removed as this component
  // mounts/unmounts, so it's never active on any other route, and it
  // never fires for Next.js's own client-side navigation (no real
  // "unload" happens for that, only for genuine browser navigation).
  // Note: browsers show their own fixed wording here, not this string
  // — `returnValue` only needs to be non-empty to trigger the prompt.
  useEffect(() => {
    if (!isDirty) return

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const canAdvance = (() => {
    switch (step.id) {
      case 'basic':
        return profile.category !== '' && profile.gender !== '' && profile.state !== ''
      case 'business':
        return profile.sector !== '' && profile.stage !== '' && profile.firstTimeEntrepreneur !== null
      case 'financial':
        return true
      case 'needs':
        return true
      default:
        return true
    }
  })()

  const helperText: Record<string, string> = {
    basic: 'Select category, gender, and state to continue.',
    business: 'Select sector, business stage, and first-time status to continue.',
  }

  // Text/number inputs collect a value the engine never scores on, so
  // an unparsable or empty number field is just "not provided" — never
  // coerced to 0, which would read as a real, meaningful answer.
  function parseOptionalNumber(raw: string): number | '' {
    if (raw === '') return ''
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? '' : parsed
  }

  function toggleNeed(need: BusinessNeed) {
    const alreadySelected = profile.businessNeeds.includes(need)
    updateProfile({
      businessNeeds: alreadySelected
        ? profile.businessNeeds.filter((n) => n !== need)
        : [...profile.businessNeeds, need],
    })
  }

  function handleNext() {
    if (!canAdvance) return
    if (isLastStep) {
      router.push('/recommendations')
    } else {
      nextStep()
    }
  }

  function handleLoadDemo(demoProfile: EntrepreneurProfile) {
    loadProfile(demoProfile)
    router.push('/recommendations')
  }

  return (
    <main className="container flex flex-col gap-10 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground sm:hidden">
              Step {stepIndex + 1} of {ASSESSMENT_STEPS.length}
            </p>
            <span className="hidden sm:block" />
            <StartOverButton />
          </div>
          <StepIndicator steps={ASSESSMENT_STEPS} currentIndex={stepIndex} />
          {isFirstStep && (
            <a
              href="#demo-profiles"
              className="inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              In a hurry? Jump to a demo profile ↓
            </a>
          )}
        </div>

        <Card className="animate-fade-in-up">
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Step {stepIndex + 1}</p>
            <CardTitle className="font-display text-xl">{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step.id === 'basic' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name (optional)</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => updateProfile({ fullName: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input
                      id="age"
                      type="number"
                      min={0}
                      value={profile.age}
                      onChange={(e) => updateProfile({ age: parseOptionalNumber(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      id="gender"
                      value={profile.gender}
                      onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State</Label>
                    <Select
                      id="state"
                      value={profile.state}
                      onChange={(e) => updateProfile({ state: e.target.value })}
                    >
                      <option value="" disabled>
                        Select your state
                      </option>
                      {STATE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="district">District (optional)</Label>
                    <Input
                      id="district"
                      value={profile.district}
                      onChange={(e) => updateProfile({ district: e.target.value })}
                      placeholder="e.g. Patna"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Rural / Urban (optional)</Label>
                  <RadioGroup>
                    {LOCATION_TYPE_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt}
                        id={`locationType-${opt}`}
                        name="locationType"
                        label={opt}
                        checked={profile.locationType === opt}
                        onChange={() => updateProfile({ locationType: opt })}
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Social / economic category</Label>
                  <Select
                    id="category"
                    value={profile.category}
                    onChange={(e) => updateProfile({ category: e.target.value as Category })}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Disability status (optional)</Label>
                  <RadioGroup>
                    {YES_NO_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt}
                        id={`disabilityStatus-${opt}`}
                        name="disabilityStatus"
                        label={opt}
                        checked={profile.disabilityStatus === opt}
                        onChange={() => updateProfile({ disabilityStatus: opt })}
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="educationLevel">Education level (optional)</Label>
                  <Select
                    id="educationLevel"
                    value={profile.educationLevel}
                    onChange={(e) => updateProfile({ educationLevel: e.target.value as typeof profile.educationLevel })}
                  >
                    <option value="">Select education level</option>
                    {EDUCATION_LEVEL_OPTIONS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            {step.id === 'business' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Business name (optional)</Label>
                  <Input
                    id="businessName"
                    value={profile.businessName}
                    onChange={(e) => updateProfile({ businessName: e.target.value })}
                    placeholder="e.g. Sharma Handicrafts"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="businessType">Business type (optional)</Label>
                  <Select
                    id="businessType"
                    value={profile.businessType}
                    onChange={(e) => updateProfile({ businessType: e.target.value as typeof profile.businessType })}
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="sector">Industry / sector</Label>
                    <Select
                      id="sector"
                      value={profile.sector}
                      onChange={(e) => updateProfile({ sector: e.target.value })}
                    >
                      <option value="" disabled>
                        Select your sector
                      </option>
                      {SECTOR_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stage">Business stage</Label>
                    <Select
                      id="stage"
                      value={profile.stage}
                      onChange={(e) => updateProfile({ stage: e.target.value as BusinessStage })}
                    >
                      <option value="" disabled>
                        Select business stage
                      </option>
                      {STAGE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="yearsInOperation">Years in operation (optional)</Label>
                    <Input
                      id="yearsInOperation"
                      type="number"
                      min={0}
                      value={profile.yearsInOperation}
                      onChange={(e) => updateProfile({ yearsInOperation: parseOptionalNumber(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="numberOfEmployees">Number of employees (optional)</Label>
                    <Input
                      id="numberOfEmployees"
                      type="number"
                      min={0}
                      value={profile.numberOfEmployees}
                      onChange={(e) => updateProfile({ numberOfEmployees: parseOptionalNumber(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="annualTurnoverLakh">Annual turnover, ₹ lakh (optional)</Label>
                    <Input
                      id="annualTurnoverLakh"
                      type="number"
                      min={0}
                      step="0.1"
                      value={profile.annualTurnoverLakh}
                      onChange={(e) => updateProfile({ annualTurnoverLakh: parseOptionalNumber(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="businessLocation">Business location (optional)</Label>
                    <Input
                      id="businessLocation"
                      value={profile.businessLocation}
                      onChange={(e) => updateProfile({ businessLocation: e.target.value })}
                      placeholder="City / town"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="registrationStatus">Registration status (optional)</Label>
                  <Select
                    id="registrationStatus"
                    value={profile.registrationStatus}
                    onChange={(e) =>
                      updateProfile({ registrationStatus: e.target.value as typeof profile.registrationStatus })
                    }
                  >
                    <option value="">Select registration status</option>
                    {REGISTRATION_STATUS_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="firstTime">First-time entrepreneur?</Label>
                  <Select
                    id="firstTime"
                    value={profile.firstTimeEntrepreneur === null ? '' : String(profile.firstTimeEntrepreneur)}
                    onChange={(e) => updateProfile({ firstTimeEntrepreneur: e.target.value === 'true' })}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="true">Yes, this is my first business</option>
                    <option value="false">No, I&apos;ve run a business before</option>
                  </Select>
                </div>
              </>
            )}

            {step.id === 'financial' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="income">Approximate annual income (optional)</Label>
                  <Select
                    id="income"
                    value={profile.annualIncomeRange}
                    onChange={(e) =>
                      updateProfile({ annualIncomeRange: e.target.value as EntrepreneurProfile['annualIncomeRange'] })
                    }
                  >
                    {INCOME_RANGE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="investmentRequiredLakh">Investment required, ₹ lakh (optional)</Label>
                    <Input
                      id="investmentRequiredLakh"
                      type="number"
                      min={0}
                      step="0.1"
                      value={profile.investmentRequiredLakh}
                      onChange={(e) => updateProfile({ investmentRequiredLakh: parseOptionalNumber(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fundingRequirementLakh">Funding required, ₹ lakh (optional)</Label>
                    <Input
                      id="fundingRequirementLakh"
                      type="number"
                      min={0}
                      step="0.1"
                      value={profile.fundingRequirementLakh}
                      onChange={(e) => updateProfile({ fundingRequirementLakh: parseOptionalNumber(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Do you have an existing loan? (optional)</Label>
                  <RadioGroup>
                    {YES_NO_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt}
                        id={`existingLoan-${opt}`}
                        name="existingLoan"
                        label={opt}
                        checked={profile.existingLoan === opt}
                        onChange={() => updateProfile({ existingLoan: opt })}
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label>Do you need credit support? (optional)</Label>
                  <RadioGroup>
                    {YES_NO_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt}
                        id={`creditRequirement-${opt}`}
                        name="creditRequirement"
                        label={opt}
                        checked={profile.creditRequirement === opt}
                        onChange={() => updateProfile({ creditRequirement: opt })}
                      />
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label>Do you need subsidy support? (optional)</Label>
                  <RadioGroup>
                    {YES_NO_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt}
                        id={`subsidyRequirement-${opt}`}
                        name="subsidyRequirement"
                        label={opt}
                        checked={profile.subsidyRequirement === opt}
                        onChange={() => updateProfile({ subsidyRequirement: opt })}
                      />
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {step.id === 'needs' && (
              <div className="space-y-1.5">
                <Label>Select all that apply (optional)</Label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {BUSINESS_NEED_OPTIONS.map((need) => (
                    <label key={need} className="flex items-center gap-2 text-sm text-foreground">
                      <Checkbox checked={profile.businessNeeds.includes(need)} onChange={() => toggleNeed(need)} />
                      {need}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!canAdvance && <p className="text-xs text-warning">{helperText[step.id]}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={previousStep} disabled={isFirstStep} className="group">
              <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canAdvance} className="group">
              {isLastStep ? 'See my recommendations' : 'Next'}
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div id="demo-profiles" className="mx-auto w-full max-w-2xl space-y-3 scroll-mt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          Or jump straight to results with a demo profile
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {demoProfiles.map((demo) => (
            <Card
              key={demo.id}
              className="flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <CardHeader>
                <CardTitle className="text-sm">{demo.label}</CardTitle>
                <CardDescription className="text-xs">{demo.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button size="sm" variant="secondary" className="w-full" onClick={() => handleLoadDemo(demo.profile)}>
                  Load this profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
