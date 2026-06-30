import {
  parseCategories,
  resolveTranslatable,
  type HydratedBookingPage,
  type Language,
} from '#/lib/experiences'
import { fetchExperienceById } from '#/lib/pocketbase'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { ExperiencesHero } from '#/components/experiences/ExperiencesHero'
import { ExperienceContent } from '#/components/experiences/ExperienceContent'
import { BookingSlotModal } from '#/components/experiences/BookingSlotModal'

const getPageData = createServerFn()
  .inputValidator((input: { id: string; language?: Language }) => input)
  .handler(async ({ data: { id, language } }) => {
    const resolvedLanguage: 'en' | 'af' =
      language ??
      (await (async () => {
        const { getRequestHeaders } = await import('@tanstack/react-start/server')

        const headers = getRequestHeaders()
        const acceptLanguage = headers.get('accept-language') ?? 'en'

        const languages = acceptLanguage
          .split(',')
          .map((part) => {
            const [lang, q] = part.trim().split(';q=')
            return { lang: lang.trim(), q: q ? parseFloat(q) : 1.0 }
          })
          .sort((a, b) => b.q - a.q)

        const primaryLang = languages[0].lang.split('-')[0].toLowerCase()
        return primaryLang === 'af' ? 'af' : 'en'
      })())

    const result = await fetchExperienceById(id)

    if (result.success) {
      return { data: result.value, lang: resolvedLanguage }
    } else {
      throw new Error(result.error || '')
    }
  })

export const Route = createFileRoute('/experiences/$id')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? 'en',
  }),
  loader: async ({ location, params }) => {
    const { id } = params

    const urlParams = new URLSearchParams(location.search)
    const lang = urlParams.get('lang') as 'en' | 'af' | undefined

    const result = await getPageData({ data: { id, language: lang } })

    if (!result?.data) throw notFound()

    return result
  },
  notFoundComponent: () => (
    <div className="flex min-h-[60svh] items-center justify-center text-[var(--brand-navy)]">
      Experience not found.
    </div>
  ),
  component: RouteComponent,
})

/**
 * Title-case a raw category string for display.
 * @param {string} category - The raw category label.
 * @returns {string} The display label.
 */
function categoryLabel(category: string): string {
  return category
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function RouteComponent() {
  const { data, lang } = Route.useLoaderData() as {
    data: HydratedBookingPage
    lang: Language
  }
  const [bookingOpen, setBookingOpen] = useState(false)

  const title = resolveTranslatable(data.title, lang)
  const description = data.description ? resolveTranslatable(data.description, lang) : ''
  const tags = parseCategories(data.category).filter((c) => c.toLowerCase() !== 'featured')

  return (
    <main className="bg-[#f4efe7]">
      <ExperiencesHero
        eyebrow={tags[0] ? categoryLabel(tags[0]) : 'Experience'}
        title={title}
        subtitle={description ? '' : 'An unforgettable Karoo adventure awaits.'}
        image={data.coverImage}
        crumbs={[
          { label: 'Experiences', href: '/experiences' },
          { label: title },
        ]}
      />

      <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <article className="flex flex-col gap-8">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/experiences?category=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-[var(--brand-navy)]/15 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] !text-[var(--brand-navy)] no-underline transition-colors hover:border-[var(--brand-orange)] hover:!text-[var(--brand-orange)]"
                  >
                    {categoryLabel(tag)}
                  </a>
                ))}
              </div>
            )}

            {description && (
              <p className="text-lg leading-relaxed text-pretty text-[var(--brand-navy)]/75">
                {description}
              </p>
            )}

            {data.blocks?.length > 0 && (
              <div className="border-t border-[var(--brand-navy)]/10 pt-8">
                <ExperienceContent blocks={data.blocks} lang={lang} />
              </div>
            )}
          </article>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-5 border border-[var(--brand-navy)]/10 bg-white p-6 shadow-lg shadow-[var(--brand-navy)]/5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
                  Ready to go?
                </p>
                <h2 className="display-title mt-1 text-xl font-medium text-[var(--brand-navy)]">
                  Book this experience
                </h2>
              </div>

              <ul className="flex flex-col gap-3 text-sm text-[var(--brand-navy)]/70">
                <li className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-[var(--brand-orange)]" />
                  Choose any available date
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[var(--brand-orange)]" />
                  40 minute guided sessions
                </li>
                <li className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-[var(--brand-orange)]" />
                  Multiple unit options
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[var(--brand-orange)]" />
                  Prieska, Northern Cape
                </li>
              </ul>

              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 bg-[var(--brand-orange)] px-5 py-3.5 text-sm font-bold uppercase tracking-wide !text-white shadow-lg shadow-[var(--brand-orange)]/20 transition-colors hover:bg-[var(--brand-orange-deep)]"
              >
                <CalendarDays className="h-4 w-4" />
                Book Now
              </button>

              <p className="text-center text-xs text-[var(--brand-navy)]/45">
                Live availability shown at checkout.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <BookingSlotModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        experienceId={data.id}
        experienceTitle={title}
      />
    </main>
  )
}
