import type { DetailedBooking } from '#/lib/booking'

/**
 * Booking statuses considered "active" — i.e. reservations that still occupy a
 * slot and that an admin may need to act on. Cancelled and completed bookings
 * are excluded because they no longer hold inventory.
 */
export const ACTIVE_STATUSES: ReadonlyArray<DetailedBooking['status']> = [
  'pending',
  'rescheduled',
]

/** Milliseconds in a single day. */
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Build a `Date` from a booking's date and a `HH:mm` time string.
 *
 * @param date - Calendar date in `YYYY-MM-DD` format.
 * @param time - Time of day in 24-hour `HH:mm` format.
 * @returns A `Date` positioned at the given date and time in local time.
 */
function toDateTime(date: string, time: string): Date {
  return new Date(`${date}T${(time || '00:00').slice(0, 5)}:00`)
}

/**
 * Difference between two `HH:mm` times in whole minutes.
 *
 * @returns Minutes from `start` to `end`, or `0` if either value is unparseable.
 */
function diffMinutes(start: string, end: string): number {
  const [sh, sm] = (start || '').split(':').map(Number)
  const [eh, em] = (end || '').split(':').map(Number)
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 0
  return eh * 60 + em - (sh * 60 + sm)
}

/**
 * Number of days spanned by a day-type booking (minimum one).
 *
 * Day bookings store their length in the `duration` field as a day count, so a
 * missing or non-positive value is treated as a single day.
 */
function dayCount(booking: DetailedBooking): number {
  return booking.duration && booking.duration > 0 ? booking.duration : 1
}

/**
 * Resolve the moment a booking finishes, accounting for booking type.
 *
 * - **slot** bookings end at `end_time` on their `date`.
 * - **day** bookings end after `duration` days from the start of `date`.
 *
 * @param booking - The booking to evaluate.
 * @returns The booking's end `Date`.
 */
export function bookingEnd(booking: DetailedBooking): Date {
  if (booking.schedule?.booking_type === 'day') {
    const start = new Date(`${booking.date}T00:00:00`)
    return new Date(start.getTime() + dayCount(booking) * DAY_MS)
  }
  return toDateTime(booking.date, booking.end_time)
}

/**
 * Determine whether a booking is currently active.
 *
 * A booking is active when its status is in {@link ACTIVE_STATUSES} and its end
 * moment has not yet passed (upcoming or in-progress).
 *
 * @param booking - The booking record to test.
 * @param now - Reference time, defaulting to the current moment (injectable for tests).
 */
export function isActiveBooking(booking: DetailedBooking, now: Date = new Date()): boolean {
  if (!ACTIVE_STATUSES.includes(booking.status)) return false
  const end = bookingEnd(booking)
  if (Number.isNaN(end.getTime())) return true
  return end.getTime() >= now.getTime()
}

/**
 * Filter a list of bookings down to the active ones, sorted by soonest start.
 *
 * @param bookings - All booking records to filter.
 * @param now - Reference time, defaulting to the current moment.
 * @returns Active bookings ordered by their start date and time (ascending).
 */
export function selectActiveBookings(
  bookings: DetailedBooking[],
  now: Date = new Date(),
): DetailedBooking[] {
  return bookings
    .filter((b) => isActiveBooking(b, now))
    .sort(
      (a, b) =>
        toDateTime(a.date, a.start_time).getTime() -
        toDateTime(b.date, b.start_time).getTime(),
    )
}

/**
 * Format an ISO date string for display, e.g. `"Jan 5, 2026"`.
 *
 * @param date - Date string parseable by the `Date` constructor.
 * @returns A localised, human-readable date label.
 */
export function formatBookingDate(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date-time for display, e.g. `"Jan 5, 2026, 2:30 PM"`.
 *
 * @param value - Date string parseable by the `Date` constructor.
 * @returns A localised, human-readable date-time label.
 */
export function formatDateTime(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Render a booking's duration as a compact, human-readable label.
 *
 * The correct unit depends on the schedule's booking type — the source of the
 * earlier bug where day-length stays were shown as minutes:
 * - **slot** bookings are measured in minutes, derived from the start/end times
 *   (falling back to the stored `duration` when times are unavailable).
 * - **day** bookings are measured in whole days from the stored `duration`.
 *
 * @param booking - The booking whose duration should be formatted.
 * @returns A short label such as `"90 min"`, `"1h 30m"`, `"2h"`, or `"3 days"`.
 */
export function formatBookingDuration(booking: DetailedBooking): string {
  if (booking.schedule?.booking_type === 'day') {
    const days = dayCount(booking)
    return `${days} day${days > 1 ? 's' : ''}`
  }

  const derived = diffMinutes(booking.start_time, booking.end_time)
  const minutes = derived > 0 ? derived : booking.duration || 0
  if (minutes <= 0) return '—'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours && mins) return `${hours}h ${mins}m`
  if (hours) return `${hours}h`
  return `${mins} min`
}

/**
 * Case-insensitive search across a booking's customer, unit, schedule, and
 * reference fields. Used to power the admin search box.
 *
 * @param booking - The booking to test.
 * @param query - Raw search text; whitespace-only queries always match.
 * @returns `true` when the booking matches the query.
 */
export function matchesQuery(booking: DetailedBooking, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    booking.unit_label,
    booking.status,
    booking.schedule?.title,
    booking.customer?.name,
    booking.customer?.email,
    booking.customer?.phone,
    booking.customer?.reference,
    booking.customer?.code,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}
