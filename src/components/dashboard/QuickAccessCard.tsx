import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * A single metadata pill shown at the bottom of a {@link QuickAccessCard}.
 */
export type QuickAccessMeta = {
  /** Icon rendered before the count. */
  icon: LucideIcon
  /** Text label (usually a count, e.g. "12 items"). */
  label: string
}

/**
 * Navigable "space" card for the quick-access grid.
 *
 * Each card links to a dashboard section and surfaces a couple of at-a-glance
 * counts. The whole card is a single link target for an easy, obvious click
 * area — no nested interactive elements.
 *
 * @param to - Destination route path.
 * @param search - Optional search params for the destination route.
 * @param title - Card heading.
 * @param description - Short explanation of the section.
 * @param icon - Icon shown in the card's colored header block.
 * @param meta - Up to a few metadata pills (e.g. counts).
 */
export function QuickAccessCard({
  to,
  search,
  title,
  description,
  icon: Icon,
  meta = [],
}: {
  to: string
  search?: Record<string, unknown>
  title: string
  description: string
  icon: LucideIcon
  meta?: QuickAccessMeta[]
}) {
  return (
    <Link
      to={to as string}
      search={search as never}
      className="group flex flex-col overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] transition-colors hover:border-[var(--brand-orange)]"
    >
      {/* Colored header block echoes the reference "folder" tiles. */}
      <div className="flex items-center justify-between bg-[var(--sand)] px-5 py-6">
        <span className="flex size-11 items-center justify-center rounded-sm bg-[var(--surface-strong)] text-[var(--brand-orange)]">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <ArrowRight className="size-5 text-[var(--sea-ink-soft)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--brand-orange)]" />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-base font-bold text-[var(--sea-ink)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{description}</p>

        {meta.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-3">
            {meta.map((m) => {
              const MetaIcon = m.icon
              return (
                <span
                  key={m.label}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--sea-ink-soft)]"
                >
                  <MetaIcon className="size-3.5" aria-hidden="true" />
                  {m.label}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </Link>
  )
}
