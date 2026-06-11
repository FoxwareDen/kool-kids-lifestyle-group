// app/routes/_authed.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server' // <-- Fixed export
import { isAuthenticatedSSR, getCurrentUserSSR } from '#/lib/pocketbase'

// 1. Localized server function to handle cookie collection on the host environment
const getAuthSession = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getRequest() // <-- Returns the native web Request object
    const cookieHeader = request?.headers.get('Cookie') || ''
    
    return {
      isValid: isAuthenticatedSSR(cookieHeader),
      user: getCurrentUserSSR(cookieHeader)
    }
  })

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    // 2. Fetch the session safely across the server boundary
    const session = await getAuthSession()

    // 3. Halt execution and redirect to login if session is invalid
    if (!session.isValid) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    // 4. Pass the authenticated user record down to child routes via context
    return {
      user: session.user,
    }
  },
  component: () => <Outlet />,
})