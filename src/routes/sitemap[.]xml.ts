import { createFileRoute } from '@tanstack/react-router'
import { fetchTimelineEntries, kindFromSlug } from '#/lib/timeline'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin

        const [events, blogs] = await Promise.all([
          fetchTimelineEntries(kindFromSlug('/events/'), 'en'),
          fetchTimelineEntries(kindFromSlug('/blogs/'), 'en'),
        ])

        const urls = [
          `${origin}/`,
          `${origin}/experiences`,
          `${origin}/events`,
          `${origin}/blogs`,
          `${origin}/contact`,

          ...events.map(
            (entry) => `${origin}/events/${encodeURIComponent(entry.id)}`,
          ),

          ...blogs.map(
            (entry) => `${origin}/blogs/${encodeURIComponent(entry.id)}`,
          ),
        ]

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                        ${urls
                          .map(
                            (url) => `  <url>
                            <loc>${escapeXml(url)}</loc>
                        </url>`,
                          )
                          .join('\n')}
                        </urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        })
      },
    },
  },
})
