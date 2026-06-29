import { createFileRoute } from '@tanstack/react-router'
import { fetchTimeline } from '#/lib/timeline'
import { TimelineRenderer } from '#/components/timeline/TimelineRenderer'

/**
 * The `/blogs/timeline` route. Loads the combined blogs + events feed (newest
 * first) and renders the shared {@link TimelineRenderer} framed as the blog
 * section. CMS failures resolve to an empty feed for a graceful empty state.
 */
export const Route = createFileRoute('/blogs/timeline')({
  head: () => ({
    meta: [
      {
        title: 'Timeline | Blog | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'A chronological timeline of the latest blog posts and events from Prieska and the 360 Experiences team, newest first.',
      },
    ],
  }),
  loader: async () => {
    const entries = await fetchTimeline()
    return { entries }
  },
  component: BlogsTimelinePage,
})

/**
 * Renders the blogs timeline page using the shared renderer.
 *
 * @returns {JSX.Element} The rendered page.
 */
function BlogsTimelinePage() {
  const { entries } = Route.useLoaderData()
  return <TimelineRenderer section="blog" entries={entries} />
}
