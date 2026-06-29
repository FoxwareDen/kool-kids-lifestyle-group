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


export const getPageData = createServerFn()
  .inputValidator((input: { slug: string; language?: 'en' | 'af' }) => input)
  .handler(async ({ data: { slug, language } }) => {
    
    // If language was explicitly passed, use it — otherwise detect from headers
    const resolvedLanguage: 'en' | 'af' = language ?? await (async () => {
      const { getRequestHeaders } = await import('@tanstack/react-start/server')

      const headers = getRequestHeaders()
      const acceptLanguage = headers.get('accept-language') ?? 'en'

      const languages = acceptLanguage
        .split(',')
        .map(part => {
          const [lang, q] = part.trim().split(';q=')
          return { lang: lang.trim(), q: q ? parseFloat(q) : 1.0 }
        })
        .sort((a, b) => b.q - a.q)

      const primaryLang = languages[0].lang.split('-')[0].toLowerCase()
      return primaryLang === 'af' ? 'af' : 'en'
    })()

    return fetchPageDataSSR(slug, resolvedLanguage)
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
  loader: async ({ location }) => {
    const slug = location.pathname.replace(/^\/|\/$/g, '')
    
  //   // Parse ?lang= from the URL
    const params = new URLSearchParams(location.search)
    const lang = params.get('lang') as 'en' | 'af' | null

    const pageData: PageData | null = await getPageData({
      data: { slug, language: lang ?? undefined },
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

  return (
    <main>
      <AboutHero data={pageData.components["about_hero"]}  />
      <AboutIntro data={pageData.components["about_intro"]} /> 
      {/* 
      */}
      <StatsBand />
      <MissionVisionValues data={pageData.components["mission_vision_values"]} />
      <OurStory data={pageData.components["our_story"]} />
      <WhyVisitPrieska data={pageData.components["why_visit_prieska"]}/>
      <AboutCta data={pageData.components["about_cta"]} />
    </main>
  )
}
