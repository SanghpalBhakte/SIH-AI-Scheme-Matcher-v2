'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme/theme-context'

/**
 * Header theme toggle. Renders a neutral (light-mode) icon until
 * `mounted` is true, matching the same "don't show client-only state
 * before it's known" rule used elsewhere in this app (isHydrated) —
 * the actual page theme is already correct from the moment of first
 * paint regardless (see the inline script in layout.tsx); this only
 * avoids the icon itself flipping a moment after mount.
 */
export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme()
  const isDark = mounted && theme === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </Button>
  )
}
