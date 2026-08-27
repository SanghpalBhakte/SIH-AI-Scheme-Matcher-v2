import { LayoutDashboard } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Placeholder route only. What a (non-admin) user dashboard should
// show — session history? saved/bookmarked schemes? re-run past
// assessments? — hasn't been defined yet (flagged as an open risk in
// the Phase 1 plan). No logic lives here; this just reserves the
// route and nav entry so it's visible in the main flow.
export default function DashboardPage() {
  return (
    <main className="container flex min-h-[60vh] items-center justify-center py-16">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <LayoutDashboard className="mb-2 h-8 w-8 text-muted-foreground" aria-hidden />
          <CardTitle>Dashboard — coming in a later phase</CardTitle>
          <CardDescription>
            Assessment history and saved schemes may live here down the line. For now, the live demo path is
            landing → assessment → recommendations → scheme details.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </main>
  )
}
