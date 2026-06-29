import { createFileRoute } from '@tanstack/react-router'
import { fetchTimeline } from '#/lib/timeline'
import { TimelineRenderer } from '#/components/timeline/TimelineRenderer'

/**
 * The `/events/timeline` route. Loads the combined blogs + events feed (newest
 * first) and renders the shared {@link TimelineRenderer} framed as the events
 * section. CMS failures resolve to an empty feed for a graceful empty state.
 */
export const Route = createFileRoute('/events/timeline')({
  head: () => ({
    meta: [
      {
        title: 'Timeline | Events | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'A chronological timeline of the latest events and blog posts from Prieska and the 360 Experiences team, newest first.',
      },
    ],
  }),
  loader: async () => {
    const entries = await fetchTimeline()
    return { entries }
  },
  component: EventsTimelinePage,
})

/**
 * Renders the events timeline page using the shared renderer.
 *
 * @returns {JSX.Element} The rendered page.
 */
function EventsTimelinePage() {
  const { entries } = Route.useLoaderData()
  return <TimelineRenderer section="event" entries={entries} />
}
