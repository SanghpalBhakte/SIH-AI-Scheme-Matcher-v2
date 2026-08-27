/**
 * The hero's one distinctive visual — a flat, geometric "hub and
 * spoke" diagram: a central profile node connected to several scheme
 * nodes, with one resolved as a confirmed match. Deliberately NOT a
 * neural-net/brain/glowing-orb motif (the generic "AI product" cliché
 * this pass is meant to avoid) — it reads as a structured, legible
 * diagram, closer to an org chart than a sci-fi visualization, which
 * fits a rule-based matching engine much more honestly anyway.
 *
 * Pure inline SVG, no image assets, no animation library — the only
 * motion (a slow, subtle line-draw on mount) is plain CSS and is
 * skipped entirely under prefers-reduced-motion via globals.css.
 */
export function MatchMotif({ className }: { className?: string }) {
  const center = { x: 200, y: 200 }
  const nodes = [
    { x: 200, y: 56, matched: false },
    { x: 322, y: 128, matched: true },
    { x: 322, y: 272, matched: false },
    { x: 200, y: 344, matched: false },
    { x: 78, y: 272, matched: false },
    { x: 78, y: 128, matched: false },
  ]

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Diagram of one applicant profile connecting to several government scheme options, with one confirmed as a match"
    >
      {/* connecting spokes */}
      <g className="text-primary/25 dark:text-primary/35" stroke="currentColor" strokeWidth="1.5">
        {nodes.map((n, i) => (
          <line key={i} x1={center.x} y1={center.y} x2={n.x} y2={n.y} />
        ))}
      </g>

      {/* outer ring for rhythm, very faint */}
      <circle
        cx={center.x}
        cy={center.y}
        r="144"
        className="text-border"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 6"
        fill="none"
      />

      {/* scheme nodes */}
      {nodes.map((n, i) =>
        n.matched ? (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="22" className="text-accent" fill="currentColor" />
            <path
              d={`M ${n.x - 8} ${n.y} l 5 5 l 11 -11`}
              className="text-accent-foreground"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        ) : (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="14"
            className="text-primary/40 dark:text-primary/50"
            stroke="currentColor"
            strokeWidth="1.75"
            fill="hsl(var(--card))"
          />
        )
      )}

      {/* center: the applicant's profile */}
      <circle cx={center.x} cy={center.y} r="34" className="text-primary" fill="currentColor" />
      <circle cx={center.x} cy={center.y - 6} r="9" className="text-primary-foreground" fill="currentColor" />
      <path
        d={`M ${center.x - 15} ${center.y + 18} a 15 12 0 0 1 30 0 z`}
        className="text-primary-foreground"
        fill="currentColor"
      />
    </svg>
  )
}
