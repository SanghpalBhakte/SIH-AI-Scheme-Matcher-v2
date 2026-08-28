import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/chat/types'

/**
 * One chat bubble. Bot replies can be multi-line (bullet lists,
 * numbered steps) — whitespace-pre-line renders the engine's literal
 * "\n" line breaks without needing a markdown renderer.
 */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-soft',
          isUser
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm border border-border bg-card text-card-foreground'
        )}
      >
        {message.text}
      </div>
    </div>
  )
}
