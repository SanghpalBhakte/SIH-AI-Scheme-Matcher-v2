'use client'

import { useEffect } from 'react'

/**
 * Registers public/sw.js once, client-side only, after the page has
 * loaded (so it never competes with the initial page load for
 * bandwidth/CPU). No-ops silently in browsers/contexts without
 * `serviceWorker` support (older Safari, some in-app webviews) — PWA
 * install is a progressive enhancement, never a requirement to use the
 * app.
 */
export function useRegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    function register() {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-fatal: the app works fully online without a service
        // worker, it just won't cache for offline use.
      })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
      return () => window.removeEventListener('load', register)
    }
  }, [])
}
