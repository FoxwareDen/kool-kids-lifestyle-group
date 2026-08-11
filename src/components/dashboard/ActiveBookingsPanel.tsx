import { CalendarCheck2, CalendarX } from 'lucide-react'
import type { BookingResponse } from '#/lib/booking'
import { Pill } from './form-controls'
import { ActiveBookingRow } from './ActiveBookingRow'
import { selectActiveBookings } from './booking-utils'

/**
 * Column headings for the desktop table layout. Kept in sync with the grid
 * template used by {@link ActiveBookingRow}.
 */
function TableHeader() {
  return (
    <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-4 border-b border-[var(--line)] bg-[var(--dash-panel-muted)] px-5 py-3 md:grid">
      {['Unit', 'Date', 'Time', 'Duration', 'Status'].map((label) => (
        <span
          key={label}
          className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)] last:justify-self-end"
        >
          {label}
        </span>
      ))}
    </div>
  )
}

/**
 * Admin panel that surfaces every currently active booking across all
 * schedules so staff can monitor upcoming and in-progress reservations at a
 * glance.
 *
 * Filtering (active status + not yet ended) is delegated to
 * {@link selectActiveBookings}, keeping this component focused on layout. When
 * there are no active bookings an empty state is shown instead of the table.
 *
 * @param bookings - All bookings fetched from the backend; filtered internally.
 */
export function ActiveBookingsPanel({ bookings }: { bookings: BookingResponse[] }) {
  const active = selectActiveBookings(bookings)

  return (
    <section
      aria-label="Active bookings"
      className="overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]"
    >
      <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-sm bg-[color-mix(in_oklab,var(--brand-orange)_16%,transparent)] text-[var(--brand-orange-deep)]">
            <CalendarCheck2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-[var(--sea-ink)]">Active bookings</h2>
            <p className="text-sm text-[var(--sea-ink-soft)]">
              Upcoming and in-progress reservations across all schedules.
            </p>
          </div>
        </div>
        <Pill tone="accent">
          {active.length} active
        </Pill>
      </header>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-sm bg-[var(--dash-panel-muted)]">
            <CalendarX className="size-6 text-[var(--sea-ink-soft)]" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-[var(--sea-ink)]">No active bookings</p>
          <p className="max-w-sm text-sm text-[var(--sea-ink-soft)]">
            When customers reserve a unit, their upcoming bookings will appear here.
          </p>
        </div>
      ) : (
        <>
          <TableHeader />
          <div>
            {active.map((booking) => (
              <ActiveBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
