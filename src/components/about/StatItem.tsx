import type { LucideIcon } from 'lucide-react'

/**
 * Props for the {@link StatItem} component.
 * @typedef {Object} StatItemProps
 * @property {LucideIcon} icon - Icon shown above the statistic.
 * @property {string} value - The headline figure (e.g. "150+").
 * @property {string} label - Short description of what the figure represents.
 */

/**
 * A single key figure displayed inside the {@link StatsBand}. Renders an
 * orange icon, a large serif number and a muted caption, centered in a column.
 *
 * @param {StatItemProps} props - Component props.
 * @returns {JSX.Element} The rendered statistic.
 */
export function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]">
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <p className="display-title mt-4 text-4xl font-semibold text-white sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
        {label}
      </p>
    </div>
  )
}
