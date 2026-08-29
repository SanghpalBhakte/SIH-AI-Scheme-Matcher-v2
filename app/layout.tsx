import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
import { SiteFooter } from '@/components/layout/site-footer'
import { ChatWidget } from '@/components/chat/chat-widget'
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration'
import { AssessmentProvider } from '@/lib/assessment/assessment-context'
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/lib/theme/theme-context'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { SavedSchemesProvider } from '@/lib/schemes/saved-schemes-context'

export const metadata: Metadata = {
  title: 'SchemeSetu — SIH26092',
  description:
    'Prototype: AI-assisted matching of government schemes for marginalized entrepreneurs (SIH26092).',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon-192.png',
  },
}

export const viewport = {
  themeColor: '#1c3f73',
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
          <LanguageProvider>
            <SavedSchemesProvider>
              <AssessmentProvider>
                <SiteHeader />

                <div className="flex-1">{children}</div>

                <SiteFooter />

                {/* App-wide floating assistant — see components/chat/chat-widget.tsx.
                    Mounted here (inside AssessmentProvider, outside <main>) so it reads
                    live profile state and persists across route changes without
                    affecting any page's own layout or scroll. */}
                <ChatWidget />
                <ServiceWorkerRegistration />
                {/* Vercel Speed Insights — reports real-user Core Web
                    Vitals from production traffic. A no-op anywhere
                    other than a Vercel deployment (no env vars to
                    configure; it only activates once actually served
                    from Vercel), so it's safe to mount unconditionally
                    here rather than gating it behind NODE_ENV. */}
                <SpeedInsights />
                {/* Vercel Web Analytics — same deal: page-view/visitor
                    counts from production traffic, only from Vercel's
                    edge, no-op and no config anywhere else. */}
                <Analytics />
              </AssessmentProvider>
            </SavedSchemesProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
