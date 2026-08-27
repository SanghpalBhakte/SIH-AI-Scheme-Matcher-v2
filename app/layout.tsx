import type { Metadata } from 'next'

// Self-hosted fonts (no external font-CDN request at runtime or build
// time — @fontsource ships the actual font files in the package).
// Only the specific weights actually used are imported, so the
// browser only ever fetches the unicode-range subsets a page needs.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'

import './globals.css'
import { SiteHeader } from '@/components/layout/site-header'
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner'
import { AssessmentProvider } from '@/lib/assessment/assessment-context'
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/lib/theme/theme-context'

export const metadata: Metadata = {
  title: 'AI Scheme Matcher — SIH26092',
  description:
    'Prototype: AI-assisted matching of government schemes for marginalized entrepreneurs (SIH26092).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is required here because the inline
    // script below sets the `dark` class on this element before React
    // hydrates — React would otherwise warn about an attribute it
    // didn't render itself. Nothing else about this element is
    // affected; see lib/theme/theme-context.tsx for the full
    // reasoning.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so the correct theme is already
            applied — no flash of the wrong theme. Static app string,
            not user data. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <AssessmentProvider>
            <SiteHeader />

            <div className="flex-1">{children}</div>

            <footer className="border-t border-border bg-secondary/50">
              <div className="container py-4">
                <DisclaimerBanner />
              </div>
            </footer>
          </AssessmentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
