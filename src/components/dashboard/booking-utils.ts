import type { BookingResponse } from '#/lib/booking'

/**
 * Booking statuses considered "active" — i.e. reservations that still occupy a
 * slot and that an admin may need to act on. Cancelled and completed bookings
 * are excluded because they no longer hold inventory.
 */
export const ACTIVE_STATUSES: ReadonlyArray<BookingResponse['status']> = [
  'pending',
  'rescheduled',
]

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
 * Determine whether a booking is currently active.
 *
 * A booking is active when its status is in {@link ACTIVE_STATUSES} and its end
 * moment has not yet passed (upcoming or in-progress). This keeps the admin
 * panel focused on bookings that still require attention.
 *
 * @param booking - The booking record to test.
 * @param now - Reference time, defaulting to the current moment (injectable for tests).
 * @returns `true` when the booking is active.
 */
export function isActiveBooking(booking: BookingResponse, now: Date = new Date()): boolean {
  if (!ACTIVE_STATUSES.includes(booking.status)) return false
  const end = toDateTime(booking.date, booking.end_time)
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
  bookings: BookingResponse[],
  now: Date = new Date(),
): BookingResponse[] {
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
 * Render a booking duration as a compact, human-readable label.
 *
 * Slot bookings store minutes; long durations are shown in hours. Day bookings
 * (multiples of a full day) are shown in days.
 *
 * @param minutes - Raw duration value from the booking record.
 * @returns A short label such as `"90 min"`, `"2h"`, or `"3 days"`.
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '—'
  if (minutes % 1440 === 0) {
    const days = minutes / 1440
    return `${days} day${days > 1 ? 's' : ''}`
  }
  if (minutes >= 60) {
    const hours = minutes / 60
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`
  }
  return `${minutes} min`
}
