'use client'

// App-wide floating AI Assistant. Mounted once in app/layout.tsx (see
// that file), so it appears on every page and its state — open/closed,
// message history, session memory — survives client-side navigation.
//
// This widget is presentation only: all the "intelligence" lives in
// lib/chat/* (context-adapter, intents, engine) and is exercised via
// the useChat() hook. Nothing here calls a model, an API, or any
// remote service — see lib/chat/engine.ts's header comment.

import { useEffect, useRef } from 'react'

import { useChat } from '@/lib/chat/use-chat'
import { useLanguage } from '@/lib/i18n/language-context'
import { ChatLauncher } from './chat-launcher'
import { ChatPanel } from './chat-panel'

export function ChatWidget() {
  const { isOpen, open, close, messages, isTyping, send, suggestions } = useChat()
  const { t } = useLanguage()
  const launcherRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(isOpen)

  // Return keyboard focus to the launcher button once the panel closes
  // (via its own X button or the Escape key) — otherwise a keyboard
  // user's focus is silently dropped into the page body.
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      launcherRef.current?.focus()
    }
    wasOpen.current = isOpen
  }, [isOpen])

  return (
    <>
      {!isOpen && (
        <ChatLauncher
          ref={launcherRef}
          onOpen={open}
          ariaLabel={t('chat.openAriaLabel')}
          label={t('chat.assistantLabel')}
        />
      )}
      {isOpen && (
        <ChatPanel messages={messages} isTyping={isTyping} suggestions={suggestions} onSend={send} onClose={close} />
      )}
    </>
  )
}
