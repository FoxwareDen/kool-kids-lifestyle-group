import { useMemo, useState } from 'react'
import type { TimelineEntry } from '#/lib/timeline'
import { TimelineEntryCard } from './TimelineEntryCard'
import { TimelineEmptyState } from './TimelineEmptyState'
import { TimelineFilter, type TimelineFilterValue } from './TimelineFilter'

/**
 * Props for the {@link TimelineFeed} component.
 * @typedef {Object} TimelineFeedProps
 * @property {TimelineEntry[]} entries - The full, pre-sorted list of entries.
 * @property {TimelineFilterValue} [defaultFilter] - Filter to apply on first
 *   render. Defaults to "all".
 */

/**
 * The interactive body of the timeline page. Renders the filter control and a
 * vertical, newest-first rail of {@link TimelineEntryCard} items. Filtering is
 * handled client-side over the already-loaded entries, and a graceful empty
 * state is shown whenever the current filter yields no results.
 *
 * @param {TimelineFeedProps} props - Component props.
 * @returns {JSX.Element} The rendered feed.
 */
export function TimelineFeed({
  entries,
  defaultFilter = 'all',
}: {
  entries: TimelineEntry[]
  defaultFilter?: TimelineFilterValue
}) {
  const [filter, setFilter] = useState<TimelineFilterValue>(defaultFilter)

  const visible = useMemo(
    () =>
      filter === 'all' ? entries : entries.filter((entry) => entry.kind === filter),
    [entries, filter],
  )

  return (
    <section className="bg-[#f1ede6] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-center">
          <TimelineFilter value={filter} onChange={setFilter} />
        </div>

        {visible.length === 0 ? (
          <TimelineEmptyState
            message={
              entries.length === 0
                ? 'There’s nothing here just yet. Check back soon for new stories and events.'
                : 'No entries match this filter yet. Try a different category.'
            }
          />
        ) : (
          <ol>
            {visible.map((entry, index) => (
              <TimelineEntryCard
                key={`${entry.kind}-${entry.id}`}
                entry={entry}
                isLast={index === visible.length - 1}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
