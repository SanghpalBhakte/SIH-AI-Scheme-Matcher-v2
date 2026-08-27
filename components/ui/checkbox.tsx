import * as React from 'react'

import { cn } from '@/lib/utils'

// Plain native checkbox input, styled — same reasoning as select.tsx:
// no Radix dependency needed for a prototype form control.
const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'h-4 w-4 shrink-0 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  )
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
