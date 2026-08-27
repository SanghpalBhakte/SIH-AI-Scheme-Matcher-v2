'use client'

// Light/dark theme state. Mirrors the same hydration-safety pattern
// already used for assessment persistence (lib/assessment/persistence.ts
// + assessment-context.tsx's isHydrated): the actual color scheme is
// applied to <html> by a synchronous inline script in layout.tsx
// BEFORE React hydrates (see the <script> there) — that's what
// prevents a flash of the wrong theme. This context's React state
// exists only so the toggle button can show the right icon/label and
// let the user change it; it is never the source of truth for how the
// page actually looks (that's the `dark` class on <html>, driven by
// CSS, matching how darkMode: ['class'] is already configured in
// tailwind.config.ts).

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'sih26092.theme'

interface ThemeContextValue {
  theme: Theme
  /** False until the client has read the real stored/system preference — see the doc comment above. */
  mounted: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always starts 'light' so server render and the client's first
  // paint agree — identical reasoning to DEFAULT_DRAFT_PROFILE in
  // assessment-context.tsx. The inline anti-flash script in
  // layout.tsx has already set the *visual* theme correctly before
  // this ever runs; this just catches React's state up to match.
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // storage unavailable — fall back to system preference below
    }
    const initial: Theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    setTheme(initial)
    setMounted(true)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyThemeClass(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable — theme still applies for this page view
    }
  }

  return <ThemeContext.Provider value={{ theme, mounted, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme() must be used within a <ThemeProvider>')
  }
  return ctx
}

/**
 * Source for the blocking inline script rendered in layout.tsx's
 * <head>. Runs before hydration so the correct theme class is present
 * for the very first paint — no flash of the wrong theme. Kept as a
 * plain string (not user data, not interpolated) so it's safe to
 * render via dangerouslySetInnerHTML.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`
