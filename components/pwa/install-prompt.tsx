'use client'

import { useEffect, useState } from 'react'
import { Download, Check } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/language-context'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Footer install button — progressive enhancement only. Hidden by
 * default; appears only once the browser fires `beforeinstallprompt`
 * (meaning the manifest + service worker + HTTPS install criteria are
 * already met), and switches to a static "Installed" label after
 * `appinstalled` fires. Placed in the footer rather than the header to
 * avoid re-crowding the mobile header row (see site-header.tsx's own
 * notes on that).
 */
export function InstallPrompt() {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    function onInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) {
    return (
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Check className="h-3.5 w-3.5" aria-hidden />
        {t('pwa.installed')}
      </span>
    )
  }

  if (!deferredPrompt) return null

  return (
    <button
      type="button"
      onClick={async () => {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') setInstalled(true)
        setDeferredPrompt(null)
      }}
      className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      {t('pwa.install')}
    </button>
  )
}
