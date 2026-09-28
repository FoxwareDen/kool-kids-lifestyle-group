import BlogRenderer from '#/components/BlogRenderer'
import type { Language } from '#/lib/experiences'
import { fetchTimelineEntries, kindFromSlug } from '#/lib/timeline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? 'en',
  }),

  loaderDeps: ({ search: { lang } }) => ({ lang }),

  loader: async ({ location, deps: { lang } }) => {
    const entries = await fetchTimelineEntries(
      kindFromSlug(location.pathname),
      lang,
    )
    return {
      entries,
      lang,
      slug: location.pathname,
    }
  },

  head: () => ({
    meta: [
      {
        title: 'Events & Stories | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'Discover upcoming events, stories, and experiences from 360 Experiences.',
      },
      {
        property: 'og:title',
        content: 'Events & Stories | 360 Experiences',
      },
      {
        property: 'og:description',
        content:
          'Discover upcoming events, stories, and experiences from 360 Experiences.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: 'Events & Stories | 360 Experiences',
      },
      {
        name: 'twitter:description',
        content:
          'Discover upcoming events, stories, and experiences from 360 Experiences.',
      },
    ],
  }),

  component: () => {
    const { entries, lang, slug } = Route.useLoaderData()

    return <BlogRenderer slug={slug} entries={entries} lang={lang} />
  },
})
