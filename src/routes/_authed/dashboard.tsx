// app/routes/_authed/dashboard.tsx
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { DashboardSidebar } from '#/components/dashboard/DashboardSidebar'
import { DashboardTopbar } from '#/components/dashboard/DashboardTopbar'
import { getActiveNavLabel } from '#/components/dashboard/nav-config'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const sectionTitle = getActiveNavLabel(pathname)

  return (
    <div className='flex h-dvh w-full bg-[var(--bg-base)]'>
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar sectionTitle={sectionTitle} />
        <main id="main" className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      </div>
  )
}
