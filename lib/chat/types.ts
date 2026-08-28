// Shared types for the local, rule-based AI Assistant chatbot. Nothing
// here calls a model or a remote service — see lib/chat/engine.ts for
// the deterministic query engine these types support.

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp: number
}

/** Every question category the deterministic engine can recognize. */
export type IntentId =
  | 'eligible_schemes'
  | 'recommendation_reason'
  | 'scheme_explanation'
  | 'scheme_benefits'
  | 'scheme_eligibility'
  | 'required_documents'
  | 'application_steps'
  | 'next_action'
  | 'general_help'
  | 'unknown'

/**
 * Minimal conversational memory kept for the current session only (see
 * lib/chat/use-chat.ts) — enough to resolve "this scheme" / "it" to the
 * last scheme discussed, without any server-side or persisted state.
 */
export interface ChatSession {
  lastSchemeId: string | null
  lastIntent: IntentId | null
}
