import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getSessionMiddleware } from '#/routes/__root'
import { fetchBookingsDetailed, updateBooking, type DetailedBooking } from '#/lib/booking'
import { ActiveBookingsPanel } from '#/components/dashboard/ActiveBookingsPanel'

/**
 * Server function that loads every booking (enriched with schedule and
 * customer/payment details) for the bookings monitor.
 *
 * Runs behind the dashboard session middleware and returns an empty list on
 * failure so the page can still render its empty state gracefully.
 */
const getBookings = createServerFn()
  .middleware([getSessionMiddleware])
  .handler(async ({ context }) => {
    if (!context.isAuthed) throw new Error('Not authenticated')

    const bookings = await fetchBookingsDetailed(context.cookieString)
    return { bookings: bookings.success ? (bookings.value ?? []) : [] }
  })

export const Route = createFileRoute('/_authed/dashboard/bookings')({
  loader: async () => await getBookings(),
  component: RouteComponent,
})

/**
 * Dedicated admin page for monitoring and managing all bookings across every
 * schedule. Data loading lives in {@link getBookings}; presentation and
 * client-side search/filter live in {@link ActiveBookingsPanel}. Status changes
 * are persisted here and the loader is invalidated to refresh the list.
 */
function RouteComponent() {
  const { bookings } = Route.useLoaderData()
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: DetailedBooking['status']) => {
    setPendingId(id)
    try {
      await updateBooking(id, { status })
      await router.invalidate()
    } catch (error) {
      console.error('Failed to update booking status:', error)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Active Bookings</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Monitor upcoming and in-progress reservations, review customer details, and update
          booking status across all schedules.
        </p>
      </div>

      <ActiveBookingsPanel
        bookings={bookings}
        onStatusChange={handleStatusChange}
        pendingId={pendingId}
      />
    </div>
  )
}
