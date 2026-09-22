// HAS CMS MANAGING

import { HeroSection } from '#/components/hero/HeroSection'
import { StoriesSection } from '#/components/sections/StoriesSection'
import { ExperiencesSection } from '#/components/sections/ExperiencesSection'
import { PlanYourVisitSection } from '#/components/sections/PlanYourVisitSection'
import { GallerySection } from '#/components/sections/GallerySection'
import { PreFooterSection } from '#/components/footer/PreFooterSection'
import { fetchPageDataSSR, type PageData } from '#/lib/pocketbase'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { fetchFeaturedExperienceCard, type Language } from '#/lib/experiences'

export const getPageData = createServerFn()
  .inputValidator((input: { slug: string; language?: 'en' | 'af' }) => input)
  // @ts-ignore
  .handler(async ({ data: { slug, language }, context }) => {
    return fetchPageDataSSR(slug, language)
  })

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: search.lang as Language,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async ({ location, deps: { lang } }) => {
    const slug = location.pathname.replace(/^\/|\/$/g, '')

    const pageData: PageData | null = await getPageData({
      data: { slug, language: lang },
    })

    if (!pageData) throw notFound()

    const experience = await fetchFeaturedExperienceCard(lang)

    return { pageData, featuredList: experience.value, lang }
  },
  head: () => ({
    meta: [
      {
        title: '360 Experiences | Tours, Stays & Experiences',
      },
      {
        name: 'description',
        content:
          'Discover unforgettable tours, experiences and stays. Explore, book and plan your visit with 360 Experiences.',
      },
      {
        property: 'og:title',
        content: '360 Experiences | Tours, Stays & Experiences',
      },
      {
        property: 'og:description',
        content:
          'Discover unforgettable tours, experiences and stays. Explore, book and plan your visit with 360 Experiences.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
  }),
  notFoundComponent: () => <div>Page not found</div>,

  errorComponent: ({ error }) => (
    <div>Something went wrong: {error.message}</div>
  ),

  component: function () {
    const { pageData, featuredList, lang } = Route.useLoaderData()

    return (
      <main>
        <HeroSection data={pageData.components['hero']} />
        <StoriesSection data={pageData.components['stories_section']!} />
        <ExperiencesSection
          data={{
            ...pageData.components['experiences_section'],
            list: featuredList || [],
          }}
          lang={lang}
        />
        <PlanYourVisitSection lang={lang} />
        <GallerySection lang={lang} />
        <PreFooterSection lang={lang} />
      </main>
    )
  },
})
