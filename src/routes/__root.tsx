import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SiteFooter } from '#/components/footer/SiteFooter'
import { SiteHeader } from '#/components/hero/SiteHeader'
import { isAuthenticated } from '#/lib/pocketbase'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createMiddleware, createServerFn } from '@tanstack/react-start'

export const getSessionMiddleware = createMiddleware().server(({next})=>{
  const cookieHeader = getRequestHeader("Cookie");
  const isAuthed = isAuthenticated(cookieHeader);  
  return next({
    context: {
      isAuthed,
      language: getRequestHeader("Accept-Language"),
      cookieString: cookieHeader,
    }
  })
});

interface MyRouterContext {
  queryClient: QueryClient
}

const getSessionData = createServerFn()
  .middleware([getSessionMiddleware])
  .handler(async ({context}) =>{
    return {
      isAuthed: context.isAuthed,
      language: context.language
    }
  })

export const Route = createRootRouteWithContext<MyRouterContext>()({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loader: async ({location}) =>{
    const params = new URLSearchParams(location.search)
    const urlLang = params.get('lang') as 'en' | 'af' | null

    let resolvedLanguage: 'en' | 'af'
    
    const { language, isAuthed } = await getSessionData();

    if (urlLang) {
      // 1. URL ALWAYS wins
      resolvedLanguage = urlLang || "en"
    } else {
      const primaryLang = language ? language
        .split(',')[0]
        .split('-')[0]
        .toLowerCase(): "en";

      resolvedLanguage = primaryLang == 'af' ? 'af' : 'en'
    }

    return {
      lang: resolvedLanguage,
      isAuthed: isAuthed,
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
  const { lang, isAuthed} = Route.useLoaderData();  
  
  return (
    <html className="h-full">
      <head>
        <HeadContent />
      </head>
      {/* Added suppressHydrationWarning here to ignore browser extensions modifying attributes */}
      <body suppressHydrationWarning>
        {
          pathname.split("\/").includes("dashboard") || pathname.split("\/").includes("login") ? null : <SiteHeader isAuthed={isAuthed} lang={lang} />
        }
        {children}
        {
          pathname.split("\/").includes("dashboard") || pathname.split("\/").includes("login") ? null : <SiteFooter lang={lang} />
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