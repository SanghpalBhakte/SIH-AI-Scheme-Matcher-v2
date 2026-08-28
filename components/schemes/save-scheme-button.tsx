'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSavedSchemes } from '@/lib/schemes/saved-schemes-context'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

interface SaveSchemeButtonProps {
  schemeId: string
  /** 'icon' for a compact icon-only button (cards); 'label' shows text too (scheme details page). */
  variant?: 'icon' | 'label'
  className?: string
}

/**
 * One reusable bookmark toggle, used on RecommendationCard, the scheme
 * browser, and the scheme details page — a single source of truth for
 * "how saving looks and behaves" rather than three ad-hoc buttons.
 * Reads/writes only through SavedSchemesContext; never touches the
 * matching engine or assessment state.
 */
export function SaveSchemeButton({ schemeId, variant = 'icon', className }: SaveSchemeButtonProps) {
  const { isSaved, toggleSaved, isHydrated } = useSavedSchemes()
  const { t } = useLanguage()
  const saved = isHydrated && isSaved(schemeId)

  if (variant === 'label') {
    return (
      <Button
        type="button"
        variant={saved ? 'secondary' : 'outline'}
        onClick={() => toggleSaved(schemeId)}
        aria-pressed={saved}
        className={cn('gap-1.5', className)}
      >
        {saved ? <BookmarkCheck className="h-4 w-4 text-accent" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
        {saved ? t('common.schemeSaved') : t('common.saveScheme')}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => toggleSaved(schemeId)}
      aria-pressed={saved}
      aria-label={saved ? t('common.schemeSaved') : t('common.saveScheme')}
      className={cn('shrink-0 text-muted-foreground hover:text-accent', saved && 'text-accent', className)}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden /> : <Bookmark className="h-4 w-4" aria-hidden />}
    </Button>
  )
}
