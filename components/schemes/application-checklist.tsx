'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Circle, ExternalLink } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'
import { GENERIC_CHECKLIST_STEPS, type ChecklistStepId } from '@/lib/schemes/checklist'
import type { Scheme } from '@/lib/matching/types'

/**
 * Per-step guidance. Reads only the scheme's OWN requiredDocuments /
 * applicationSteps fields — never invents scheme-specific content. The
 * real scheme-specific document/step text stays in English (sourced
 * verbatim from official material — see data/schemes.ts); only the
 * generic surrounding guidance and fallback text is translated.
 * Every branch has a real fallback, so no step is ever a dead end
 * even when the dataset doesn't have scheme-specific detail yet.
 */
function StepDetail({ id, scheme, t }: { id: ChecklistStepId; scheme: Scheme; t: (key: string) => string }) {
  switch (id) {
    case 'check-eligibility':
      return <p className="text-xs text-muted-foreground">{t('checklist.detail.check-eligibility')}</p>

    case 'prepare-documents':
      return scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
          {scheme.requiredDocuments.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">{t('checklist.detail.prepare-documents-fallback')}</p>
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
        <p className="text-xs text-muted-foreground">{t('checklist.detail.visit-portal-fallback')}</p>
      )

    case 'register-login':
      return <p className="text-xs text-muted-foreground">{t('checklist.detail.register-login')}</p>

    case 'complete-application':
      return scheme.applicationSteps && scheme.applicationSteps.length > 0 ? (
        <ol className="list-decimal space-y-0.5 pl-4 text-xs text-muted-foreground">
          {scheme.applicationSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : (
        <p className="text-xs text-muted-foreground">{t('checklist.detail.complete-application-fallback')}</p>
      )

    case 'upload-documents':
      return <p className="text-xs text-muted-foreground">{t('checklist.detail.upload-documents')}</p>

    case 'submit-track':
      return <p className="text-xs text-muted-foreground">{t('checklist.detail.submit-track')}</p>
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
  const { t } = useLanguage()
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
        <span>{t('checklist.stepsChecked', { done: completed.size, total: GENERIC_CHECKLIST_STEPS.length })}</span>
        {scheme.officialUrl && (
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t('checklist.officialPortal')}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
      </div>

      {nextStep ? (
        <p className="flex items-center gap-1.5 rounded-md bg-secondary/50 p-2.5 text-xs font-medium text-foreground">
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          {t('checklist.next', { step: t(`checklist.step.${nextStep.id}`) })}
        </p>
      ) : (
        <p className="rounded-md bg-success/10 p-2.5 text-xs font-medium text-success">{t('checklist.allDone')}</p>
      )}

      <ul className="divide-y divide-border overflow-hidden rounded-md border border-border shadow-soft">
        {GENERIC_CHECKLIST_STEPS.map((step) => {
          const isDone = completed.has(step.id)
          const label = t(`checklist.step.${step.id}`)
          return (
            <li
              key={step.id}
              className={cn('flex gap-3 p-3 transition-colors duration-150', isDone ? 'bg-success/5' : 'hover:bg-secondary/40')}
            >
              <button
                type="button"
                onClick={() => toggle(step.id)}
                aria-pressed={isDone}
                aria-label={t('checklist.markAs', { label, state: isDone ? t('checklist.notStarted') : t('checklist.completed') })}
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
                    {label}
                  </p>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      isDone ? 'bg-success/15 text-success' : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {isDone ? t('checklist.completed') : t('checklist.notStarted')}
                  </span>
                </div>
                <StepDetail id={step.id} scheme={scheme} t={t} />
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-muted-foreground">{t('checklist.footerNote')}</p>
    </div>
  )
}
