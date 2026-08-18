import { useState } from 'react'
import {
  CalendarClock,
  ChevronDown,
  Clock,
  Timer,
  User,
  Mail,
  Phone,
  Hash,
  Ticket,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import type { DetailedBooking } from '#/lib/booking'
import { cn } from '#/lib/utils'
import { BookingStatusBadge } from './BookingStatusBadge'
import { PaymentStatusBadge } from './PaymentStatusBadge'
import { Button } from './form-controls'
import { formatBookingDate, formatBookingDuration, formatDateTime } from './booking-utils'

/** Shared desktop grid template so the header and rows stay aligned. */
export const ROW_GRID = 'md:grid-cols-[1.4fr_1.4fr_1fr_1fr_0.8fr_1.2fr]'

/** Status change handler shared by the panel and its rows. */
export type StatusChangeHandler = (
  id: string,
  status: DetailedBooking['status'],
) => void | Promise<void>

/**
 * A labelled key/value line used inside the expanded detail area.
 */
function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange)]" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs text-[var(--sea-ink-soft)]">{label}</p>
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">{value || '—'}</p>
      </div>
    </div>
  )
}

/**
 * Status-aware action buttons for a single booking.
 *
 * Active bookings can be completed or cancelled (cancel uses an inline
 * two-step confirm); completed/cancelled bookings can be reactivated back to
 * pending. All actions are disabled while a change is in flight.
 */
function BookingActions({
  booking,
  onStatusChange,
  pending,
}: {
  booking: DetailedBooking
  onStatusChange: StatusChangeHandler
  pending: boolean
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const isActive = booking.status === 'pending' || booking.status === 'rescheduled'

  if (pending) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-[var(--sea-ink-soft)]">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Updating…
      </span>
    )
  }

  if (confirmingCancel) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--sea-ink)]">Cancel this booking?</span>
        <Button variant="danger" className="px-3 py-1.5" onClick={() => onStatusChange(booking.id, 'cancelled')}>
          Yes, cancel
        </Button>
        <Button variant="ghost" className="px-3 py-1.5" onClick={() => setConfirmingCancel(false)}>
          Keep
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isActive ? (
        <>
          <Button variant="primary" className="px-3 py-1.5" onClick={() => onStatusChange(booking.id, 'completed')}>
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Mark completed
          </Button>
          <Button variant="danger" className="px-3 py-1.5" onClick={() => setConfirmingCancel(true)}>
            <XCircle className="size-4" aria-hidden="true" />
            Cancel
          </Button>
        </>
      ) : (
        <Button variant="ghost" className="px-3 py-1.5" onClick={() => onStatusChange(booking.id, 'pending')}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reactivate
        </Button>
      )}
    </div>
  )
}

/**
 * Renders one booking as an expandable row.
 *
 * The collapsed summary lays out as an aligned grid on desktop (unit, customer,
 * date, time, duration, status) and a stacked card on mobile. Expanding reveals
 * the full CMS context — customer contact, payment status, schedule, and
 * timestamps — plus status actions so admins can act without leaving the page.
 *
 * @param booking - The enriched booking to display.
 * @param onStatusChange - Called when an admin changes the booking's status.
 * @param pending - Whether a status change for this booking is in flight.
 */
export function ActiveBookingRow({
  booking,
  onStatusChange,
  pending = false,
}: {
  booking: DetailedBooking
  onStatusChange: StatusChangeHandler
  pending?: boolean
}) {
  const [open, setOpen] = useState(false)
  const scheduleTitle = booking.schedule?.title
  const customerName = booking.customer?.name || booking.customer?.email || 'Guest'

  return (
    <div className="border-t border-[var(--line)] first:border-t-0">
      {/* Summary — click to expand */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full px-5 py-4 text-left transition-colors hover:bg-[var(--link-bg-hover)]"
      >
        {/* Desktop grid */}
        <div className={cn('hidden items-center gap-4 md:grid', ROW_GRID)}>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
              {booking.unit_label || 'Unit'}
            </p>
            {scheduleTitle && (
              <p className="truncate text-xs text-[var(--sea-ink-soft)]">{scheduleTitle}</p>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-[var(--sea-ink)]">{customerName}</p>
            {booking.customer && (
              <p className="truncate text-xs text-[var(--sea-ink-soft)]">
                {booking.customer.reference}
              </p>
            )}
          </div>
          <p className="text-sm text-[var(--sea-ink)]">{formatBookingDate(booking.date)}</p>
          <p className="text-sm tabular-nums text-[var(--sea-ink)]">
            {booking.start_time} – {booking.end_time}
          </p>
          <p className="text-sm text-[var(--sea-ink-soft)]">{formatBookingDuration(booking)}</p>
          <div className="flex items-center justify-between gap-2">
            <BookingStatusBadge status={booking.status} />
            <ChevronDown
              className={cn(
                'size-4 shrink-0 text-[var(--sea-ink-soft)] transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Mobile summary */}
        <div className="flex items-start justify-between gap-3 md:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
              {booking.unit_label || 'Unit'}
            </p>
            <p className="truncate text-xs text-[var(--sea-ink-soft)]">{customerName}</p>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              {formatBookingDate(booking.date)} · {booking.start_time}–{booking.end_time} ·{' '}
              {formatBookingDuration(booking)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <BookingStatusBadge status={booking.status} />
            <ChevronDown
              className={cn(
                'size-4 text-[var(--sea-ink-soft)] transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-[var(--line)] bg-[var(--dash-panel-muted)] px-5 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem icon={User} label="Customer" value={booking.customer?.name} />
            <DetailItem icon={Mail} label="Email" value={booking.customer?.email} />
            <DetailItem icon={Phone} label="Phone" value={booking.customer?.phone} />
            <DetailItem icon={Hash} label="Reference" value={booking.customer?.reference} />
            <DetailItem icon={Ticket} label="Code" value={booking.customer?.code} />
            <DetailItem icon={CalendarClock} label="Schedule" value={scheduleTitle} />
            <DetailItem
              icon={Clock}
              label="Time"
              value={`${booking.start_time} – ${booking.end_time}`}
            />
            <DetailItem icon={Timer} label="Duration" value={formatBookingDuration(booking)} />
            <DetailItem icon={CalendarClock} label="Booked on" value={formatDateTime(booking.created)} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--sea-ink-soft)]">Payment:</span>
              {booking.customer ? (
                <PaymentStatusBadge status={booking.customer.payment_status} />
              ) : (
                <span className="text-xs text-[var(--sea-ink-soft)]">No payment on record</span>
              )}
            </div>
            <BookingActions booking={booking} onStatusChange={onStatusChange} pending={pending} />
          </div>
        </div>
      )}
    </div>
  )
}
