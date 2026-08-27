'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Circle, ExternalLink } from 'lucide-react'

import { cn } from '@/lib/utils'
import { GENERIC_CHECKLIST_STEPS, type ChecklistStepId } from '@/lib/schemes/checklist'
import type { Scheme } from '@/lib/matching/types'

/**
 * Per-step guidance. Reads only the scheme's OWN requiredDocuments /
 * applicationSteps fields — never invents scheme-specific content.
 * Every branch has a real fallback, so no step is ever a dead end
 * even when the dataset doesn't have scheme-specific detail yet.
 */
function StepDetail({ id, scheme }: { id: ChecklistStepId; scheme: Scheme }) {
  switch (id) {
    case 'check-eligibility':
      return (
        <p className="text-xs text-muted-foreground">
          Confirm you meet this scheme&apos;s eligibility rules on the official source — the match shown on this
          page is a simplified prototype estimate, not a final decision.
        </p>
      )

    case 'prepare-documents':
      return scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
          {scheme.requiredDocuments.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          Scheme-specific documents aren&apos;t catalogued in this prototype yet — check the official source below
          for the current list.
        </p>
      )

    case 'visit-portal':
      return scheme.officialUrl ? (
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          {scheme.officialUrl}
        </a>
      ) : (
        <p className="text-xs text-muted-foreground">No official source link is on file for this entry.</p>
      )

    case 'register-login':
      return (
        <p className="text-xs text-muted-foreground">
          Most portals need an account or login, often linked to Aadhaar or a business registration.
        </p>
      )

    case 'complete-application':
      return scheme.applicationSteps && scheme.applicationSteps.length > 0 ? (
        <ol className="list-decimal space-y-0.5 pl-4 text-xs text-muted-foreground">
          {scheme.applicationSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : (
        <p className="text-xs text-muted-foreground">
          Scheme-specific application steps aren&apos;t catalogued in this prototype yet — the official portal
          will walk you through its own process.
        </p>
      )

    case 'upload-documents':
      return (
        <p className="text-xs text-muted-foreground">
          Upload the documents the portal asks for, in the format and size it accepts.
        </p>
      )

    case 'submit-track':
      return (
        <p className="text-xs text-muted-foreground">
          Submit the application and save any reference or tracking number the portal gives you.
        </p>
      )
  }
}

/**
 * A guided, trackable application checklist for one scheme. Built to
 * be reusable (e.g. a future dashboard or saved-schemes area): it
 * takes only `scheme` and owns its own session-only progress state —
 * no persistence, no wiring beyond that one prop.
 *
 * Progress is deliberately not saved anywhere (no localStorage/
 * sessionStorage/backend) — a page refresh starts the checklist over.
 * That's a simple, honest implementation for this phase, not a bug.
 */
export function ApplicationChecklist({ scheme }: { scheme: Scheme }) {
  const [completed, setCompleted] = useState<ReadonlySet<ChecklistStepId>>(new Set())

  function toggle(id: ChecklistStepId) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const nextStep = GENERIC_CHECKLIST_STEPS.find((step) => !completed.has(step.id))

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {completed.size} of {GENERIC_CHECKLIST_STEPS.length} steps checked off
        </span>
        {scheme.officialUrl && (
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Official application portal
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
      </div>

      {nextStep ? (
        <p className="flex items-center gap-1.5 rounded-md bg-secondary/50 p-2.5 text-xs font-medium text-foreground">
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          Next: {nextStep.label}
        </p>
      ) : (
        <p className="rounded-md bg-success/10 p-2.5 text-xs font-medium text-success">
          Every step is checked off for this session — give everything one more look on the official source before
          you submit.
        </p>
      )}

      <ul className="divide-y divide-border overflow-hidden rounded-md border border-border shadow-soft">
        {GENERIC_CHECKLIST_STEPS.map((step) => {
          const isDone = completed.has(step.id)
          return (
            <li
              key={step.id}
              className={cn('flex gap-3 p-3 transition-colors duration-150', isDone ? 'bg-success/5' : 'hover:bg-secondary/40')}
            >
              <button
                type="button"
                onClick={() => toggle(step.id)}
                aria-pressed={isDone}
                aria-label={`Mark "${step.label}" as ${isDone ? 'not started' : 'completed'}`}
                className="mt-0.5 shrink-0 text-muted-foreground transition-all duration-150 hover:scale-110 hover:text-primary"
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
                ) : (
                  <Circle className="h-5 w-5" aria-hidden />
                )}
              </button>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn('text-sm font-medium', isDone ? 'text-muted-foreground line-through' : 'text-foreground')}>
                    {step.label}
                  </p>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      isDone ? 'bg-success/15 text-success' : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {isDone ? 'Completed' : 'Not started'}
                  </span>
                </div>
                <StepDetail id={step.id} scheme={scheme} />
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-muted-foreground">
        Always verify final eligibility, documents, and application steps on the official source above before you
        submit anything.
      </p>
    </div>
  )
}
