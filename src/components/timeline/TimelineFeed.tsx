import type { TimelineEntry } from '#/lib/timeline'
import { TimelineEntryCard } from './TimelineEntryCard'
import { TimelineEmptyState } from './TimelineEmptyState'
import { TimelineSkeleton } from './TimelineSkeleton'

/**
 * Props for the {@link TimelineFeed} component.
 * @typedef {Object} TimelineFeedProps
 * @property {TimelineEntry[]} entries - The pre-sorted (newest-first) entries.
 * @property {boolean} [isLoading] - Whether entries are still being fetched.
 * @property {string} [emptyMessage] - Message shown when there are no entries.
 */

/**
 * The body of a timeline page. Renders a vertical, newest-first rail of
 * {@link TimelineEntryCard} items. While loading it shows a {@link
 * TimelineSkeleton}, and when the CMS returns no data it shows a graceful
 * {@link TimelineEmptyState} so the page never looks broken.
 *
 * @param {TimelineFeedProps} props - Component props.
 * @returns {JSX.Element} The rendered feed.
 */
export function TimelineFeed({
  entries,
  isLoading = false,
  emptyMessage,
}: {
  entries: TimelineEntry[]
  isLoading?: boolean
  emptyMessage?: string
}) {
  return (
    <section className="bg-[#f1ede6] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[820px] px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <TimelineSkeleton />
        ) : entries.length === 0 ? (
          <TimelineEmptyState message={emptyMessage} />
        ) : (
          <ol>
            {entries.map((entry, index) => (
              <TimelineEntryCard
                key={`${entry.kind}-${entry.id}`}
                entry={entry}
                isLast={index === entries.length - 1}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
