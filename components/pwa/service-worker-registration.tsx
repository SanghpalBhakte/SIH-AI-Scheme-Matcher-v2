'use client'

import { useRegisterServiceWorker } from '@/lib/pwa/register-sw'

/** Thin client-component wrapper so the root layout (a Server Component) can mount the service-worker registration hook. Renders nothing. */
export function ServiceWorkerRegistration() {
  useRegisterServiceWorker()
  return null
}
