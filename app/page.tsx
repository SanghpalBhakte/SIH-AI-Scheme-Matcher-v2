import Link from 'next/link'
import { ArrowRight, ClipboardList, ScanSearch, Sparkles, Landmark, ShieldCheck, ScrollText, Scale } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MatchMotif } from '@/components/landing/match-motif'
import { schemes } from '@/data/schemes'

const steps = [
  {
    icon: ClipboardList,
    title: '1. Share your profile',
    description: 'Category, gender, state, sector, business stage, and a couple of quick eligibility questions.',
  },
  {
    icon: ScanSearch,
    title: '2. Rule-based matching',
    description: 'A transparent, deterministic scoring engine checks your profile against every scheme — no guessing.',
  },
  {
    icon: Sparkles,
    title: '3. Explainable recommendations',
    description: 'See your top matches, why each one fits (or doesn’t), and the official next step to apply.',
  },
]

const trustSignals = [
  { icon: Scale, label: 'Rule-based, not a black box', detail: 'Every score traces back to a documented eligibility rule.' },
  { icon: ShieldCheck, label: `${schemes.length} verified schemes`, detail: 'Real Government of India programmes only — no invented data.' },
  { icon: ScrollText, label: 'Official sources linked', detail: 'Every scheme links back to the government page that defines it.' },
]

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="container grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              SIH26092 · Prototype
            </Badge>

            <h1 className="font-display max-w-2xl text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
              Find the government schemes you&apos;re actually eligible for
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Built for women, SC/ST, OBC, rural, low-income, and first-time entrepreneurs. Answer a short
              profile, and get ranked, explainable scheme recommendations backed by a transparent rule-based
              matching engine — not a chatbot guessing on your behalf.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/assessment">
                  Start assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/assessment#demo-profiles">See a live demo profile</Link>
              </Button>
            </div>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Landmark className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {schemes.length} verified government schemes in the current dataset, each with an official source link.
            </p>
          </div>

          <div className="hidden justify-self-center lg:block">
            <MatchMotif className="h-72 w-72 animate-fade-in-up" />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/40">
        <div className="container grid gap-6 py-8 sm:grid-cols-3">
          {trustSignals.map((t) => (
            <div key={t.label} className="flex items-start gap-3">
              <t.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <h2 className="font-display mb-8 text-2xl font-semibold text-foreground">How it works</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.title}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-base">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
