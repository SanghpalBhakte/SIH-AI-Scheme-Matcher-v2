import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/layout/site-header'
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner'
import { AssessmentProvider } from '@/lib/assessment/assessment-context'

export const metadata: Metadata = {
  title: 'AI Scheme Matcher — SIH26092',
  description:
    'Prototype: AI-assisted matching of government schemes for marginalized entrepreneurs (SIH26092).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <AssessmentProvider>
          <SiteHeader />

          <div className="flex-1">{children}</div>

          <footer className="border-t border-border bg-secondary/50">
            <div className="container py-4">
              <DisclaimerBanner />
            </div>
          </footer>
        </AssessmentProvider>
      </body>
    </html>
  )
}
