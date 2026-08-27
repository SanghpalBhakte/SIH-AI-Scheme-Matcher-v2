import Link from 'next/link'
import { ArrowRight, ClipboardList, ScanSearch, Sparkles, Landmark } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="container flex flex-col gap-6 py-16 sm:py-20">
          <Badge variant="secondary" className="w-fit">
            SIH26092 · Prototype
          </Badge>

          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
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
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Landmark className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {schemes.length} verified government schemes in the current dataset, each with an official source link.
          </p>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="mb-8 text-lg font-semibold text-foreground">How it works</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <step.icon className="mb-2 h-6 w-6 text-primary" aria-hidden />
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
