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
import { useEffect } from 'react'
import { isAuthenticated } from '#/lib/pocketbase'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loader: async ({location}) =>{
    const params = new URLSearchParams(location.search)
    const urlLang = params.get('lang') as 'en' | 'af' | null

    let resolvedLanguage: 'en' | 'af'

    if (urlLang) {
      // 1. URL ALWAYS wins
      resolvedLanguage = urlLang
    } else {
      // 2. fallback to browser
      const { getRequestHeaders } = await import('@tanstack/react-start/server')

      const headers = getRequestHeaders()
      const acceptLanguage = headers.get('accept-language') ?? 'en'

      const primaryLang = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase()

      resolvedLanguage = primaryLang === 'af' ? 'af' : 'en'
    }

    return {
      isAuthed: isAuthenticated(),
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
  const { isAuthed } = Route.useLoaderData();
  
  return (
    <html className="h-full">
      <head>
        <HeadContent />
      </head>
      {/* Added suppressHydrationWarning here to ignore browser extensions modifying attributes */}
      <body suppressHydrationWarning>
        {
          pathname.split("\/").includes("dashboard") ||  pathname.split("\/").includes("login") ? null : <SiteHeader isAuthed={isAuthed} />
        }
        {children}
        {
          pathname.split("\/").includes("login") ? null : <SiteFooter />
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