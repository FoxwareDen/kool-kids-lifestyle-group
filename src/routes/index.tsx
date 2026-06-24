import { HeroSection } from '#/components/hero/HeroSection';
import { StoriesSection } from '#/components/sections/StoriesSection';
import { ExperiencesSection } from '#/components/sections/ExperiencesSection';
import { PlanYourVisitSection } from '#/components/sections/PlanYourVisitSection';
import { GallerySection } from '#/components/sections/GallerySection';
import { PreFooterSection } from '#/components/footer/PreFooterSection';
import { fetchFeaturedExperienceCard, fetchPageDataSSR, type PageData } from '#/lib/pocketbase';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export const getPageData = createServerFn()
  .inputValidator((input: { slug: string; language?: 'en' | 'af' }) => input)
  // @ts-ignore
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

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loader: async ({ location }) => {
    const slug = location.pathname.replace(/^\/|\/$/g, '')
    
    // Parse ?lang= from the URL
    const params = new URLSearchParams(location.search)
    const lang = params.get('lang') as 'en' | 'af' | null

    // @ts-ignore
    const pageData: PageData | null = await getPageData({
      data: { slug, language: lang ?? undefined },
    })

    if (!pageData) throw notFound()

    const experience = await fetchFeaturedExperienceCard("en")    

    return { pageData, featuredList: experience.value }
  },

  notFoundComponent: () => <div>Page not found</div>,

  errorComponent: ({ error }) => <div>Something went wrong: {error.message}</div>,

  component: function () {
    const { pageData, featuredList } = Route.useLoaderData()


    return (
      <main>
        <HeroSection data={pageData.components['hero']} />
        <StoriesSection />
        <ExperiencesSection data={{...pageData.components["experiences_section"], list: featuredList||[]}}/>
        <PlanYourVisitSection />
        <GallerySection />
        <PreFooterSection />
      </main>
    )
  },
})