import { CategoryFilter } from '#/components/experiences/CategoryFilter';
import { ExperienceListCard } from '#/components/experiences/ExperienceListCard';
import { ExperiencesHero } from '#/components/experiences/ExperiencesHero';
import { useExperiences } from '#/hooks/useExperiences';
import { deriveCategories, experienceHasCategory, fetchExperiences, type Language } from '#/lib/experiences'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Compass, Loader2 } from 'lucide-react';

const getPageData = createServerFn()
  // .inputValidator((input: {language?: "en" | "af"})=> input)
  .handler(async () => {
    
    // If language was explicitly passed, use it — otherwise detect from headers
    // const resolvedLanguage: 'en' | 'af' = language ?? await (async () => {
    //   const { getRequestHeaders } = await import('@tanstack/react-start/server')

    //   const headers = getRequestHeaders()
    //   const acceptLanguage = headers.get('accept-language') ?? 'en'

    //   const languages = acceptLanguage
    //     .split(',')
    //     .map(part => {
    //       const [lang, q] = part.trim().split(';q=')
    //       return { lang: lang.trim(), q: q ? parseFloat(q) : 1.0 }
    //     })
    //     .sort((a, b) => b.q - a.q)

    //   const primaryLang = languages[0].lang.split('-')[0].toLowerCase()
    //   return primaryLang === 'af' ? 'af' : 'en'
    // })()

    const result = await fetchExperiences();

    if (result.success) {
      return result.value
    }else {
      throw new Error(result.error||"")
    }
  })

export const Route = createFileRoute('/experiences/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? 'en',
    category: (search.category as string) || undefined,
  }),
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
  const { lang, category } = Route.useSearch()
  const { experiences, isLoading, isError } = useExperiences()

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
              {!isLoading && !isError && (
                <span className="text-sm font-medium text-[var(--brand-navy)]/55">
                  {filtered.length} {filtered.length === 1 ? 'experience' : 'experiences'}
                </span>
              )}
            </div>
          </div>

          <CategoryFilter categories={categories} active={category} />
        </div>

        {isLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-orange)]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[var(--brand-navy)]/55">Loading experiences…</p>
          </div>
        ) : isError ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--brand-navy)]/20 bg-white/60 py-20 text-center">
            <Compass className="h-8 w-8 text-[var(--brand-navy)]/30" strokeWidth={1.5} />
            <p className="text-base font-semibold text-[var(--brand-navy)]">
              We couldn&apos;t load experiences
            </p>
            <p className="max-w-sm text-sm text-[var(--brand-navy)]/55">
              Something went wrong while fetching experiences. Please refresh the page to try again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
