import type { LucideIcon } from 'lucide-react'

/**
 * Props for the {@link PlanTile} component.
 * @typedef {Object} PlanTileProps
 * @property {LucideIcon} icon - The lucide-react icon component to render.
 * @property {string} label - The tile's caption text.
 * @property {string} [href] - Link target for the tile. Defaults to "#".
 */

/**
 * A minimal outline-style tile showing a centered icon above a short label.
 * Used in the "Everything You Need" grid to link to planning resources such as
 * Accommodation, Dining and Attractions.
 *
 * @param {PlanTileProps} props - Component props.
 * @returns {JSX.Element} The rendered plan tile.
 */
export function PlanTile({
  icon: Icon,
  label,
  href = '#',
}: {
  icon: LucideIcon
  label: string
  href?: string
}) {
  return (
    <a
      href={href}
      className="group flex flex-col items-center justify-center gap-3 border border-[var(--brand-navy)]/15 bg-white px-3 py-7 text-center no-underline transition-colors hover:border-[var(--brand-orange)] hover:bg-[#faf7f2]"
    >
      <Icon
        className="h-7 w-7 text-[var(--brand-navy)] transition-colors group-hover:text-[var(--brand-orange)]"
        strokeWidth={1.5}
      />
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/80">
        {label}
      </span>
    </a>
  )
}
