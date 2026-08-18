import { cn } from '#/lib/utils'
import type { BookingResponse } from '#/lib/booking'

type BookingStatus = BookingResponse['status']

/**
 * Themed class strings per booking status, reusing the dashboard's existing
 * accent/neutral/destructive tokens so no new colors are introduced.
 */
const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:
    'bg-[color-mix(in_oklab,var(--brand-orange)_16%,transparent)] text-[var(--brand-orange-deep)]',
  rescheduled:
    'border border-[var(--line)] bg-[var(--dash-panel-muted)] text-[var(--sea-ink-soft)]',
  completed:
    'border border-[var(--line)] bg-[var(--dash-panel-muted)] text-[var(--sea-ink-soft)]',
  cancelled:
    'bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] text-[var(--destructive)]',
}

/**
 * Small pill that communicates a booking's current status with a consistent,
 * theme-aware color. Presentational only.
 *
 * @param status - The booking status to display.
 */
export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold capitalize',
        STATUS_STYLES[status] ?? STATUS_STYLES.pending,
      )}
    >
      {status}
    </span>
  )
}
