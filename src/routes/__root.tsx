import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SiteFooter } from '#/components/footer/SiteFooter'
import { SiteHeader } from '#/components/hero/SiteHeader'
import { isAuthenticated } from '#/lib/pocketbase'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
  loader: ({location}) =>{
    return { slug: location.pathname};
  },
  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { slug } = Route.useLoaderData();

  console.log("root test");
  console.log(slug.split("\/").includes("dashboard") ? null : <SiteHeader />);
  console.log(isAuthenticated());
  
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      {/* Added suppressHydrationWarning here to ignore browser extensions modifying attributes */}
      <body suppressHydrationWarning>
        {
          slug.split("\/").includes("dashboard") || slug.split("\/").includes("login") ? null : <SiteHeader />
        }
        {children}
        {
          slug.split("\/").includes("login") ? null : <SiteFooter />
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