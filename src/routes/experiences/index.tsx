import { CategoryFilter } from '#/components/experiences/CategoryFilter';
import { ExperienceListCard } from '#/components/experiences/ExperienceListCard';
import { ExperiencesHero } from '#/components/experiences/ExperiencesHero';
import { useExperiences } from '#/hooks/useExperiences';
import { deriveCategories, experienceHasCategory, type Language } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import { Compass, Loader2 } from 'lucide-react';

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

  const translations: Record<Language, {
    all: string
    browse: string
    heroEyebrow: string
    heroTitle: string
    heroSubtitle: string
    pageLabel: string
    experienceCountSingular: string
    experienceCountPlural: string
    loading: string
    emptyTitle: string
    emptyText: string
    errorTitle: string
    errorText: string
  }> = {
    en: {
      all: 'All Experiences',
      browse: 'Browse by category',
      heroEyebrow: 'Adventure Awaits',
      heroTitle: 'Choose Your Experience',
      heroSubtitle: 'Find your next adventure in the heart of the Karoo.',
      pageLabel: 'Experiences',
      experienceCountSingular: 'experience',
      experienceCountPlural: 'experiences',
      loading: 'Loading experiences…',
      emptyTitle: 'No experiences here yet',
      emptyText: 'There are no experiences in this category right now. Check back soon or browse all of our adventures.',
      errorTitle: 'We couldn&apos;t load experiences',
      errorText: 'Something went wrong while fetching experiences. Please refresh the page to try again.',
    },
    af: {
      all: 'Alle Ervarings',
      browse: 'Blader volgens kategorie',
      heroEyebrow: 'Avontuur Wag',
      heroTitle: 'Kies Jou Ervaring',
      heroSubtitle: 'Vind jou volgende avontuur in die hart van die Karoo.',
      pageLabel: 'Ervarings',
      experienceCountSingular: 'ervaring',
      experienceCountPlural: 'ervarings',
      loading: 'Laai ervarings…',
      emptyTitle: 'Nog geen ervarings hier nie',
      emptyText: 'Daar is tans geen ervarings in hierdie kategorie nie. Kom later weer kyk of blaai deur al ons avonture.',
      errorTitle: 'Ons kon nie ervarings laai nie',
      errorText: 'Iets het verkeerd gegaan tydens die haal van ervarings. Herlaai asseblief die blad om weer te probeer.',
    },
  }

  const categories = deriveCategories(experiences)
  const filtered = category
    ? experiences.filter((exp) => experienceHasCategory(exp, category))
    : experiences

  const heading = category ? categoryLabel(category) : translations[lang ?? 'en'].all
  const text = translations[lang ?? 'en']

  return (
    <main className="bg-[#f4efe7]">
      <ExperiencesHero
        eyebrow={text.heroEyebrow}
        title={text.heroTitle}
        subtitle={text.heroSubtitle}
        crumbs={[{ label: text.pageLabel }]}
      />

      <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
              {text.browse}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="display-title text-2xl font-medium text-[var(--brand-navy)] sm:text-3xl">
                {heading}
              </h2>
              {!isLoading && !isError && (
                <span className="text-sm font-medium text-[var(--brand-navy)]/55">
                  {filtered.length} {filtered.length === 1 ? text.experienceCountSingular : text.experienceCountPlural}
                </span>
              )}
            </div>
          </div>

          <CategoryFilter categories={categories} active={category} />
        </div>

        {isLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-orange)]" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[var(--brand-navy)]/55">{text.loading}</p>
          </div>
        ) : isError ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--brand-navy)]/20 bg-white/60 py-20 text-center">
            <Compass className="h-8 w-8 text-[var(--brand-navy)]/30" strokeWidth={1.5} />
            <p className="text-base font-semibold text-[var(--brand-navy)]">
              {text.errorTitle}
            </p>
            <p className="max-w-sm text-sm text-[var(--brand-navy)]/55">
              {text.errorText}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--brand-navy)]/20 bg-white/60 py-20 text-center">
            <Compass className="h-8 w-8 text-[var(--brand-navy)]/30" strokeWidth={1.5} />
            <p className="text-base font-semibold text-[var(--brand-navy)]">
              {text.emptyTitle}
            </p>
            <p className="max-w-sm text-sm text-[var(--brand-navy)]/55">
              {text.emptyText}
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
