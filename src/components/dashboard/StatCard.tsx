import type { LucideIcon } from 'lucide-react'

/**
 * Compact metric tile used in the dashboard stats row.
 *
 * Shows a label, a large value, a supporting caption, and an icon. Designed to
 * sit inside a responsive grid; it fills the width of its grid cell.
 *
 * @param label - Short metric name (e.g. "Experiences").
 * @param value - The primary number or string to emphasise.
 * @param caption - Secondary line describing the metric.
 * @param icon - Icon rendered in the top-right corner.
 */
export function StatCard({
  label,
  value,
  caption,
  icon: Icon,
}: {
  label: string
  value: string | number
  caption: string
  icon: LucideIcon
}) {
  return (
    <div className="flex flex-col rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-[var(--sea-ink-soft)]">{label}</p>
        <Icon className="size-5 text-[var(--brand-orange)]" aria-hidden="true" />
      </div>
      <p className="mt-3 text-4xl font-bold tabular-nums text-[var(--sea-ink)]">{value}</p>
      <p className="mt-2 text-xs text-[var(--sea-ink-soft)]">{caption}</p>
    </div>
  )
}
