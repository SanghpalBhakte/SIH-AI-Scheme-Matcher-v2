// Generic, scheme-independent application checklist. These 7 steps
// describe the general path for applying to any government scheme —
// they are NOT scheme-specific claims, so listing them is never
// "inventing" a scheme's own documents or process. Where a scheme
// really does have requiredDocuments/applicationSteps in the dataset,
// ApplicationChecklist (components/schemes/application-checklist.tsx)
// layers that real data onto the relevant step; otherwise the step
// falls back to this generic guidance plus an honest "not yet
// available" note.

export type ChecklistStepId =
  | 'check-eligibility'
  | 'prepare-documents'
  | 'visit-portal'
  | 'register-login'
  | 'complete-application'
  | 'upload-documents'
  | 'submit-track'

export interface ChecklistStepDefinition {
  id: ChecklistStepId
  label: string
}

export const GENERIC_CHECKLIST_STEPS: ChecklistStepDefinition[] = [
  { id: 'check-eligibility', label: 'Check eligibility' },
  { id: 'prepare-documents', label: 'Prepare documents' },
  { id: 'visit-portal', label: 'Visit official application portal' },
  { id: 'register-login', label: 'Register / log in' },
  { id: 'complete-application', label: 'Complete the application' },
  { id: 'upload-documents', label: 'Upload documents' },
  { id: 'submit-track', label: 'Submit and track' },
]
