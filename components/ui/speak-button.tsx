'use client'

import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

import { Button } from './button'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

interface SpeakButtonProps {
  /** The text to read aloud. Never fabricated by this component — always whatever the caller already shows on screen. */
  text: string
  /** BCP-47 tag, e.g. 'en-IN' or 'hi-IN' — see lib/i18n/speech-lang.ts. Callers decide this since scheme content always reads in English regardless of UI locale, while translated UI copy should match the selected locale. */
  lang: string
  className?: string
}

/**
 * Read-aloud, via the browser's own built-in Web Speech API
 * (`window.speechSynthesis`) — free, fully client-side, no server
 * round trip and no per-character cost, unlike a cloud TTS API. Built
 * for users who read a regional language more comfortably by ear than
 * on a form/portal full of English/bureaucratic terms.
 *
 * Renders nothing when the API isn't available (older/budget Android
 * WebViews, some in-app browsers) rather than a disabled button that
 * would just confuse — this is a progressive enhancement, never a
 * required step to use the app.
 *
 * Only one utterance plays at a time across the whole page: starting
 * a new one calls speechSynthesis.cancel() first, which stops whatever
 * else is speaking (that button's own onend fires, resetting its icon)
 * — so opening two SpeakButtons never talks over itself.
 */
export function SpeakButton({ text, lang, className }: SpeakButtonProps) {
  const { t } = useLanguage()
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Stop audio that belongs to a screen the user has already left —
  // unmounting (navigating away, or the surrounding list re-rendering
  // with different schemes) while this exact utterance is still the
  // one playing.
  useEffect(() => {
    return () => {
      if (isSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isSupported) return null

  function handleClick() {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const label = isSpeaking ? t('common.stopReading') : t('common.readAloud')

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-pressed={isSpeaking}
      aria-label={label}
      title={label}
      className={cn('shrink-0 text-muted-foreground hover:text-primary', isSpeaking && 'text-primary', className)}
    >
      {isSpeaking ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
    </Button>
  )
}
