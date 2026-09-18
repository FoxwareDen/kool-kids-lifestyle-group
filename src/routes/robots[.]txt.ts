import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url)
        const origin = url.origin

        const robots = `# Public search/research crawling is allowed.
                        User-agent: Googlebot
                        Allow: /

                        User-agent: Bingbot
                        Allow: /

                        # OpenAI search/research
                        User-agent: OAI-SearchBot
                        Allow: /

                        # Block OpenAI training crawler
                        User-agent: GPTBot
                        Disallow: /

                        # Block Anthropic/Claude crawler
                        User-agent: ClaudeBot
                        Disallow: /

                        # Block general/unknown crawlers and scrapers
                        User-agent: *
                        Disallow: /

                        # Private application areas
                        User-agent: Googlebot
                        Disallow: /admin/
                        Disallow: /dashboard/
                        Disallow: /api/

                        User-agent: Bingbot
                        Disallow: /admin/
                        Disallow: /dashboard/
                        Disallow: /api/

                        User-agent: OAI-SearchBot
                        Disallow: /admin/
                        Disallow: /dashboard/
                        Disallow: /api/

                        Sitemap: ${origin}/sitemap.xml
                        `

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        })
      },
    },
  },
})