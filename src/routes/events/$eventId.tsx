import { getEvent } from '#/lib/blog'
import { useQuery } from '@tanstack/react-query'
import { resolveTranslatable } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import type { Language, PageBlock } from '#/lib/experiences'
import { TimelineHero } from '#/components/timeline/TimelineHero'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'

export const Route = createFileRoute('/events/$eventId')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: search.lang as Language,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang: lang || 'en' }),
  loader: async ({ params: { eventId }, deps: { lang } }) => {
    const result = await getEvent(eventId)

    if (!result.success || !result.value)
      throw Error('Failed to fetch event page data')

    return { eventId, lang, data: result.value }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { data, lang } = loaderData
    const title = resolveTranslatable(data.title, lang)

    const startDate = data.startDate.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const endDate = data.endDate.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const dateDisplay =
      startDate === endDate ? startDate : `${startDate} – ${endDate}`

    const seoTitle = `${title} | 360 Experiences`
    const description = `${title} — ${dateDisplay}. Join us for this special experience.`

    return {
      meta: [
        {
          title: seoTitle,
        },
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: seoTitle,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'event',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:title',
          content: seoTitle,
        },
        {
          name: 'twitter:description',
          content: description,
        },
      ],
    }
  },
  errorComponent: () => {
    return (
      <main className="flex min-h-[70svh] flex-col items-center justify-center bg-[#f4efe7] px-6 text-center">
        <h1 className="text-2xl font-medium text-[var(--brand-navy)]">
          Event not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-[var(--brand-navy)]/60">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/events"
          className="mt-6 inline-block bg-[var(--brand-orange)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--brand-orange-deep)]"
        >
          Back to events
        </a>
      </main>
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { lang, data } = Route.useLoaderData()

  const title = resolveTranslatable(data.title, lang)
  const startDate = data.startDate.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const endDate = data.endDate.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dateDisplay =
    startDate === endDate ? startDate : `${startDate} – ${endDate}`

  return (
    <main className="bg-[#f4efe7]">
      <TimelineHero
        crumbLabel="Events"
        crumbHref="/events"
        eyebrow={`Event • ${dateDisplay}`}
        title={title}
        subtitle="Join us for this special experience"
      />

      <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr]">
          <article className="flex flex-col gap-8">
            {data.content.length > 0 ? (
              <BookingPageRenderer
                page={{ blocks: data.content as PageBlock[] }}
                lang={lang}
              />
            ) : (
              <p className="text-sm text-[var(--brand-navy)]/50">
                No content yet.
              </p>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}
