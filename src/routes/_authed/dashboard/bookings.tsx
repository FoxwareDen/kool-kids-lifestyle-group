import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSessionMiddleware } from '#/routes/__root'
import { fetchAllBookings } from '#/lib/booking'
import { ActiveBookingsPanel } from '#/components/dashboard/ActiveBookingsPanel'

/**
 * Server function that loads every booking for the active-bookings monitor.
 *
 * Runs behind the dashboard session middleware and returns an empty list on
 * failure so the page can still render its empty state gracefully.
 */
const getBookings = createServerFn()
  .middleware([getSessionMiddleware])
  .handler(async ({ context }) => {
    if (!context.isAuthed) throw new Error('Not authenticated')

    const bookings = await fetchAllBookings(context.cookieString)
    return { bookings: bookings.success ? (bookings.value ?? []) : [] }
  })

export const Route = createFileRoute('/_authed/dashboard/bookings')({
  loader: async () => await getBookings(),
  component: RouteComponent,
})

/**
 * Dedicated admin page for monitoring all active bookings across every
 * schedule. Kept intentionally thin — data loading lives in {@link getBookings}
 * and all presentation is delegated to {@link ActiveBookingsPanel}.
 */
function RouteComponent() {
  const { bookings } = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Active Bookings</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Monitor upcoming and in-progress reservations across all schedules.
        </p>
      </div>

      <ActiveBookingsPanel bookings={bookings} />
    </div>
  )
}
