import { fetchExperienceById, type Language } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getPageData = createServerFn()
  .inputValidator((input: {id:string, language?: Language})=>input)
  .handler(async ({data: {id, language}})=>{
    
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

    const result = await fetchExperienceById(id);

    if (result.success) {
      return {data: result.value, lang: resolvedLanguage}
    }else {
      throw new Error(result.error||"")
    }
  })

export const Route = createFileRoute('/experiences/$id')({
  validateSearch: (search: Record<string, unknown>)=> ({
    lang: (search.lang as Language) ?? "en"
  }),
  loader: async ({location, params}) => {
    const {id} = params;
    
    // Parse ?lang= from the URL
    const urlParams = new URLSearchParams(location.search)
    const lang = urlParams.get('lang') as 'en' | 'af' | undefined

    const result = getPageData({
      data: { id, language:lang }
    })

    return result
  },
  component: RouteComponent,
})

function RouteComponent() {    

    return <div>Hello "/experiences/page"!</div>
}
