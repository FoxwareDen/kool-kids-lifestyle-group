import { useMemo, useState } from 'react'
import { CalendarCheck2, CalendarX, Search } from 'lucide-react'
import type { DetailedBooking } from '#/lib/booking'
import { cn } from '#/lib/utils'
import { Pill, controlClass } from './form-controls'
import { ActiveBookingRow, ROW_GRID, type StatusChangeHandler } from './ActiveBookingRow'
import { isActiveBooking, matchesQuery, selectActiveBookings } from './booking-utils'

/** The selectable views for the bookings list. */
type FilterKey = 'active' | 'pending' | 'completed' | 'cancelled' | 'all'

const FILTERS: ReadonlyArray<{ key: FilterKey; label: string }> = [
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
]

/**
 * Apply the selected filter to the full booking list.
 *
 * `active` reuses {@link selectActiveBookings} (status + not-yet-ended); the
 * status-named filters match on status; `all` returns everything sorted by most
 * recent date.
 */
function applyFilter(bookings: DetailedBooking[], filter: FilterKey): DetailedBooking[] {
  if (filter === 'active') return selectActiveBookings(bookings)
  if (filter === 'all') {
    return [...bookings].sort((a, b) => b.date.localeCompare(a.date))
  }
  return bookings
    .filter((b) => b.status === filter)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Column headings for the desktop table layout. Kept in sync with
 * {@link ROW_GRID} used by each row.
 */
function TableHeader() {
  return (
    <div
      className={cn(
        'hidden gap-4 border-b border-[var(--line)] bg-[var(--dash-panel-muted)] px-5 py-3 md:grid',
        ROW_GRID,
      )}
    >
      {['Unit', 'Customer', 'Date', 'Time', 'Duration', 'Status'].map((label) => (
        <span
          key={label}
          className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]"
        >
          {label}
        </span>
      ))}
    </div>
  )
}

/**
 * Admin panel for monitoring and managing every booking across all schedules.
 *
 * Provides a live search box and status filters, then renders each match as an
 * expandable {@link ActiveBookingRow} that surfaces customer/payment details
 * and status actions. Filtering/search is client-side over the already-loaded
 * list; status changes are delegated upward via {@link onStatusChange}.
 *
 * @param bookings - All enriched bookings fetched from the backend.
 * @param onStatusChange - Handler invoked when an admin changes a booking's status.
 * @param pendingId - Id of the booking currently being updated, if any.
 */
export function ActiveBookingsPanel({
  bookings,
  onStatusChange,
  pendingId = null,
}: {
  bookings: DetailedBooking[]
  onStatusChange: StatusChangeHandler
  pendingId?: string | null
}) {
  const [filter, setFilter] = useState<FilterKey>('active')
  const [query, setQuery] = useState('')

  const activeCount = useMemo(
    () => bookings.filter((b) => isActiveBooking(b)).length,
    [bookings],
  )

  const visible = useMemo(() => {
    return applyFilter(bookings, filter).filter((b) => matchesQuery(b, query))
  }, [bookings, filter, query])

  return (
    <section
      aria-label="Bookings"
      className="overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]"
    >
      <header className="flex flex-col gap-4 border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-sm bg-[color-mix(in_oklab,var(--brand-orange)_16%,transparent)] text-[var(--brand-orange-deep)]">
              <CalendarCheck2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--sea-ink)]">Bookings monitor</h2>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                Search, filter, and manage reservations across all schedules.
              </p>
            </div>
          </div>
          <Pill tone="accent">{activeCount} active</Pill>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status filters */}
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter bookings">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors',
                  filter === key
                    ? 'bg-[var(--brand-orange)] text-white'
                    : 'border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)]',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative md:w-64">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sea-ink-soft)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, unit, reference…"
              aria-label="Search bookings"
              className={cn(controlClass, 'cursor-text pl-9')}
            />
          </div>
        </div>
      </header>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-sm bg-[var(--dash-panel-muted)]">
            <CalendarX className="size-6 text-[var(--sea-ink-soft)]" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold text-[var(--sea-ink)]">No bookings found</p>
          <p className="max-w-sm text-sm text-[var(--sea-ink-soft)]">
            {query
              ? 'Try a different search term or switch filters.'
              : 'Bookings matching this filter will appear here.'}
          </p>
        </div>
      ) : (
        <>
          <TableHeader />
          <div>
            {visible.map((booking) => (
              <ActiveBookingRow
                key={booking.id}
                booking={booking}
                onStatusChange={onStatusChange}
                pending={pendingId === booking.id}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
