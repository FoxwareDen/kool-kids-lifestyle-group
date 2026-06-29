import { Newspaper } from 'lucide-react'

/**
 * Props for the {@link TimelineEmptyState} component.
 * @typedef {Object} TimelineEmptyStateProps
 * @property {string} [message] - Optional custom message to display.
 */

/**
 * Minimal, friendly feedback shown when the timeline has no entries to display
 * (for example when the CMS returns no data). Intentionally understated so an
 * empty feed never looks like a broken page.
 *
 * @param {TimelineEmptyStateProps} props - Component props.
 * @returns {JSX.Element} The rendered empty state.
 */
export function TimelineEmptyState({
  message = 'There’s nothing here just yet. Check back soon for new stories and events.',
}: {
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-white/60 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-navy)]/5">
        <Newspaper className="h-6 w-6 text-[var(--brand-navy)]/40" aria-hidden="true" />
      </span>
      <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-[var(--brand-navy)]/60">
        {message}
      </p>
    </div>
  )
}
