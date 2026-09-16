// app/routes/_authed/dashboard.tsx
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { DashboardSidebar } from '#/components/dashboard/DashboardSidebar'
import { DashboardTopbar } from '#/components/dashboard/DashboardTopbar'
import { getActiveNavLabel } from '#/components/dashboard/nav-config'
import type { Language } from '#/lib/experiences'

export const Route = createFileRoute('/_authed/dashboard')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  component: DashboardComponent,
})

function DashboardComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { lang } = Route.useLoaderDeps()
  const sectionTitle = getActiveNavLabel(pathname, lang ?? 'en')

  return (
    <div className='flex h-dvh w-full bg-[#F5F5F7]'>
      <DashboardSidebar lang={lang ?? 'en'} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar sectionTitle={sectionTitle} lang={lang ?? 'en'} />
        <main id="main" className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      </div>
  )
}
