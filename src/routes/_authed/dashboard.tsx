// app/routes/_authed/dashboard.tsx
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { DashboardSidebar } from '#/components/dashboard/DashboardSidebar'
import { DashboardTopbar } from '#/components/dashboard/DashboardTopbar'
import { getActiveNavLabel } from '#/components/dashboard/nav-config'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardComponent,
})

const ROUTES: {label: string, to: string}[] = [
  {
    label: "Home",
    to: '/'
  },
  {
    label: "Wiki",
    to: "/dashboard/"
  },
  {
    label: "Schedules",
    to: "/dashboard/calendars",
  },
  {
    label: "Create Schedule",
    to: "/dashboard/create-calendar"
  }, 
  {
    label: "Create Post",
    to: "/dashboard/create-post"
  }, 
  {
    label: "Create Experiences",
    to: "/dashboard/experience",
  },
]

function DashboardComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const sectionTitle = getActiveNavLabel(pathname)

  return (
    <div className='flex h-dvh w-full bg-[var(--bg-base)]'>
      {/* <aside className={`flex flex-col bg-[var(--surface-strong)] border-r border-[var(--line)] min-w-52 p-4`}>
        <nav className='flex flex-col gap-2'>
          {ROUTES.map(route => (
            <Link 
              key={route.to}
              to={route.to}
              className="nav-link px-3 py-2 rounded-md hover:bg-[var(--link-bg-hover)] transition-all"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main id='main' className='flex-1 overflow-auto'>
        <div className='h-full'>
          <Outlet />
          </div>
      </main> */}
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
