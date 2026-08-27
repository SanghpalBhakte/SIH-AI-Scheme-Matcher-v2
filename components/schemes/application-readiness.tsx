import { FileCheck2, ListOrdered, ShieldQuestion } from 'lucide-react'

import type { Scheme } from '@/lib/matching/types'

// "Am I ready to apply?" section. `requiredDocuments` and
// `applicationSteps` are reserved fields on Scheme that are currently
// undefined for every scheme in the dataset (see the doc comment on
// Scheme in lib/matching/types.ts) — this component shows an honest
// "not yet available" state for either one rather than inventing
// scheme-specific documents or steps that were never verified.
export function ApplicationReadiness({ scheme }: { scheme: Scheme }) {
  const hasDocuments = !!scheme.requiredDocuments && scheme.requiredDocuments.length > 0
  const hasSteps = !!scheme.applicationSteps && scheme.applicationSteps.length > 0

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <FileCheck2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          Required documents
        </p>
        {hasDocuments ? (
          <ul className="mt-1.5 space-y-1 pl-5 text-xs text-muted-foreground">
            {scheme.requiredDocuments!.map((doc) => (
              <li key={doc} className="list-disc">
                {doc}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 rounded-md border border-dashed border-border p-2.5 text-xs text-muted-foreground">
            Not yet available in this prototype. Check the official source below for the current document list.
          </p>
        )}
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <ListOrdered className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          Application steps
        </p>
        {hasSteps ? (
          <ol className="mt-1.5 space-y-1 pl-5 text-xs text-muted-foreground">
            {scheme.applicationSteps!.map((step) => (
              <li key={step} className="list-decimal">
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-1.5 rounded-md border border-dashed border-border p-2.5 text-xs text-muted-foreground">
            Not yet available in this prototype. The official source below has the current application process.
          </p>
        )}
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <ShieldQuestion className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          Before you apply
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          The eligibility rules on this page are a simplified model for this prototype, not the full official
          criteria. Confirm exact conditions — required income proof, documentation, and any application
          windows — on the scheme&apos;s official source before applying.
        </p>
      </div>
    </div>
  )
}
