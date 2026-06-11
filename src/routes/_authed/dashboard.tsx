// app/routes/_authed/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  // Get user data on the server
  loader: async () => {
    // const user = await getCurrentUserFn()
    // return { user }
  },
  component: DashboardComponent,
})

function DashboardComponent() {
  // const { user } = Route.useLoaderData()
  
  return (
    <div>
      <h1>Welcome </h1>
      {/* Dashboard content */}
    </div>
  )
}