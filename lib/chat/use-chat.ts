'use client'

// Chat state hook — the only place that owns the widget's React state
// (open/closed, message history, session memory). Mounted once at the
// root layout (see components/chat/chat-widget.tsx), so this state
// naturally survives client-side navigation between pages without any
// persistence layer: Next.js's App Router keeps a layout's component
// tree mounted across route changes within it. A full page reload does
// reset it, same as the rest of this app's session-only UI state (e.g.
// ApplicationChecklist's progress) — intentional, not a gap.

import { useCallback, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { useAssessment } from '@/lib/assessment/assessment-context'
import { schemes } from '@/data/schemes'
import { buildChatContext } from './context-adapter'
import { answerQuery } from './engine'
import { getQuickSuggestions } from './suggestions'
import type { ChatMessage, ChatSession } from './types'

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text:
    "Hi! I'm your AI Assistant. Ask me about schemes, eligibility, required documents, or how to apply — " +
    "I only use information already in this app, and I'll say when something isn't in the dataset.",
  timestamp: 0,
}

// A visible reply delay purely as a UI affordance (so an instant local
// lookup doesn't feel jarring) — never a real network or model call.
const RESPONSE_DELAY_MS = 450

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useChat() {
  const { profile, isHydrated } = useAssessment()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isTyping, setIsTyping] = useState(false)
  const [session, setSession] = useState<ChatSession>({ lastSchemeId: null, lastIntent: null })

  const context = useMemo(
    () => buildChatContext({ profile, isHydrated, pathname: pathname ?? '', schemes }),
    [profile, isHydrated, pathname]
  )

  const suggestions = useMemo(() => getQuickSuggestions(context, session), [context, session])

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const userMessage: ChatMessage = { id: makeId(), role: 'user', text: trimmed, timestamp: Date.now() }
      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      window.setTimeout(() => {
        const { text: replyText, nextSession } = answerQuery(trimmed, context, session, schemes)
        setSession(nextSession)
        setMessages((prev) => [...prev, { id: makeId(), role: 'bot', text: replyText, timestamp: Date.now() }])
        setIsTyping(false)
      }, RESPONSE_DELAY_MS)
    },
    [context, session, isTyping]
  )

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
    messages,
    isTyping,
    send,
    suggestions,
  }
}
