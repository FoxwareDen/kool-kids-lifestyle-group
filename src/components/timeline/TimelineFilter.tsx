/**
 * The set of values the timeline can be filtered by.
 * @typedef {"all" | "blog" | "event"} TimelineFilterValue
 */
export type TimelineFilterValue = 'all' | 'blog' | 'event'

/**
 * The selectable filter options, in display order.
 * @type {{ value: TimelineFilterValue, label: string }[]}
 */
const OPTIONS: { value: TimelineFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'blog', label: 'Blogs' },
  { value: 'event', label: 'Events' },
]

/**
 * Props for the {@link TimelineFilter} component.
 * @typedef {Object} TimelineFilterProps
 * @property {TimelineFilterValue} value - The currently active filter.
 * @property {(value: TimelineFilterValue) => void} onChange - Called when a
 *   different filter is selected.
 */

/**
 * A segmented control for filtering the timeline between all entries, blogs
 * only or events only. Styled as a pill group consistent with the site's
 * navy/orange theme.
 *
 * @param {TimelineFilterProps} props - Component props.
 * @returns {JSX.Element} The rendered filter control.
 */
export function TimelineFilter({
  value,
  onChange,
}: {
  value: TimelineFilterValue
  onChange: (value: TimelineFilterValue) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter timeline"
      className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white p-1 shadow-sm shadow-black/5"
    >
      {OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
              active
                ? 'bg-[var(--brand-navy)] text-white'
                : 'text-[var(--brand-navy)]/60 hover:text-[var(--brand-navy)]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
