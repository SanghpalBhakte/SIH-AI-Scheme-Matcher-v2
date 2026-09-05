// BCP-47 language tags for the Web Speech API (SpeechSynthesisUtterance.lang)
// — pronunciation only, never translation. Each is a standard IETF tag
// (ISO 639-1 language + IN region), the same kind of tag every browser's
// own TTS voice list is keyed by; if a device has no installed voice for
// a given tag the browser falls back to its default voice rather than
// failing, so this never blocks reading aloud — it just improves
// pronunciation where a matching voice exists.
import type { Locale } from './translations'

export const SPEECH_LANG_BY_LOCALE: Record<Locale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  ml: 'ml-IN',
  as: 'as-IN',
}

/**
 * Scheme data itself (name/ministry/summary/benefit/documents/steps —
 * data/schemes.ts) is always in English regardless of UI locale — see
 * the header comment in lib/i18n/translations.ts — so anything reading
 * scheme content aloud must always use English pronunciation too,
 * never the UI's selected locale.
 */
export const SCHEME_CONTENT_SPEECH_LANG = SPEECH_LANG_BY_LOCALE.en
