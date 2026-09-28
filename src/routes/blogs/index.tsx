import BlogRenderer from '#/components/BlogRenderer'
import { fetchTimelineEntries, kindFromSlug } from '#/lib/timeline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
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
        title: 'Blog | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'Read the latest stories, news, insights, and updates from 360 Experiences.',
      },
      {
        property: 'og:title',
        content: 'Blog | 360 Experiences',
      },
      {
        property: 'og:description',
        content:
          'Read the latest stories, news, insights, and updates from 360 Experiences.',
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
        content: 'Blog | 360 Experiences',
      },
      {
        name: 'twitter:description',
        content:
          'Read the latest stories, news, insights, and updates from 360 Experiences.',
      },
    ],
  }),

  component: () => {
    const { entries, lang, slug } = Route.useLoaderData()

    return <BlogRenderer slug={slug} entries={entries} lang={lang} />
  },
})
