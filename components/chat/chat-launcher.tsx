import { MessageCircle } from 'lucide-react'

/** Collapsed floating launcher button — hidden while the panel is open (see ChatWidget). */
export function ChatLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open AI Assistant chat"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-elevated-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
      <span className="text-sm font-semibold">AI Assistant</span>
    </button>
  )
}
