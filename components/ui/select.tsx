import * as React from 'react'

import { cn } from '@/lib/utils'

// Plain native <select>, styled to match the other primitives.
// Deliberately not a Radix/shadcn Select — a native element needs no
// extra dependency and is fully accessible out of the box, which is
// the right tradeoff for a prototype's form fields.
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground transition-colors duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

export { Select }
