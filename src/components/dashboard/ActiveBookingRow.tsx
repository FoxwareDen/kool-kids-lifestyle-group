import { CalendarClock, Clock, Timer, Boxes } from 'lucide-react'
import type { BookingResponse } from '#/lib/booking'
import { BookingStatusBadge } from './BookingStatusBadge'
import { formatBookingDate, formatDuration } from './booking-utils'

/**
 * A labelled value used in the stacked mobile layout of a booking row.
 */
function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 shrink-0 text-[var(--brand-orange)]" aria-hidden="true" />
      <span className="text-xs text-[var(--sea-ink-soft)]">{label}:</span>
      <span className="text-xs font-medium text-[var(--sea-ink)]">{value}</span>
    </div>
  )
}

/**
 * Renders one active booking.
 *
 * On large screens it lays out as an aligned table-style grid (unit, date,
 * time, duration, status); on small screens it collapses into a stacked card
 * with labelled meta rows. Purely presentational — it only reflects props.
 *
 * @param booking - The booking record to display.
 */
export function ActiveBookingRow({ booking }: { booking: BookingResponse }) {
  const scheduleTitle = booking.expanded?.calendar_ref?.title

  return (
    <div className="border-t border-[var(--line)] px-5 py-4 first:border-t-0">
      {/* Desktop: aligned grid */}
      <div className="hidden items-center gap-4 md:grid md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
            {booking.unit_label || 'Unit'}
          </p>
          {scheduleTitle && (
            <p className="truncate text-xs text-[var(--sea-ink-soft)]">{scheduleTitle}</p>
          )}
        </div>
        <p className="text-sm text-[var(--sea-ink)]">{formatBookingDate(booking.date)}</p>
        <p className="text-sm tabular-nums text-[var(--sea-ink)]">
          {booking.start_time} – {booking.end_time}
        </p>
        <p className="text-sm text-[var(--sea-ink-soft)]">{formatDuration(booking.duration)}</p>
        <div className="justify-self-end">
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      {/* Mobile: stacked card */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
              {booking.unit_label || 'Unit'}
            </p>
            {scheduleTitle && (
              <p className="truncate text-xs text-[var(--sea-ink-soft)]">{scheduleTitle}</p>
            )}
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
        <MetaItem icon={CalendarClock} label="Date" value={formatBookingDate(booking.date)} />
        <MetaItem
          icon={Clock}
          label="Time"
          value={`${booking.start_time} – ${booking.end_time}`}
        />
        <MetaItem icon={Timer} label="Duration" value={formatDuration(booking.duration)} />
        {scheduleTitle && <MetaItem icon={Boxes} label="Schedule" value={scheduleTitle} />}
      </div>
    </div>
  )
}
