import { TimelineRenderer } from '#/components/timeline/TimelineRenderer'
import type { TimelineEntry } from '#/lib/timeline'
import { kindFromSlug } from '#/lib/timeline'

/**
 * Props for the {@link BlogRenderer} component.
 * @typedef {Object} BlogRendererProps
 * @property {string} slug - The active route slug/pathname (e.g. "/blogs" or
 *   "/events"). Determines which CMS getter is used to populate the timeline.
 */

/**
 * Shared entry point for the blogs and events index routes. It reads the route
 * slug to decide which content kind to load — `/events` pulls events via the
 * event getter and `/blogs` pulls posts via the blog getter (both from
 * `lib/blog`) — then renders that data as a chronological, newest-first
 * timeline using the reusable {@link TimelineRenderer}.
 *
 * Data is fetched with React Query (already wired through the router) so there
 * is no `useEffect` fetching, and CMS failures surface as a graceful empty
 * state rather than an error.
 *
 * @param {BlogRendererProps} props - Component props.
 * @returns {JSX.Element} The rendered timeline page for the active section.
 */
function BlogRenderer({
  lang = 'en',
  entries,
  slug,
}: {
  entries: TimelineEntry[]
  lang?: 'en' | 'af'
  slug: string
}) {
  const kind = kindFromSlug(slug)

  return (
    <TimelineRenderer
      section={kind}
      entries={entries}
      isLoading={false}
      lang={lang}
    />
  )
}

export default BlogRenderer
