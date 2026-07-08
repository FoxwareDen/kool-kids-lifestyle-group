// app/routes/_authed/dashboard.tsx
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  // Get user data on the server
  loader: async () => {
    // const user = await getCurrentUserFn()
    // return { user }
  },
  component: DashboardComponent,
})

const ROUTES: {label: string, to: string}[] = [
  {
    label: "Wiki",
    to: "/dashboard/"
  },
  {
    label: "Create Experiences",
    to: "/dashboard/experience",
  }, 
  {
    label: "Schedules",
    to: "/dashboard/calendars",
  }, 
  {
    label: "Create Schedule",
    to: "/dashboard/create-calendar"
  }
]

function DashboardComponent() {

  return (
    <div className='flex h-dvh w-full bg-[var(--bg-base)]'>
      <aside className={`flex flex-col bg-[var(--surface-strong)] border-r border-[var(--line)] min-w-52 p-4`}>
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
      </main>
    </div>
  )
}