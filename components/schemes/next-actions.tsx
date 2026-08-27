import { ExternalLink, FileCheck, ShieldCheck, Send } from 'lucide-react'

// Concrete next steps for a user reading a scheme's details. The two
// steps that map to a real action (visiting the official source) are
// links when officialUrl exists; the other two are guidance text, not
// something this prototype can perform on the user's behalf.
export function NextActions({ officialUrl }: { officialUrl: string | null }) {
  const items = [
    {
      icon: ExternalLink,
      text: 'Review the official source for this scheme',
      href: officialUrl ?? undefined,
    },
    {
      icon: ShieldCheck,
      text: "Verify your final eligibility directly with the scheme's official channel",
    },
    {
      icon: FileCheck,
      text: 'Prepare the documents the official source asks for',
    },
    {
      icon: Send,
      text: 'Proceed to the official application site when ready',
      href: officialUrl ?? undefined,
    },
  ]

  return (
    <ol className="space-y-2.5 text-sm">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <item.icon className="h-3 w-3" aria-hidden />
          </span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              {item.text}
            </a>
          ) : (
            <span className="text-muted-foreground">{item.text}</span>
          )}
        </li>
      ))}
    </ol>
  )
}
