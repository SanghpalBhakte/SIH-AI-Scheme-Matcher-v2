'use client'

import Link from 'next/link'
import { ArrowRight, ClipboardList, ScanSearch, Sparkles, Landmark, ShieldCheck, ScrollText, Scale } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MatchMotif } from '@/components/landing/match-motif'
import { schemes } from '@/data/schemes'
import { useLanguage } from '@/lib/i18n/language-context'

const STEPS = [
  { icon: ClipboardList, titleKey: 'landing.step1Title', descKey: 'landing.step1Desc' },
  { icon: ScanSearch, titleKey: 'landing.step2Title', descKey: 'landing.step2Desc' },
  { icon: Sparkles, titleKey: 'landing.step3Title', descKey: 'landing.step3Desc' },
] as const

const TRUST_SIGNALS = [
  { icon: Scale, titleKey: 'landing.trust1Title', descKey: 'landing.trust1Desc' },
  { icon: ShieldCheck, titleKey: 'landing.trust2Title', descKey: 'landing.trust2Desc' },
  { icon: ScrollText, titleKey: 'landing.trust3Title', descKey: 'landing.trust3Desc' },
] as const

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="container grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              {t('landing.eyebrow')}
            </Badge>

            <h1 className="font-display max-w-2xl text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
              {t('landing.heroTitle')}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{t('landing.heroSubtitle')}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/assessment">
                  {t('landing.ctaStart')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/assessment#demo-profiles">{t('landing.ctaDemo')}</Link>
              </Button>
            </div>

            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <Landmark className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t('landing.schemeCount', { count: schemes.length })}
              </span>
              <Link href="/schemes" className="font-medium text-primary underline-offset-4 hover:underline">
                {t('landing.browseAll')}
              </Link>
            </p>
          </div>

          <div className="hidden justify-self-center lg:block">
            <MatchMotif className="h-72 w-72 animate-fade-in-up" />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/40">
        <div className="container grid gap-6 py-8 sm:grid-cols-3">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.titleKey} className="flex items-start gap-3">
              <signal.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {signal.titleKey === 'landing.trust2Title' ? t(signal.titleKey, { count: schemes.length }) : t(signal.titleKey)}
                </p>
                <p className="text-xs text-muted-foreground">{t(signal.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <h2 className="font-display mb-8 text-2xl font-semibold text-foreground">{t('landing.howItWorks')}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Card
              key={step.titleKey}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-base">{t(step.titleKey)}</CardTitle>
                <CardDescription>{t(step.descKey)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
