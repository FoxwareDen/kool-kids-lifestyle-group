import type { HydratedBookingPage, Language } from '#/lib/experiences'
import { fetchExperiences, Result } from '#/lib/pocketbase'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

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
  validateSearch: (search: Record<string, unknown>)=> ({
    lang: (search.lang as Language) ?? "en"
  }),
  loader: async () => {
    try {
      const experiences = await getPageData();
      
      if (!experiences) throw notFound();

      return experiences;
    } catch (error) {
      throw notFound();
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const experiences = Route.useLoaderData();
  
  return <div>{JSON.stringify(experiences)}</div>
}
