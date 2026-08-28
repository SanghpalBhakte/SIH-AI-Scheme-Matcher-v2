// Three bouncing dots inside a bot-style bubble, shown while the local
// engine "thinks" (see RESPONSE_DELAY_MS in lib/chat/use-chat.ts).
export function TypingIndicator() {
  return (
    <div
      className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-3 shadow-soft"
      role="status"
      aria-label="AI Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  )
}
