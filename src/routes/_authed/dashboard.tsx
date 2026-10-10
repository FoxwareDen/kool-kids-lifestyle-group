// app/routes/_authed/dashboard.tsx
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative flex h-dvh min-h-0 w-full overflow-hidden bg-[#F5F5F7]">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <DashboardSidebar
        lang={lang ?? 'en'}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          sectionTitle={sectionTitle}
          lang={lang ?? 'en'}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />
        <main id="main" className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
