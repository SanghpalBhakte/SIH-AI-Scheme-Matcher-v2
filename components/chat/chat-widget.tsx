'use client'

// App-wide floating AI Assistant. Mounted once in app/layout.tsx (see
// that file), so it appears on every page and its state — open/closed,
// message history, session memory — survives client-side navigation.
//
// This widget is presentation only: all the "intelligence" lives in
// lib/chat/* (context-adapter, intents, engine) and is exercised via
// the useChat() hook. Nothing here calls a model, an API, or any
// remote service — see lib/chat/engine.ts's header comment.

import { useChat } from '@/lib/chat/use-chat'
import { ChatLauncher } from './chat-launcher'
import { ChatPanel } from './chat-panel'

export function ChatWidget() {
  const { isOpen, open, close, messages, isTyping, send, suggestions } = useChat()

  return (
    <>
      {!isOpen && <ChatLauncher onOpen={open} />}
      {isOpen && (
        <ChatPanel messages={messages} isTyping={isTyping} suggestions={suggestions} onSend={send} onClose={close} />
      )}
    </>
  )
}
