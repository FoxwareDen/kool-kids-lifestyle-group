import {
  deriveCategories,
  experienceHasCategory,
  type HydratedBookingPage,
  type Language,
} from '#/lib/experiences'
import { fetchExperiences } from '#/lib/pocketbase'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ExperiencesHero } from '#/components/experiences/ExperiencesHero'
import { CategoryFilter } from '#/components/experiences/CategoryFilter'
import { ExperienceListCard } from '#/components/experiences/ExperienceListCard'
import { Compass } from 'lucide-react'

const getPageData = createServerFn().handler(async () => {
  const result = await fetchExperiences()

  if (result.success) {
    return result.value
  } else {
    throw new Error(result.error || '')
  }
})

export const Route = createFileRoute('/experiences/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? 'en',
    category: (search.category as string) || undefined,
  }),
  loader: async () => {
    try {
      const experiences = await getPageData()

      if (!experiences) throw notFound()

      return experiences
    } catch (error) {
      throw notFound()
    }
  },
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
  const experiences = Route.useLoaderData() as HydratedBookingPage[]
  const { lang, category } = Route.useSearch()

  const categories = deriveCategories(experiences)
  const filtered = category
    ? experiences.filter((exp) => experienceHasCategory(exp, category))
    : experiences

  const heading = category ? categoryLabel(category) : 'All Experiences'

  return (
    <main className="bg-[#f4efe7]">
      <ExperiencesHero
        eyebrow="Adventure Awaits"
        title="Choose Your Experience"
        subtitle="Find your next adventure in the heart of the Karoo."
        crumbs={[{ label: 'Experiences' }]}
      />

      <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
              Browse by category
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="display-title text-2xl font-medium text-[var(--brand-navy)] sm:text-3xl">
                {heading}
              </h2>
              <span className="text-sm font-medium text-[var(--brand-navy)]/55">
                {filtered.length} {filtered.length === 1 ? 'experience' : 'experiences'}
              </span>
            </div>
          </div>

          <CategoryFilter categories={categories} active={category} />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--brand-navy)]/20 bg-white/60 py-20 text-center">
            <Compass className="h-8 w-8 text-[var(--brand-navy)]/30" strokeWidth={1.5} />
            <p className="text-base font-semibold text-[var(--brand-navy)]">
              No experiences here yet
            </p>
            <p className="max-w-sm text-sm text-[var(--brand-navy)]/55">
              There are no experiences in this category right now. Check back soon or browse all of
              our adventures.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((experience) => (
              <ExperienceListCard key={experience.id} experience={experience} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
