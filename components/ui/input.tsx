import * as React from 'react'

import { cn } from '@/lib/utils'

// Plain native text/number input, styled to match select.tsx — same
// reasoning: no extra dependency needed for a prototype form control.
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
