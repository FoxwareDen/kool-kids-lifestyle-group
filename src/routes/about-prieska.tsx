// HAS CMS MANAGING

import { createFileRoute, notFound } from '@tanstack/react-router'
import { AboutHero } from '#/components/about/AboutHero'
import { AboutIntro } from '#/components/about/AboutIntro'
import { StatsBand } from '#/components/about/StatsBand'
import { MissionVisionValues } from '#/components/about/MissionVisionValues'
import { OurStory } from '#/components/about/OurStory'
import { WhyVisitPrieska } from '#/components/about/WhyVisitPrieska'
import { AboutCta } from '#/components/about/AboutCta'
import { fetchPageDataSSR, type PageData } from '#/lib/pocketbase'
import { createServerFn } from '@tanstack/react-start'
import type { Language } from '#/lib/experiences'


export const getPageData = createServerFn()
  .inputValidator((input: { slug: string; lang?: Language }) => input)
  // @ts-ignore
  .handler(async ({ data: { slug, lang } }) => {
    const result = await fetchPageDataSSR(slug, lang)

    return result;
  })


/**
 * The "About Prieska" page route. Composes the page-level sections in order:
 * hero, company intro, trust-building stats, mission/vision/values, the story
 * timeline, reasons to visit, a closing call-to-action and the shared footer.
 */
export const Route = createFileRoute('/about-prieska')({
  head: () => ({
    meta: [
      {
        title: 'About Prieska | 360 Experiences',
      },
      {
        name: 'description',
        content:
          '360 Experiences is a tourism and recreation company sharing the heritage, landscapes and adventure of Prieska in the Northern Cape.',
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loaderDeps: ({ search: {lang}  }) => ({lang}),
  loader: async ({ location, deps: { lang } }) => {
    const slug = location.pathname.replace(/^\/|\/$/g, '')

    // @ts-ignore
    const pageData: PageData<unknown> = await getPageData({
      data: { slug, lang },
    })

    if (!pageData) throw notFound()

    return { pageData }
  },

  notFoundComponent: () => <div>Page not found</div>,

  errorComponent: ({ error }) => <div>Something went wrong: {error.message}</div>,

  component: AboutPrieskaPage,
})

/**
 * Renders the full About Prieska page by stacking its section components.
 *
 * @returns {JSX.Element} The rendered page.
 */
function AboutPrieskaPage() {
  const { pageData } = Route.useLoaderData()
  const { lang } = Route.useLoaderDeps()

  return (
    <main>
      <AboutHero data={pageData.components["about_hero"]} lang={lang ?? 'en'} />
      <AboutIntro data={pageData.components["about_intro"]} lang={lang ?? 'en'} />
      <StatsBand />
      <MissionVisionValues data={pageData.components["mission_vision_values"]} lang={lang ?? 'en'} />
      <OurStory data={pageData.components["our_story"]} lang={lang ?? 'en'} />
      <WhyVisitPrieska data={pageData.components["why_visit_prieska"]} lang={lang ?? 'en'} />
      <AboutCta data={pageData.components["about_cta"]} lang={lang ?? 'en'} />
    </main>
  )
}
