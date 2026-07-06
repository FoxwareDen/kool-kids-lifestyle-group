import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useRouter,
  useRouterState,
  useSearch,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SiteFooter } from '#/components/footer/SiteFooter'
import { SiteHeader } from '#/components/hero/SiteHeader'
import { useEffect, useMemo } from 'react'
import { isAuthenticated } from '#/lib/pocketbase'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'

interface MyRouterContext {
  queryClient: QueryClient
}


const getAcceptLanguage = createServerFn()
  .handler(async () =>{
    return { acceptLanguage: getRequestHeader("Accept-Language") }
  })

export const Route = createRootRouteWithContext<MyRouterContext>()({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loader: async ({location}) =>{
    const params = new URLSearchParams(location.search)
    const urlLang = params.get('lang') as 'en' | 'af' | null

    let resolvedLanguage: 'en' | 'af'
    
    // FIXME: get the correct sever side method to get headers
    if (urlLang) {
      // 1. URL ALWAYS wins
      resolvedLanguage = urlLang || "en"
    } else {
      const { acceptLanguage } = await getAcceptLanguage();

      const primaryLang = acceptLanguage ? acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase(): "en";

      resolvedLanguage = primaryLang == 'af' ? 'af' : 'en'
    }

    return {
      lang: resolvedLanguage,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kool kids lifestyle group',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouterState({
    select(state) {
      return state.location;
    },
  })
  const { lang} = Route.useLoaderData();
  const isAuthed  = useMemo(()=> isAuthenticated(),[]);
  
  
  return (
    <html className="h-full">
      <head>
        <HeadContent />
      </head>
      {/* Added suppressHydrationWarning here to ignore browser extensions modifying attributes */}
      <body suppressHydrationWarning>
        {
          pathname.split("\/").includes("dashboard") ||  pathname.split("\/").includes("login") ? null : <SiteHeader isAuthed={isAuthed} lang={lang} />
        }
        {children}
        {
          pathname.split("\/").includes("login") ? null : <SiteFooter lang={lang} />
        }
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}