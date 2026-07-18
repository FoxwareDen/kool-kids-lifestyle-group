import type { TimelineEntry, TimelineEntryKind } from '#/lib/timeline'
import { TimelineHero } from './TimelineHero'
import { TimelineFeed } from './TimelineFeed'

/**
 * Per-section hero copy and breadcrumb configuration. The blogs route and the
 * events route share the same components and only differ in this framing.
 */
const SECTION_CONFIG: Record<
  TimelineEntryKind,
  {
    crumbLabel: string
    crumbHref: string
    eyebrow: string
    title: string
    subtitle: string
    emptyMessage: string
  }
> = {
  blog: {
    crumbLabel: 'Blog',
    crumbHref: '/blogs',
    eyebrow: 'Stories & Reflections',
    title: 'The Blog Timeline',
    subtitle: 'Every story, newest first.',
    emptyMessage:
      'There’s nothing here just yet. Check back soon for new stories from Prieska.',
  },
  event: {
    crumbLabel: 'Events',
    crumbHref: '/events',
    eyebrow: 'Gatherings & Happenings',
    title: 'The Events Timeline',
    subtitle: 'Every event, newest first.',
    emptyMessage:
      'No events have been scheduled yet. Check back soon for upcoming happenings.',
  },
}

/**
 * Props for the {@link TimelineRenderer} component.
 * @typedef {Object} TimelineRendererProps
 * @property {TimelineEntryKind} section - Which content kind is being shown.
 * @property {TimelineEntry[]} entries - The pre-sorted (newest-first) entries.
 * @property {boolean} [isLoading] - Whether the entries are still loading.
 */

/**
 * The shared page body for the `/blogs` and `/events` index routes. Composes
 * the {@link TimelineHero} and {@link TimelineFeed} so both routes render an
 * identical chronological feed, with only the hero framing and empty-state copy
 * varying per section.
 *
 * @param {TimelineRendererProps} props - Component props.
 * @returns {JSX.Element} The rendered timeline page body.
 */
export function TimelineRenderer({
  section,
  entries,
  isLoading = false,
}: {
  section: TimelineEntryKind
  entries: TimelineEntry[]
  isLoading?: boolean
}) {
  const config = SECTION_CONFIG[section]

  return (
    <main>
      <TimelineHero
        crumbLabel={config.crumbLabel}
        crumbHref={config.crumbHref}
        eyebrow={config.eyebrow}
        title={config.title}
        subtitle={config.subtitle}
      />
      <TimelineFeed
        entries={entries}
        isLoading={isLoading}
        emptyMessage={config.emptyMessage}
      />
    </main>
  )
}
