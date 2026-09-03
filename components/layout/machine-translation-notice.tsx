'use client'

import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

/**
 * Honest in-product notice that the current language's translation
 * hasn't yet had a native-speaker review — see the "Translation
 * quality note" at the top of lib/i18n/translations.ts: English and
 * Hindi were written/reviewed by hand, the other ten locales were
 * AI-generated in one pass. Follows DisclaimerBanner's exact
 * visual/tone pattern (icon + bold title + body, same
 * text-xs/muted-foreground styling) so it reads as part of the same
 * family of honest product disclosures, not a new one-off style.
 *
 * Renders nothing for English or Hindi. Never alters any locale's
 * actual translated content — this is purely an additional notice
 * layered on top of it.
 */
export function MachineTranslationNotice({ className }: { className?: string }) {
  const { t, locale } = useLanguage()
  if (locale === 'en' || locale === 'hi') return null

  return (
    <div className={cn('flex items-start gap-2 text-xs text-muted-foreground', className)}>
      <Languages className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
      <p>
        <strong className="text-foreground">{t('machineTranslation.title')}</strong>{' '}
        {t('machineTranslation.body')}
      </p>
    </div>
  )
}
