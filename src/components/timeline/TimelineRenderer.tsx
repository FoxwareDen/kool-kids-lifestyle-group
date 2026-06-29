import type { TimelineEntry } from '#/lib/timeline'
import { TimelineHero } from './TimelineHero'
import { TimelineFeed } from './TimelineFeed'
import type { TimelineFilterValue } from './TimelineFilter'

/**
 * Identifies which section of the site the timeline is being viewed from. This
 * only affects the hero copy and the default filter — the underlying feed is
 * the same combined blogs + events timeline on both routes.
 * @typedef {"blog" | "event"} TimelineSection
 */
export type TimelineSection = 'blog' | 'event'

/**
 * Per-section hero copy and breadcrumb configuration.
 */
const SECTION_CONFIG: Record<
  TimelineSection,
  {
    crumbLabel: string
    crumbHref: string
    eyebrow: string
    title: string
    subtitle: string
    defaultFilter: TimelineFilterValue
  }
> = {
  blog: {
    crumbLabel: 'Blog',
    crumbHref: '/blogs',
    eyebrow: 'Stories & Happenings',
    title: 'The Blog & Events Timeline',
    subtitle: 'Every story and event, newest first.',
    defaultFilter: 'all',
  },
  event: {
    crumbLabel: 'Events',
    crumbHref: '/events',
    eyebrow: 'Stories & Happenings',
    title: 'The Events & Blog Timeline',
    subtitle: 'Every event and story, newest first.',
    defaultFilter: 'all',
  },
}

/**
 * Props for the {@link TimelineRenderer} component.
 * @typedef {Object} TimelineRendererProps
 * @property {TimelineSection} section - Which section the timeline is shown in.
 * @property {TimelineEntry[]} entries - The combined, pre-sorted feed entries.
 */

/**
 * The shared page body for both the `/blogs/timeline` and `/events/timeline`
 * routes. Composes the {@link TimelineHero} and {@link TimelineFeed} so both
 * routes render an identical chronological feed of all blogs and events, with
 * only the hero framing varying per section.
 *
 * @param {TimelineRendererProps} props - Component props.
 * @returns {JSX.Element} The rendered timeline page body.
 */
export function TimelineRenderer({
  section,
  entries,
}: {
  section: TimelineSection
  entries: TimelineEntry[]
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
      <TimelineFeed entries={entries} defaultFilter={config.defaultFilter} />
    </main>
  )
}
