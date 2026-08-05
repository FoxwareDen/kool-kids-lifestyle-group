// HAS CMS MANAGING

import { HeroSection } from '#/components/hero/HeroSection';
import { StoriesSection, type StoriesSectionProps } from '#/components/sections/StoriesSection';
import { ExperiencesSection } from '#/components/sections/ExperiencesSection';
import { PlanYourVisitSection } from '#/components/sections/PlanYourVisitSection';
import { GallerySection } from '#/components/sections/GallerySection';
import { PreFooterSection } from '#/components/footer/PreFooterSection';
import { fetchPageDataSSR, type Content, type PageData } from '#/lib/pocketbase';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { fetchFeaturedExperienceCard, type Language } from '#/lib/experiences';

export const getPageData = createServerFn()
  .inputValidator((input: { slug: string; language?: 'en' | 'af' }) => input)
  // @ts-ignore
  .handler(async ({ data: { slug, language }, context }) => {
    return fetchPageDataSSR(slug,language)
  })

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? undefined,
  }),
  loaderDeps: ({ search: {lang} }) => ({lang}),
  loader: async ({ location, deps: { lang }}) => {
    const slug = location.pathname.replace(/^\/|\/$/g, '')

    // @ts-ignore
    const pageData: PageData | null = await getPageData({
      data: { slug, language: lang ?? undefined },
    })

    if (!pageData) throw notFound()

    const experience = await fetchFeaturedExperienceCard(lang)    

    return { pageData, featuredList: experience.value, lang}
  },

  notFoundComponent: () => <div>Page not found</div>,

  errorComponent: ({ error }) => <div>Something went wrong: {error.message}</div>,

  component: function () {
    const { pageData, featuredList, lang } = Route.useLoaderData()    

    return (
      <main>
        <HeroSection data={pageData.components['hero']} />
        <StoriesSection data={pageData.components["stories_section"]!} />
        <ExperiencesSection data={{...pageData.components["experiences_section"], list: featuredList||[]}} lang={lang} />
        <PlanYourVisitSection lang={lang}/>
        <GallerySection />
        <PreFooterSection />
      </main>
    )
  },
})